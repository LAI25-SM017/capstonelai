import CourseCard from "@/components/course-card";

// Definisikan tipe data yang akurat agar sesuai dengan respons API
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

// Fungsi untuk mengambil data 9 kursus acak dari API
async function getRandomCourses(): Promise<Course[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dev-nc-api.f3h.net";
  const endpoint = `${apiBaseUrl}/api/courses/random?n=9`;

  try {
    const res = await fetch(endpoint, {
      // 'no-store' penting digunakan agar Next.js tidak menyimpan cache dari respons ini.
      // Ini memastikan pengguna selalu mendapatkan kursus acak yang baru setiap kali mengunjungi halaman.
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Gagal mengambil data kursus acak dari API:", res.statusText);
      throw new Error("Gagal mengambil data kursus");
    }

    const json = await res.json();
    // Kembalikan array data atau array kosong jika tidak ada
    return json.data || [];
  } catch (error) {
    console.error(error);
    // Kembalikan array kosong jika terjadi error saat proses fetch
    return [];
  }
}

// Ini adalah Server Component. Next.js akan menunggunya selesai mengambil data
// sebelum merender halaman.
export default async function CoursesPage() {
  const randomCourses = await getRandomCourses();

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8 bg-[#1D2045]">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-100">
          Course
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Random Course for You
        </p>
      </div>

      {randomCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700">Gagal Memuat Kursus</h2>
          <p className="text-gray-500 mt-2">
            Terjadi kesalahan saat mengambil data. Silakan coba lagi beberapa saat.
          </p>
        </div>
      )}
    </div>
  );
}
