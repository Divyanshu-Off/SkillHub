import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ username, password });
      } else {
        await register({ username, email, password });
      }
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.password?.[0] ||
        'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-sm bg-card border border-border p-7 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
              [Auth / Dialog]
            </span>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {mode === 'login' ? 'Sign In to SkillHub' : 'Create Engineer Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
              Username *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. jdoe"
              className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
              />
            </div>
          )}

          <div>
            <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-sm bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer shadow-sm mt-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {mode === 'login' ? (
              <span className="inline-flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" /> Authenticate
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Register
              </span>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-border text-xs font-mono text-muted-foreground">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-foreground hover:underline font-semibold cursor-pointer"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-foreground hover:underline font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
