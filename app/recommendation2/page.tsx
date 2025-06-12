import CourseCard from "@/components/course-card";
import { Lightbulb } from "lucide-react";

// Definisikan tipe data Course (pastikan sesuai)
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

// Fungsi untuk mengambil rekomendasi dari API
async function getRecommendations(courseId: string): Promise<Course[]> {
  // Jika tidak ada ID, jangan lakukan apa-apa
  if (!courseId) {
    return [];
  }

  // Kita gunakan recommender1 yang berdasarkan course_id
  const endpoint = `https://dev-nc-api.f3h.net/api/courses/recommender1?course_id=${courseId}&n=6`;

  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Gagal mengambil rekomendasi:', res.statusText);
      return [];
    }
    const data = await res.json();
    console.log(data[0])
    return data.data || [];
  } catch (error) {
    console.error('Error saat fetch rekomendasi:', error);
    return [];
  }
}

// Komponen Halaman (Server Component)
export default async function Recommendation2Page({
  searchParams,
}: {
  // Next.js secara otomatis mengisi searchParams dari URL
  searchParams: { course_id?: string };
}) {
  // 1. Ambil `course_id` dari searchParams
  const courseId = searchParams.course_id;

  // Jika tidak ada course_id di URL, tampilkan pesan error
  if (!courseId) {
    return <div className="text-center mt-20">ID Kursus tidak ditemukan di URL.</div>;
  }
  
  // 2. Gunakan `courseId` untuk mengambil data
  const recommendations = await getRecommendations(courseId);

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8 min-h-[70vh]">
      <div className="mb-8 flex items-center space-x-3">
        <Lightbulb className="h-8 w-8 text-indigo-500" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-100">
            Similar Courses
          </h1>
          <p className="text-lg text-gray-400 mt-1">
            Maybe you like this
          </p>
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-gray-700">No Recommendation</h2>
          <p className="text-gray-500 mt-2">
            No similar courses.
          </p>
        </div>
      )}
    </div>
  );
}
