"use client";

import { useState, useEffect } from "react";
import CourseCard from "@/components/course-card";
import FilterSidebar from "@/components/filter-sidebar";
import MobileFilters from "@/components/mobile-filters";
import SearchBar from "@/components/search-bar";
import { Search, TrendingUp } from "lucide-react"

import { getMainCourses, getRecommendedCourses } from "@/lib/api";
import { useRef } from "react";

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

export default function ClientHome({
  initialCourses,
  initialTotalPages,
  searchParams,
  token,
}: {
  initialCourses: Course[];
  initialTotalPages: number;
  searchParams: { subject?: string; level?: string; is_paid?: string; title?: string };
  token: string | undefined;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [mainCourses, setMainCourses] = useState<Course[]>(initialCourses);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const [filters, setFilters] = useState({
    subject: searchParams.subject || "",
    level: searchParams.level || "",
    is_paid: searchParams.is_paid || "",
    title: searchParams.title || "",
  });

  const mainCoursesRef = useRef<HTMLDivElement>(null);

  const fetchMainCourses = async (page: number) => {
    const { subject, level, is_paid, title } = filters;
    const data = await getMainCourses(token, subject, level, is_paid, title, page);
    setMainCourses(data.courses);
    setTotalPages(data.totalPages);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to the first page
      fetchMainCourses(1);
    }, 300); // Adjust debounce delay as needed

    return () => clearTimeout(timeout);
  }, [filters]);

  const fetchRecommendedCourses = async () => {
    if (token) {
      const courses = await getRecommendedCourses(token);
      setRecommendedCourses(courses);
    } else {
      setRecommendedCourses([]); // Clear recommendations on logout
    }
  };

  useEffect(() => {
      setCurrentPage(1);
      fetchMainCourses(1);
  }, [searchParams]);

  useEffect(() => {
      fetchMainCourses(currentPage);
      fetchRecommendedCourses();
        // Scroll to the top of the main courses section
      if (mainCoursesRef.current) {
        mainCoursesRef.current.scrollIntoView({ behavior: "smooth" });
      }
  }, [currentPage, token]);

  useEffect(() => {
    if (mainCoursesRef.current) {
      mainCoursesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filters]);

  const hasFilters = !!(searchParams.subject || searchParams.level || searchParams.is_paid || searchParams.title);

  return (
    <main className="min-h-screen bg-gray-50">

      <section className="bg-white py-12 md:py-20 border-b">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
              NextCourse – The Next Step Starts Here
            </h1>
            <p className="text-teal-600 font-medium text-lg mb-4">
              Personalized Course Recommender
            </p>
            <p className="text-gray-600 mb-8 text-lg">
              Find the perfect courses tailored to your interests and career goals
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {recommendedCourses.length > 0 && (
        <section className="container px-4 mx-auto max-w-6xl py-8">
            <div className="flex items-center mb-6 space-x-3">
                <TrendingUp className="h-7 w-7 text-gray-800" />
                <h2 className="text-2xl font-bold text-gray-900">Recommended Courses Just For You 💓</h2>
            </div>
            <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
                {recommendedCourses.map((course) => (
                   <div key={`trending-${course.id}`} className="flex-shrink-0 w-80">
                        <CourseCard course={course} />
                   </div>
                ))}
            </div>
        </section>
      )}

      <div
        ref={mainCoursesRef}
        className="container px-4 mx-auto max-w-6xl py-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {hasFilters ? "Top Courses" : "Top Courses"}
        </h2>
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:hidden mb-6">
            <MobileFilters onChange={(newFilters) => handleFilterChange(newFilters)} />
          </div>
          <div className="hidden lg:block">
            <FilterSidebar onChange={(newFilters) => handleFilterChange(newFilters)} />
          </div>
          <div className="lg:col-span-3">
            {mainCourses.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mainCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-l"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-gray-100">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-r"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg">
                <p className="text-gray-600">
                  {hasFilters ? "Tidak ada kursus yang cocok dengan filter Anda." : "Tidak ada rekomendasi saat ini."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}