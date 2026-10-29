import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Sun, Moon, Hammer, ShoppingBag, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/api';

export const Nav: React.FC = () => {
  const location = useLocation();
  const { user, role, switchRole, logout } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const isLight = document.documentElement.classList.contains('light');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  };

  const forgeSlug = import.meta.env.VITE_FORGE_SLUG || 'forge-secret-8931';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-bg/85 border-b border-cardBorder transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clay to-[#b84e1b] flex items-center justify-center text-white shadow-lg shadow-clay/25 transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-tx flex items-center gap-1.5">
              CraftBridge <span className="text-clay">AI</span>
            </span>
            <span className="text-[10px] font-mono text-mu uppercase tracking-wider -mt-1">
              Co-pilot for Artisans
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] dark:bg-white/[0.03] p-1.5 rounded-2xl border border-cardBorder">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              location.pathname === '/' ? 'bg-clay text-white shadow-sm' : 'text-tx/70 hover:text-tx hover:bg-white/5'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/customer"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              location.pathname.startsWith('/customer')
                ? 'bg-clay text-white shadow-sm'
                : 'text-tx/70 hover:text-tx hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Customer Portal
          </Link>
          <Link
            to="/artisan"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              location.pathname.startsWith('/artisan')
                ? 'bg-clay text-white shadow-sm'
                : 'text-tx/70 hover:text-tx hover:bg-white/5'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            Artisan Studio
          </Link>
          {role === 'developer' && (
            <Link
              to={`/${forgeSlug}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                location.pathname.includes('forge')
                  ? 'bg-teal text-bg font-semibold shadow-sm'
                  : 'text-teal hover:bg-teal/10'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Model Forge
            </Link>
          )}
        </nav>

        {/* Right Tools: Role Quick-Switcher & Theme & Auth */}
        <div className="flex items-center gap-3">
          {/* Role selector dropdown for seamless evaluation */}
          <div className="flex items-center gap-1.5 bg-cardBg border border-cardBorder px-2.5 py-1 rounded-xl text-xs font-mono">
            <span className="text-mu hidden sm:inline text-[11px]">Role:</span>
            <select
              aria-label="Active Role"
              value={role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="bg-transparent text-clay font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="customer" className="bg-bg2 text-tx">Customer</option>
              <option value="artisan" className="bg-bg2 text-tx">Artisan</option>
              <option value="developer" className="bg-bg2 text-tx">Developer (Forge)</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="w-10 h-10 rounded-xl border border-cardBorder flex items-center justify-center text-tx/80 hover:text-tx hover:bg-white/5 transition-colors touch-target"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-clay/20 border border-clay/40 flex items-center justify-center text-clay text-xs font-bold font-mono">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={logout}
                className="text-xs text-mu hover:text-bad transition-colors"
                title="Sign out"
              >
                Exit
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-medium bg-white/10 hover:bg-white/15 text-tx px-3.5 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
