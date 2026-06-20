import { useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import NeonButton from "./NeonButton.jsx";
import AddressForm from "./AddressForm.jsx";

function formatLine(addr) {
  return [addr.street, addr.city, addr.state, addr.zip, addr.country]
    .filter(Boolean)
    .join(", ");
}

export default function AddressList() {
  const { user, setCurrentUser } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // Default first, otherwise preserve insertion order. Copy before sorting so
  // we never mutate the array held in auth context.
  const addresses = [...(user.addresses || [])].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault)
  );

  async function handleAdd(form) {
    const data = await api.post("/users/me/addresses", form);
    setCurrentUser(data.user);
    setAdding(false);
  }

  async function handleUpdate(id, form) {
    const data = await api.put(`/users/me/addresses/${id}`, form);
    setCurrentUser(data.user);
    setEditingId(null);
  }

  async function handleDelete(id) {
    setBusyId(id);
    try {
      const data = await api.del(`/users/me/addresses/${id}`);
      setCurrentUser(data.user);
    } finally {
      setBusyId(null);
    }
  }

  async function handleSetDefault(id) {
    setBusyId(id);
    try {
      const data = await api.put(`/users/me/addresses/${id}/default`);
      setCurrentUser(data.user);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg uppercase tracking-[0.2em] text-magenta neon-text">
          Addresses
        </h2>
        {!adding && (
          <NeonButton variant="lime" onClick={() => setAdding(true)}>
            + Add
          </NeonButton>
        )}
      </div>

      {adding && (
        <div className="mb-5 border border-edge rounded-sm p-4 bg-panel-2/50">
          <AddressForm
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
            submitLabel="Add address"
          />
        </div>
      )}

      {addresses.length === 0 && !adding && (
        <p className="font-mono text-sm text-muted">No addresses on file yet.</p>
      )}

      <ul className="space-y-3">
        {addresses.map((addr) =>
          editingId === addr._id ? (
            <li key={addr._id} className="border border-cyan/40 rounded-sm p-4 bg-panel-2/50">
              <AddressForm
                initial={addr}
                onSubmit={(form) => handleUpdate(addr._id, form)}
                onCancel={() => setEditingId(null)}
                submitLabel="Update"
              />
            </li>
          ) : (
            <li
              key={addr._id}
              className="flex items-start justify-between gap-4 border border-edge rounded-sm p-4 bg-panel-2/40"
            >
              <div>
                <p className="font-display text-sm uppercase tracking-[0.15em] text-cyan">
                  {addr.label || "Address"}
                  {addr.isDefault && (
                    <span className="ml-2 align-middle font-mono text-[0.65rem] tracking-[0.2em] text-lime border border-lime/50 rounded-sm px-1.5 py-0.5">
                      DEFAULT
                    </span>
                  )}
                </p>
                <p className="font-mono text-sm text-muted mt-1">
                  {formatLine(addr) || "—"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!addr.isDefault && (
                  <NeonButton
                    variant="lime"
                    disabled={busyId === addr._id}
                    onClick={() => handleSetDefault(addr._id)}
                  >
                    {busyId === addr._id ? "…" : "Make default"}
                  </NeonButton>
                )}
                <NeonButton variant="cyan" onClick={() => setEditingId(addr._id)}>
                  Edit
                </NeonButton>
                <NeonButton
                  variant="danger"
                  disabled={busyId === addr._id}
                  onClick={() => handleDelete(addr._id)}
                >
                  {busyId === addr._id ? "…" : "Delete"}
                </NeonButton>
              </div>
            </li>
          )
        )}
      </ul>
    </section>
  );
}
