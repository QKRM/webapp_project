import type { Metadata } from "next";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import Shell from "@/components/Shell";
import { getLectureTree } from "@/lib/lectures";

export const metadata: Metadata = {
  title: "백엔드 풀스택 과정",
  description: "16주 풀스택 웹앱 만들기 강의",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = getLectureTree();
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Shell tree={tree}>{children}</Shell>
      </body>
    </html>
  );
}
