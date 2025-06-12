'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, Mail, Settings, ShieldAlert } from 'lucide-react';

// Tipe untuk data pengguna dari endpoint /me
interface UserProfile {
  username: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    // Jika tidak ada token, langsung arahkan ke halaman login
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fungsi untuk mengambil data profil
    const fetchProfile = async () => {
      try {
        const res = await fetch('https://dev-nc-api.f3h.net/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Gagal memuat profil. Silakan login kembali.');
        }

        const data = await res.json();
        
        // PERBAIKAN: Mengambil data dari `data.data.user` sesuai struktur API
        if (data && data.data && data.data.user) {
          setUser(data.data.user);
        } else {
          throw new Error('Struktur data profil tidak sesuai harapan.');
        }

      } catch (err: any) {
        setError(err.message);
        // Jika token tidak valid, hapus dan redirect
        Cookies.remove('token');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Fungsi untuk mereset preferensi
  const handleResetPreferences = async () => {
    setLoading(true);
    const token = Cookies.get('token');

    try {
      const res = await fetch('https://dev-nc-api.f3h.net/onboarding', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Gagal mereset preferensi.');
      }
      
      // Jika berhasil, tutup modal dan arahkan ke halaman onboarding
      setShowConfirmModal(false);
      router.push('/onboarding');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Kondisi loading yang lebih sederhana
  if (loading) {
    return <div className="text-center mt-20">Memuat profil...</div>;
  }

  // Tampilan jika terjadi error
  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }
  
  // Jika setelah loading user tetap tidak ada
  if (!user) {
    return <div className="text-center mt-20">Tidak dapat memuat data pengguna.</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-[#1D2045] p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Profil */}
          <div className="bg-ncmidnight p-6 rounded-2xl shadow-sm border border-indigo-500 flex items-center space-x-5">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-indigo-100 text-3xl font-bold">
              {(user.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-100">{user.username}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Pengaturan Akun */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-indigo-200 mb-4">Pengaturan Akun</h2>
            <div className="bg-ncmidnight p-6 rounded-2xl shadow-sm border border-indigo-500 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-indigo-50">Preferensi Rekomendasi</h3>
                  <p className="text-sm text-gray-400">Atur ulang pilihan subjek dan level keahlian Anda.</p>
                </div>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-orange-100 text-orange-700 font-semibold px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <Settings className="inline-block w-4 h-4 mr-2" />
                  Reset Preferensi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-bold text-gray-900 mt-4">
                Reset Preferensi?
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Aksi ini akan menghapus preferensi subjek dan level Anda. Anda akan diarahkan kembali ke halaman onboarding.
                </p>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleResetPreferences}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 disabled:bg-red-400"
              >
                {loading ? 'Memproses...' : 'Ya, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
