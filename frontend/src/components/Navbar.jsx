import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NeonButton from "./NeonButton.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="border-b border-edge bg-void/70 backdrop-blur sticky top-0 z-20">
      <nav className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
        <Link
          to={user ? "/dashboard" : "/"}
          className="font-display text-xl font-black tracking-[0.25em] text-cyan neon-text"
        >
          NEON<span className="text-magenta">AUTH</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline font-mono text-xs text-muted">
                @{user.username}
              </span>
              <NeonButton variant="magenta" onClick={handleLogout}>
                Logout
              </NeonButton>
            </>
          ) : (
            <>
              <Link to="/login">
                <NeonButton variant="cyan">Login</NeonButton>
              </Link>
              <Link to="/register">
                <NeonButton variant="lime">Register</NeonButton>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
