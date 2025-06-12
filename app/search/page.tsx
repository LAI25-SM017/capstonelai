import { Suspense } from 'react';
import { Search } from 'lucide-react';
import CourseCard from '@/components/course-card';

// Definisikan tipe data Course
interface Course {
  id: number;
  course_id: number;
  course_title: string;
  subject: string;
  level: string;
  url: string;
  is_paid: boolean;
  price: number;
  image_banner_url: string;
}

// Fungsi untuk mengambil hasil pencarian dari API
async function getSearchResults(query: string): Promise<Course[]> {
  if (!query) {
    return []; // Jika tidak ada query, kembalikan array kosong
  }

  const endpoint = `https://dev-nc-api.f3h.net/api/courses?search=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Gagal melakukan pencarian:', res.statusText);
      return [];
    }
    const data = await res.json();
    return data.data.courses || [];
  } catch (error) {
    console.error('Error saat fetch pencarian:', error);
    return [];
  }
}

// Komponen utama halaman pencarian
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Tunggu searchParams untuk di-resolve
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : '';
  const searchResults = await getSearchResults(query);

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8 min-h-[70vh]">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Search className="h-8 w-8 text-indigo-500" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-100">
              Search Results
            </h1>
            {query && (
              <p className="text-lg text-gray-400 mt-1">
                Menampilkan hasil untuk: <span className="font-semibold text-indigo-500">"{query}"</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tampilkan hasil atau pesan jika tidak ditemukan */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-ncmidnight rounded-lg shadow-sm border border-indigo-800">
          <h2 className="text-2xl font-semibold text-indigo-700">Tidak Ada Hasil Ditemukan</h2>
          <p className="text-gray-400 mt-2">
            Coba gunakan kata kunci lain untuk menemukan kursus yang Anda cari.
          </p>
        </div>
      )}
    </div>
  );
}