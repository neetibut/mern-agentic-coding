import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import NeonCard from "../components/NeonCard.jsx";
import NeonInput from "../components/NeonInput.jsx";
import NeonButton from "../components/NeonButton.jsx";
import AddressList from "../components/AddressList.jsx";

export default function Dashboard() {
  const { user, setCurrentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    username: user.username,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function update(field) {
    return (e) => setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function saveProfile(e) {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setSavingProfile(true);
    try {
      const data = await api.put("/users/me", profile);
      setCurrentUser(data.user);
      setProfileMsg("Profile updated");
    } catch (err) {
      setProfileErr(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      await api.del("/users/me");
      // Cookie is cleared server-side; reset local auth state.
      await logout().catch(() => {});
      navigate("/");
    } catch {
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          // operator dashboard
        </p>
        <h1 className="font-display text-3xl font-black text-magenta neon-text mt-2">
          @{user.username}
        </h1>
        <p className="font-mono text-xs text-muted mt-1">{user.email}</p>
      </div>

      {/* Profile */}
      <NeonCard>
        <h2 className="font-display text-lg uppercase tracking-[0.2em] text-cyan neon-text mb-5">
          Profile
        </h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <NeonInput
            id="username"
            label="Username"
            value={profile.username}
            onChange={update("username")}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <NeonInput
              id="firstName"
              label="First name"
              value={profile.firstName}
              onChange={update("firstName")}
            />
            <NeonInput
              id="lastName"
              label="Last name"
              value={profile.lastName}
              onChange={update("lastName")}
            />
          </div>

          {profileErr && <p className="font-mono text-xs text-magenta">{profileErr}</p>}
          {profileMsg && <p className="font-mono text-xs text-lime">{profileMsg}</p>}

          <NeonButton type="submit" variant="cyan" disabled={savingProfile}>
            {savingProfile ? "Saving…" : "Save profile"}
          </NeonButton>
        </form>
      </NeonCard>

      {/* Addresses */}
      <NeonCard>
        <AddressList />
      </NeonCard>

      {/* Danger zone */}
      <NeonCard className="border-magenta/40">
        <h2 className="font-display text-lg uppercase tracking-[0.2em] text-magenta neon-text mb-3">
          Danger zone
        </h2>
        <p className="font-mono text-sm text-muted mb-4">
          Permanently wipe your identity from the grid. This cannot be undone.
        </p>

        {confirmingDelete ? (
          <div className="space-y-3">
            <p className="font-mono text-sm text-magenta">
              Confirm deletion of @{user.username}?
            </p>
            <div className="flex gap-3">
              <NeonButton variant="danger" onClick={deleteAccount} disabled={deleting}>
                {deleting ? "Wiping…" : "Yes, delete forever"}
              </NeonButton>
              <NeonButton
                variant="cyan"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
              >
                Cancel
              </NeonButton>
            </div>
          </div>
        ) : (
          <NeonButton variant="danger" onClick={() => setConfirmingDelete(true)}>
            Delete account
          </NeonButton>
        )}
      </NeonCard>
    </main>
  );
}
