"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Lecture = { dayNum: number; daySlug: string; monthSlug: string; title: string };
type Tree = { monthNum: number; monthSlug: string; lectures: Lecture[] }[];

function shortTitle(t: string) {
  // "Day 1 — 프로젝트 시작하기: ..." → "프로젝트 시작하기"
  const afterDash = t.split(/[—–-]/).slice(1).join("-").trim() || t;
  return afterDash.split(/[:：]/)[0].trim();
}

export default function Shell({
  tree,
  children,
}: {
  tree: Tree;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-full">
      {/* 모바일 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 transform overflow-y-auto border-r border-slate-200 bg-white px-4 py-6 transition-transform lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/"
          className="mb-6 block text-lg font-bold text-slate-900 dark:text-slate-100"
          onClick={() => setOpen(false)}
        >
          백엔드 풀스택 과정
        </Link>

        <nav className="space-y-6">
          {tree.map((m) => (
            <div key={m.monthSlug}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Month {m.monthNum}
              </p>
              <ul className="space-y-1">
                {m.lectures.map((lec) => {
                  const href = `/lectures/${lec.monthSlug}/${lec.daySlug}`;
                  const active = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-baseline gap-2 rounded-lg px-3 py-2 text-sm transition ${
                          active
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span
                          className={`shrink-0 font-mono text-xs ${
                            active ? "text-indigo-200" : "text-slate-400"
                          }`}
                        >
                          D{lec.dayNum}
                        </span>
                        <span className="line-clamp-1">{shortTitle(lec.title)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/80">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
            aria-label="메뉴 열기"
          >
            ☰ 강의 목록
          </button>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
