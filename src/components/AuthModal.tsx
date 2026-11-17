import React, { useState } from 'react';
import { useMapStore } from '../store/useMapStore';
import { X, Lock, User, Cloud, Database, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, currentUser, logout, isSyncing, lastSyncedAt } =
    useMapStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Harap masukkan username dan password.');
      return;
    }

    setLoading(true);
    const result =
      mode === 'login'
        ? await login(username.trim(), password)
        : await register(username.trim(), password);

    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#10141d] border border-[#233044] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1f2b3e] flex items-center justify-between bg-[#0b0e14]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Cloudflare D1 Sync</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  SQLite Edge
                </span>
              </h2>
              <p className="text-[10.5px] text-gray-400">Sinkronisasi Progress &amp; Pin Selamanya</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If Already Logged In */}
        {currentUser ? (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Login Sebagai: {currentUser.username}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Akun kamu terhubung dan tersimpan <strong>selamanya</strong> di Cloudflare D1. Setiap perubahan checklist dan custom pin akan otomatis tersinkron ke cloud.
              </p>
              {lastSyncedAt && (
                <div className="text-[10.5px] text-emerald-400/80 font-mono pt-1">
                  Terakhir disinkronkan: {new Date(lastSyncedAt).toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  useMapStore.getState().syncToCloud();
                }}
                disabled={isSyncing}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#1d2837] border border-cyan-500/40 text-cyan-300 hover:bg-[#253549] transition flex items-center justify-center gap-1.5"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="p-6 space-y-4">
            {/* Mode Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0b0e14] border border-[#1f2b3e]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  mode === 'login'
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  mode === 'register'
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Buat Akun Baru
              </button>
            </div>

            {/* State Override Notice */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Aturan Sinkronisasi:</strong> Saat berhasil login, data lokal di peramban saat ini akan <strong>otomatis ditimpa</strong> dengan state data akun D1 kamu. Sesi login tersimpan <strong>selamanya</strong>.
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username kamu"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#0a0d13] border border-[#233044] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#0a0d13] border border-[#233044] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>{mode === 'login' ? 'Login & Timpa State' : 'Daftar Akun Baru'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
