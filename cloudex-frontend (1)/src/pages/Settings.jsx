import { useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import * as api from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { initials } from "../utils/format";

export default function Settings() {
  const { user } = useAuth();
  const toast = useToast();

  const [password, setPassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (newpassword !== confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }
    if (newpassword.length < 6) {
      toast.error("New password should be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.updatePassword(password, newpassword);
      toast.success(data.message || "Password changed successfully.");
      setPassword("");
      setNewpassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn't update your password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fadeUp">
      <div>
        <h2 className="font-display font-semibold text-2xl text-ink">Settings</h2>
        <p className="text-sm text-ink-muted mt-1">
          Manage your account and security.
        </p>
      </div>

      <div className="bg-surface rounded-xl2 shadow-card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-cobalt-soft flex items-center justify-center text-cobalt font-display font-semibold text-lg">
          {initials(user?.name) || "U"}
        </div>
        <div>
          <p className="font-display font-semibold text-ink">{user?.name}</p>
          <p className="text-sm text-ink-muted">{user?.email}</p>
          <p className="text-xs text-ink-faint mt-1 capitalize">
            {user?.role || "user"} account
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-xl2 shadow-card p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <KeyRound size={16} className="text-cobalt" />
          <h3 className="font-display font-semibold text-ink">Change password</h3>
        </div>
        <p className="text-sm text-ink-muted mb-5">
          Use a strong password you're not using elsewhere.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <Field
            label="Current password"
            value={password}
            onChange={setPassword}
            show={show}
            setShow={setShow}
          />
          <Field
            label="New password"
            value={newpassword}
            onChange={setNewpassword}
            show={show}
            setShow={setShow}
          />
          <Field
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={show}
            setShow={setShow}
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-cobalt hover:bg-cobalt-deep text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, show, setShow }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-muted mb-1.5">
        {label}
      </label>
      <div className="relative max-w-sm">
        <input
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-line rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:border-cobalt transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}
