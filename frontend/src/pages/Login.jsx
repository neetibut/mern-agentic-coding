import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NeonCard from "../components/NeonCard.jsx";
import NeonInput from "../components/NeonInput.jsx";
import NeonButton from "../components/NeonButton.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <NeonCard>
        <h1 className="font-display text-2xl uppercase tracking-[0.2em] text-cyan neon-text mb-6">
          Access terminal
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeonInput
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            autoComplete="email"
            required
          />
          <NeonInput
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            autoComplete="current-password"
            required
          />

          {error && <p className="font-mono text-xs text-magenta">{error}</p>}

          <NeonButton type="submit" variant="cyan" disabled={busy} className="w-full">
            {busy ? "Connecting…" : "Login"}
          </NeonButton>
        </form>

        <p className="mt-6 font-mono text-xs text-muted">
          No identity yet?{" "}
          <Link to="/register" className="text-lime hover:neon-text">
            Create one
          </Link>
        </p>
      </NeonCard>
    </main>
  );
}
