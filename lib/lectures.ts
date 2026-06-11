import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// 강의 md 파일은 content/ 아래 "month N" 폴더에 있다.
// 빌드 시점에 읽어 정적 페이지로 굽는다.
const CONTENT_ROOT = path.join(process.cwd(), "content");

export type Lecture = {
  monthNum: number;
  monthSlug: string; // "month-1"
  dayNum: number;
  daySlug: string; // "day-1"
  title: string; // 파일 안 첫 H1
  fileName: string;
};

const MONTH_DIR_RE = /^month\s+(\d+)$/i;
const DAY_FILE_RE = /^Day(\d+).*\.md$/i;

function firstHeading(raw: string, fallback: string): string {
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^#\s+(.+)$/);
    if (m) return m[1].trim();
  }
  return fallback;
}

function listMonthDirs(): { num: number; dir: string }[] {
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isDirectory() && MONTH_DIR_RE.test(e.name))
    .map((e) => ({ num: Number(e.name.match(MONTH_DIR_RE)![1]), dir: e.name }))
    .sort((a, b) => a.num - b.num);
}

/** 모든 강의를 month → day 순으로 평탄하게 반환 */
export function getAllLectures(): Lecture[] {
  const out: Lecture[] = [];
  for (const { num: monthNum, dir } of listMonthDirs()) {
    const monthPath = path.join(CONTENT_ROOT, dir);
    const files = fs
      .readdirSync(monthPath)
      .filter((f) => DAY_FILE_RE.test(f))
      .map((f) => ({ f, dayNum: Number(f.match(DAY_FILE_RE)![1]) }))
      .sort((a, b) => a.dayNum - b.dayNum);

    for (const { f, dayNum } of files) {
      const raw = fs.readFileSync(path.join(monthPath, f), "utf8");
      const { content, data } = matter(raw);
      const title =
        (typeof data.title === "string" && data.title) ||
        firstHeading(content, `Day ${dayNum}`);
      out.push({
        monthNum,
        monthSlug: `month-${monthNum}`,
        dayNum,
        daySlug: `day-${dayNum}`,
        title,
        fileName: f,
      });
    }
  }
  return out;
}

/** 사이드바용: month별로 묶은 트리 */
export function getLectureTree(): {
  monthNum: number;
  monthSlug: string;
  lectures: Lecture[];
}[] {
  const tree = new Map<number, Lecture[]>();
  for (const lec of getAllLectures()) {
    if (!tree.has(lec.monthNum)) tree.set(lec.monthNum, []);
    tree.get(lec.monthNum)!.push(lec);
  }
  return [...tree.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([monthNum, lectures]) => ({
      monthNum,
      monthSlug: `month-${monthNum}`,
      lectures,
    }));
}

/** 한 강의의 본문 마크다운을 읽어온다 */
export function getLecture(
  monthSlug: string,
  daySlug: string
): (Lecture & { markdown: string }) | null {
  const monthNum = Number(monthSlug.replace("month-", ""));
  const dayNum = Number(daySlug.replace("day-", ""));
  const monthDir = listMonthDirs().find((m) => m.num === monthNum);
  if (!monthDir) return null;

  const monthPath = path.join(CONTENT_ROOT, monthDir.dir);
  const file = fs
    .readdirSync(monthPath)
    .find((f) => DAY_FILE_RE.test(f) && Number(f.match(DAY_FILE_RE)![1]) === dayNum);
  if (!file) return null;

  const raw = fs.readFileSync(path.join(monthPath, file), "utf8");
  const { content, data } = matter(raw);
  const title =
    (typeof data.title === "string" && data.title) ||
    firstHeading(content, `Day ${dayNum}`);

  return {
    monthNum,
    monthSlug,
    dayNum,
    daySlug,
    title,
    fileName: file,
    markdown: content,
  };
}
