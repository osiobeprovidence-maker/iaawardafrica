import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onExit: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onExit }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@iconicawardsafrica.com');
  const [password, setPassword] = useState('iaa2026admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);
      if (success) {
        onSuccess();
      } else {
        setError('Invalid credentials. Check email and password or use one of the demo quick links below.');
      }
    }, 400);
  };

  const setDemoCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('iaa2026admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#0B0B0B] text-[#F2A01F] flex items-center justify-center mx-auto border border-[#C9971C]/40 shadow">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#0B0B0B]">
            IAA Administrative Command
          </h2>
          <p className="text-xs text-neutral-500">
            Authorized personnel login for ballot audits, category curation, transactions, and live results.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#E8471C]"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#E8471C]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Authenticate & Enter Dashboard
              </>
            )}
          </button>
        </form>

        {/* Demo Roles Quick Pick */}
        <div className="pt-4 border-t border-neutral-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">
            Quick-Select Test Role Credentials:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@iconicawardsafrica.com')}
              className="p-2 border border-neutral-200 hover:border-[#E8471C] rounded text-left transition-colors"
            >
              <strong className="block text-[11px] text-neutral-900">Super Admin</strong>
              <span className="text-[9px] text-neutral-500">Full Rights</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('staff@iconicawardsafrica.com')}
              className="p-2 border border-neutral-200 hover:border-[#E8471C] rounded text-left transition-colors"
            >
              <strong className="block text-[11px] text-neutral-900">Staff Manager</strong>
              <span className="text-[9px] text-neutral-500">Edit / CRUD</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('auditor@iaa-audits.org')}
              className="p-2 border border-neutral-200 hover:border-[#E8471C] rounded text-left transition-colors"
            >
              <strong className="block text-[11px] text-neutral-900">Auditor</strong>
              <span className="text-[9px] text-neutral-500">Read-Only</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onExit}
            className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
