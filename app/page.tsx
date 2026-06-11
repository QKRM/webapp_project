import Link from "next/link";
import { getLectureTree } from "@/lib/lectures";

function shortTitle(t: string) {
  const afterDash = t.split(/[—–-]/).slice(1).join("-").trim() || t;
  return afterDash.split(/[:：]/)[0].trim();
}

export default function Home() {
  const tree = getLectureTree();
  const total = tree.reduce((n, m) => n + m.lectures.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          16주 풀스택 과정
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">백엔드 풀스택 웹앱 만들기</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          기획부터 배포까지. 설계 → 환경 세팅 → 구현 → 연동을 작은 스프린트로
          반복하며 직접 동작하는 웹앱을 완성합니다. 총 {total}개 강의.
        </p>
      </header>

      {tree.map((m) => (
        <section key={m.monthSlug} className="mb-12">
          <h2 className="mb-4 text-xl font-bold">
            Month {m.monthNum}
            <span className="ml-2 text-sm font-normal text-slate-400">
              {m.lectures.length}개 강의
            </span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {m.lectures.map((lec) => (
              <Link
                key={lec.daySlug}
                href={`/lectures/${lec.monthSlug}/${lec.daySlug}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
              >
                <div className="mb-2 inline-flex rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Day {lec.dayNum}
                </div>
                <h3 className="font-semibold leading-snug group-hover:text-indigo-600">
                  {shortTitle(lec.title)}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
