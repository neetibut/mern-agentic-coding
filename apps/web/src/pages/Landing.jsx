import { Link } from "react-router-dom";
import NeonButton from "../components/NeonButton.jsx";

export default function Landing() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-20 sm:py-28">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan mb-4">
        // identity grid online
      </p>
      <h1 className="font-display text-4xl sm:text-6xl font-black leading-tight">
        <span className="text-cyan neon-text">JACK IN.</span>{" "}
        <span className="text-magenta neon-text">OWN YOUR</span>
        <br />
        <span className="text-lime neon-text">DATA PROFILE.</span>
      </h1>
      <p className="mt-6 max-w-xl font-body text-lg text-muted">
        Register a secure identity, manage your handle and addresses, and wipe
        your account from the grid whenever you choose. Cookie-sealed sessions,
        bcrypt-locked credentials.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/register">
          <NeonButton variant="lime" className="px-8 py-3">
            Create identity
          </NeonButton>
        </Link>
        <Link to="/login">
          <NeonButton variant="cyan" className="px-8 py-3">
            Access terminal
          </NeonButton>
        </Link>
      </div>

      <div className="glitch-divider mt-20" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-sm">
        <Feature title="SECURE AUTH" body="JWT sealed in an httpOnly cookie. No tokens loose in the browser." />
        <Feature title="BCRYPT VAULT" body="Passwords salted and hashed — never stored in plaintext." />
        <Feature title="FULL CONTROL" body="Edit your profile, stack addresses, or self-destruct your account." />
      </div>
    </main>
  );
}

function Feature({ title, body }) {
  return (
    <div className="border-l-2 border-purple pl-4">
      <p className="text-purple uppercase tracking-[0.2em]">{title}</p>
      <p className="text-muted mt-2">{body}</p>
    </div>
  );
}
