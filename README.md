# 백엔드 풀스택 과정 — 강의 사이트

16주 풀스택 웹앱 만들기 강의를 보여주는 사이트. **md 파일 1개 = 강의 1개.**

## 강의 추가/수정

`content/month N/DayX_*.md` 형식으로 파일을 넣으면 자동으로 목록·페이지가 생긴다.

- 폴더명: `month 1`, `month 2` ... (스캔 대상)
- 파일명: `Day1_...md`, `Day2_...md` ... (`Day` 뒤 숫자로 정렬)
- 제목: 파일 안 첫 `# 제목` 을 사용 (frontmatter `title:` 로 덮어쓰기 가능)

코드 수정 없이 md만 추가하면 끝.

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

## 빌드 / 배포

```bash
npm run build    # 정적 페이지 생성
```

Vercel에 배포됨. `master` 푸시 시 자동 재배포(깃 연동한 경우).

## 스택

Next.js 16 (App Router) · Tailwind v4 · react-markdown(remark-gfm, rehype-highlight)
