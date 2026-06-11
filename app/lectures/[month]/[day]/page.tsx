import { notFound } from "next/navigation";
import MarkdownView from "@/components/MarkdownView";
import { getAllLectures, getLecture } from "@/lib/lectures";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLectures().map((lec) => ({
    month: lec.monthSlug,
    day: lec.daySlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ month: string; day: string }>;
}) {
  const { month, day } = await params;
  const lec = getLecture(month, day);
  return { title: lec ? lec.title : "강의" };
}

export default async function LecturePage({
  params,
}: {
  params: Promise<{ month: string; day: string }>;
}) {
  const { month, day } = await params;
  const lec = getLecture(month, day);
  if (!lec) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <MarkdownView markdown={lec.markdown} />
    </article>
  );
}
