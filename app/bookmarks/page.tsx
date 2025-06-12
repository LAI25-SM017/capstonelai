import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CourseCard from '@/components/course-card';
import { Bookmark } from 'lucide-react';

// Tipe data untuk Course, pastikan sesuai dengan yang ada di komponen CourseCard
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

// Tipe data untuk interaksi dari API
interface Interaction {
  course_id: number; // API hanya mengirimkan ini
  interaction_type: string;
}

// Fungsi untuk mengambil data bookmark dari server
async function getBookmarkedCourses(token: string): Promise<Course[]> {
  const apiBaseUrl = 'https://dev-nc-api.f3h.net';
  const meEndpoint = `${apiBaseUrl}/me`;

  try {
    // Langkah 1: Ambil daftar interaksi dari /me
    const meRes = await fetch(meEndpoint, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!meRes.ok) {
      console.error('Fail to take data:', meRes.statusText);
      return [];
    }

    const meData = await meRes.json();
    if (!meData.data || !meData.data.interactions) {
      return []; // Tidak ada interaksi
    }

    // Ambil semua course_id dari interaksi yang tipenya 'bookmark'
    const bookmarkedIds = meData.data.interactions
      .filter((interaction: Interaction) => interaction.interaction_type === 'bookmark')
      .map((interaction: Interaction) => interaction.course_id);
    
    if (bookmarkedIds.length === 0) {
      return []; // Tidak ada kursus yang di-bookmark
    }

    // Langkah 2: Ambil detail untuk setiap course_id secara paralel
    const coursePromises = bookmarkedIds.map((id: number) =>
      fetch(`${apiBaseUrl}/api/courses/${id}`).then(res => res.ok ? res.json() : null)
    );

    const courseResults = await Promise.all(coursePromises);
    
    // Filter hasil yang null (jika ada error) dan ambil data kursusnya
    const courses = courseResults
      .filter(result => result !== null)
      .map(result => result.data);

    return courses;

  } catch (error) {
    console.error(error);
    return [];
  }
}

// Ini adalah Server Component, aman untuk menggunakan async/await secara langsung
export default async function BookmarkedCoursesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  const bookmarkedCourses = await getBookmarkedCourses(token);

  return (
    <div className="container px-4 mx-auto max-w-6xl bg-[#1D2045] py-8 min-h-[70vh]">
      <div className="mb-8 flex items-center space-x-3">
        <Bookmark className="h-8 w-8 text-indigo-500" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-100">
            Your saved courses
          </h1>
          <p className="text-lg text-gray-400 mt-1">
            See your saved here.
          </p>
        </div>
      </div>

      {bookmarkedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedCourses.map((course) => (
            // Pastikan course tidak null sebelum merender
            course && <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-gray-700">You not save any course yet</h2>
          <p className="text-gray-500 mt-2 mb-6">
            Start exploring courses.
          </p>
          <Link href="/courses">
            <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
              Explore course
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
