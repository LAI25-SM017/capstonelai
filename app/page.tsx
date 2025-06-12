import { cookies } from "next/headers";
import ClientHome from "@/components/client-home"; // Import the client component
import { getMainCourses } from "@/lib/api"; // Move API logic to a separate file for reuse

export default async function Home({
  searchParams,
}: {
  searchParams: { subject?: string; level?: string; is_paid?: string; title?: string };
}) {
  const cookieStore = await cookies(); // Await the cookies() function
  const token = cookieStore.get("token")?.value; // Access the token

  // Await searchParams before accessing its properties
  const resolvedSearchParams = await searchParams;
  const subject = resolvedSearchParams?.subject || undefined;
  const level = resolvedSearchParams?.level || undefined;
  const is_paid = resolvedSearchParams?.is_paid || undefined;
  const title = resolvedSearchParams?.title || undefined;

  // Fetch initial data on the server
  const initialData = await getMainCourses(token, subject, level, is_paid, title, 1);

  return (
    <ClientHome
      initialCourses={initialData.courses}
      initialTotalPages={initialData.totalPages}
      searchParams={resolvedSearchParams}
      token={token}
    />
  );
}