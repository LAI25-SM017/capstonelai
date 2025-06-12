'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie'; // Anda perlu install: npm install js-cookie @types/js-cookie

export default function SignupPage() {
  // State untuk form input
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State untuk User Feedback
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Lakukan Pendaftaran
    try {
      const registerRes = await fetch('https://dev-nc-api.f3h.net/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        // Ambil pesan error dari API, atau gunakan pesan default
        throw new Error(errorData.message || 'Pendaftaran gagal. Silakan coba lagi.');
      }

      // 2. Jika Pendaftaran Berhasil, Langsung Lakukan Login untuk UX yang lebih baik
      const loginRes = await fetch('https://dev-nc-api.f3h.net/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });

      if (!loginRes.ok) {
          // Jika login gagal setelah register, arahkan ke halaman login manual
          router.push('/auth/login?status=registered');
          return;
      }
      
      const loginData = await loginRes.json();
      const { access_token } = loginData.data;

      // 3. Simpan Token ke Cookies
      Cookies.set('token', access_token, { expires: 7, secure: true }); // Simpan token selama 7 hari

      // 4. Arahkan ke Halaman Onboarding
      router.push('/onboarding');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1D2045] px-4">
      <div className="w-full max-w-md">
        <div className="bg-ncmidnight p-8 rounded-2xl shadow-lg border border-indigo-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-100">Create new account</h1>
            <p className="text-gray-400 mt-2">Start your journey with us</p>
          </div>

          {/* Menampilkan pesan error jika ada */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-indigo-300 mb-1">Username</label>
              <input
                id="username"
                type="text"
                placeholder="input your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border-gray-300 px-4 py-3 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-indigo-300 mb-1">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-gray-300 px-4 py-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            <div>
                <label htmlFor="password"className="block text-sm font-medium text-indigo-300 mb-1">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border-gray-300 px-4 py-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign Up Now'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-400 mt-8">
            Already have account?{' '}
            <Link href="/auth/login" className="font-medium text-indigo-500 hover:text-indigo-300">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
