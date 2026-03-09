import React from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'BABRBABR') {
      onLogin();
    } else {
      setError('Onjuist wachtwoord');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-summa-indigo p-4">
      <div className="w-full max-w-md summa-card p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-summa-indigo/10 rounded-full flex items-center justify-center mb-4">
            <Lock size={32} className="text-summa-indigo" />
          </div>
          <h2 className="text-3xl text-summa-indigo">Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 uppercase tracking-wider text-summa-dark/60">
              Wachtwoord
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-summa-gray rounded-xl border-2 border-transparent focus:border-summa-indigo outline-none transition-all text-xl text-center tracking-widest"
              placeholder="••••••••"
            />
            {error && <p className="text-summa-red text-sm mt-2 text-center font-semibold">{error}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full summa-button bg-summa-indigo text-summa-white text-lg"
            >
              Inloggen
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full summa-button bg-transparent text-summa-dark/60 text-lg hover:text-summa-dark"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
