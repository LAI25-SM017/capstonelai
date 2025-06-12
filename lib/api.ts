import { subjectToNum, levelToNum } from '@/lib/utils';

const BASE_URL = 'https://dev-nc-api.f3h.net';

interface Course {
  id: number
  course_id: number
  course_title: string
  subject: string
  level: string
  url: string
  is_paid: boolean
  price: number
  image_banner_url: string
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const getProfile = async (token: string) => {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const getCourses = async (filters?: string) => {
  const res = await fetch(`${BASE_URL}/api/courses?${filters}`);
  return res.json();
};

export const getCourseById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/courses/${id}`);
  return res.json();
};

export const getContentBased = async (course_id: string, n: number = 5) => {
  const res = await fetch(`${BASE_URL}/api/courses/recommender1?course_id=${course_id}&n=${n}`);
  return res.json();
};

export const getCollaborative = async (token: string, n: number = 5) => {
  const res = await fetch(`${BASE_URL}/api/courses/recommender3?n=${n}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const submitOnboarding = async (token: string, body: any) => {
  const res = await fetch(`${BASE_URL}/onboarding`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(body)
  });
  return res.json();
};

export async function getMainCourses(
  token: string | undefined,
  subject?: string,
  level?: string,
  is_paid?: string,
  title?: string,
  page: number = 1
): Promise<{ courses: Course[]; totalPages: number }> {
  const apiBaseUrl = "https://dev-nc-api.f3h.net";
  const fetchOptions: RequestInit = {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  };
  const queryParams = new URLSearchParams();

  if (subject) queryParams.set("subject", subject);
  if (level) queryParams.set("level", level);
  if (is_paid) queryParams.set("is_paid", is_paid);
  if (title) queryParams.set("title", title);
  queryParams.set("page", page.toString());
  queryParams.set("per_page", "12");
  queryParams.set("order_by", "num_subscribers");
  queryParams.set("order_direction", "desc");

  const endpoint = `${apiBaseUrl}/api/courses?${queryParams.toString()}`;

  try {
    const res = await fetch(endpoint, fetchOptions);
    if (!res.ok) {
      console.error(`Failed to fetch data from ${endpoint}:`, res.statusText);
      return { courses: [], totalPages: 1 };
    }
    const json = await res.json();
    return { courses: json.data.courses || [], totalPages: json.data.pages || 1 };
  } catch (error) {
    console.error(error);
    return { courses: [], totalPages: 1 };
  }
}

export async function getRecommendedCourses(token: string): Promise<Course[]> {
  // Get user profile
  const endpoint = `${BASE_URL}/me`;
  const fetchOptions: RequestInit = {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: "no-store"
  };
  try {
    const res = await fetch(endpoint, fetchOptions);
    if (!res.ok) {
      console.error("Gagal mengambil data profil:", res.statusText);
      return [];
    }

    const json = await res.json();

    const usedInCollaborative = json.data.user.used_in_collaborative;
    const onboardingDone = json.data.user.onboarding_done;

    if (!usedInCollaborative) {
      if (onboardingDone) {
        const subjects = json.data.preferences.subject;
        const levels = json.data.preferences.level;

        let subjectArgs = ''
        subjects.map((subject: string) => {
          if (subjectToNum[subject]) {
            subjectArgs += `${subjectToNum[subject]},`;
          }
        });
        subjectArgs = subjectArgs.slice(0, -1);

        let levelArgs = ''
        levels.map((level: string) => {
          if (levelToNum[level]) {
            levelArgs += `${levelToNum[level]},`;
          }
        });
        levelArgs = levelArgs.slice(0, -1);

        const { courses } = await getMainCourses(token, subjectArgs, levelArgs, undefined, undefined);
        return courses;
      }
      
      const { courses } = await getMainCourses(token, undefined, undefined, undefined, undefined);
      return courses;
    }
    
    // Ambil rekomendasi kursus berdasarkan user_id
    const coursesEndpoint = `${BASE_URL}/api/courses/recommender3?&n=20`;
    const coursesRes = await fetch(coursesEndpoint, fetchOptions);
    
    if (!coursesRes.ok) {
      console.error("Gagal mengambil data rekomendasi kursus:", coursesRes.statusText);
      return [];
    }
    
    const coursesJson = await coursesRes.json();
    return coursesJson.data || [];
  } catch (error) {
    console.error("Error saat fetch data rekomendasi kursus:", error);
    return [];
  }

}
