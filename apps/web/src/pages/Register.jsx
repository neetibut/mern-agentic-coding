import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NeonCard from "../components/NeonCard.jsx";
import NeonInput from "../components/NeonInput.jsx";
import NeonButton from "../components/NeonButton.jsx";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
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
      await register(form);
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
        <h1 className="font-display text-2xl uppercase tracking-[0.2em] text-lime neon-text mb-6">
          Create identity
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeonInput
            id="username"
            label="Username"
            value={form.username}
            onChange={update("username")}
            autoComplete="username"
            required
          />
          <NeonInput
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            autoComplete="email"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <NeonInput
              id="firstName"
              label="First name"
              value={form.firstName}
              onChange={update("firstName")}
              autoComplete="given-name"
            />
            <NeonInput
              id="lastName"
              label="Last name"
              value={form.lastName}
              onChange={update("lastName")}
              autoComplete="family-name"
            />
          </div>
          <NeonInput
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            autoComplete="new-password"
            required
          />

          {error && <p className="font-mono text-xs text-magenta">{error}</p>}

          <NeonButton type="submit" variant="lime" disabled={busy} className="w-full">
            {busy ? "Initializing…" : "Register"}
          </NeonButton>
        </form>

        <p className="mt-6 font-mono text-xs text-muted">
          Already on the grid?{" "}
          <Link to="/login" className="text-cyan hover:neon-text">
            Access terminal
          </Link>
        </p>
      </NeonCard>
    </main>
  );
}
