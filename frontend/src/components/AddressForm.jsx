import { useState } from "react";
import NeonInput from "./NeonInput.jsx";
import NeonButton from "./NeonButton.jsx";

const EMPTY = {
  label: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

export default function AddressForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <NeonInput label="Label" value={form.label} onChange={update("label")} placeholder="Home / Work" />
      <NeonInput label="Country" value={form.country} onChange={update("country")} />
      <div className="sm:col-span-2">
        <NeonInput label="Street" value={form.street} onChange={update("street")} />
      </div>
      <NeonInput label="City" value={form.city} onChange={update("city")} />
      <NeonInput label="State / Region" value={form.state} onChange={update("state")} />
      <NeonInput label="ZIP / Postal" value={form.zip} onChange={update("zip")} />

      {error && (
        <p className="sm:col-span-2 font-mono text-xs text-magenta">{error}</p>
      )}

      <div className="sm:col-span-2 flex gap-3 pt-1">
        <NeonButton type="submit" variant="lime" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </NeonButton>
        {onCancel && (
          <NeonButton variant="magenta" onClick={onCancel} disabled={saving}>
            Cancel
          </NeonButton>
        )}
      </div>
    </form>
  );
}
