import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ username, email, password });
      navigate('/projects', { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.password?.[0] ||
        'Registration failed. Please check your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6 p-8 sm:p-10 editorial-card rounded-sm"
      >
        <div className="space-y-1 text-left border-b border-border pb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
            [Registration / Account]
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Create Engineer Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Register to curate verified roadmaps and showcase technical projects.
          </p>
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
              placeholder="e.g. engineer_alex"
              className="w-full px-3 py-2.5 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@domain.io"
              className="w-full px-3 py-2.5 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
            />
          </div>

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
              placeholder="•••••••• (min 6 characters)"
              className="w-full px-3 py-2.5 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-sm bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer shadow-sm mt-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
            Register Account
          </button>
        </form>

        <div className="text-center text-xs font-mono text-muted-foreground pt-4 border-t border-border">
          Already registered?{' '}
          <Link to="/signin" className="text-foreground hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
