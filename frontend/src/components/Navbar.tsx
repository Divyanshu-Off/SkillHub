import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BackgroundGlow } from './BackgroundGlow';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(savedTheme);
    } else {
      // Default to light for warm editorial experience unless user system strictly prefers dark
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navItems = [
    { name: 'Overview', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Curriculums', path: '/paths' },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative selection:bg-amber-500/20 selection:text-amber-900 dark:selection:bg-amber-400/20 dark:selection:text-amber-200">
      <BackgroundGlow />

      {/* Architectural Minimalist Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-6">
            <Link to="/" className="group flex items-baseline gap-1.5 focus:outline-none">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground transition-opacity group-hover:opacity-85">
                SkillHub
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 align-baseline" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-1 hidden sm:inline-block">
                ed. 2026
              </span>
            </Link>

            {/* Nav Divider */}
            <span className="hidden md:inline-block h-4 w-px bg-border" />

            {/* Monospace Editorial Nav Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors duration-150 ${
                      isActive
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-foreground"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Auth state & theme switch */}
          <div className="flex items-center gap-3">
            {/* Mobile Nav Links */}
            <div className="flex md:hidden items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-2 py-1 text-[11px] font-mono uppercase tracking-wider ${
                      isActive ? 'text-foreground font-bold underline' : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  key="user-logged-in"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-border text-xs font-mono bg-card">
                    <UserIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{user.username}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="user-logged-out"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-2"
                >
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition"
                  >
                    <LogIn className="w-3 h-3" />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-3.5 py-1.5 rounded-sm bg-foreground text-background text-xs font-mono uppercase tracking-wider hover:opacity-90 transition font-medium shadow-sm"
                  >
                    Register
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-muted-foreground hover:text-foreground border border-border rounded-sm hover:bg-secondary transition cursor-pointer"
              title="Toggle theme mode"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Outlet />
      </main>

      {/* Minimalist Editorial Footer */}
      <footer className="hairline-t bg-background text-muted-foreground py-8 text-xs font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-foreground text-sm">SkillHub</span>
            <span>—</span>
            <span>Engineering Portfolio &amp; Roadmap Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>Django 5</span>
            <span>·</span>
            <span>PostgreSQL 16</span>
            <span>·</span>
            <span>React 19</span>
            <span>·</span>
            <span>Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Navbar;