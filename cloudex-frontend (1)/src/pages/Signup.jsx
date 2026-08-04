import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cloud, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Signup() {
  const { doSignup, loading, authError } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await doSignup(name, email, password);
    if (res.ok) {
      toast.success("Account created. Welcome!");
      navigate("/dashboard", { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cobalt/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm animate-fadeUp">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-cobalt flex items-center justify-center">
            <Cloud size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-xl text-white tracking-tight">
            CLOudex
          </span>
        </div>

        <div className="bg-surface rounded-xl2 shadow-pop p-8">
          <h1 className="font-display font-semibold text-2xl text-ink">
            Create your account
          </h1>
          <p className="text-sm text-ink-muted mt-1 mb-6">
            1 GB of free storage to start.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Lee"
                className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-cobalt transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-cobalt transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full border border-line rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:border-cobalt transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-coral bg-coral-soft rounded-lg px-3 py-2">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-cobalt hover:bg-cobalt-deep text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
