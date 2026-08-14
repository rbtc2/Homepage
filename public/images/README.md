# 정적 이미지 (`public/images`)

빌드 없이 그대로 서빙되는 이미지를 둡니다.

| 경로 | 용도 |
|------|------|
| `ci-logo.svg`, `facebook.svg`, `instagram.svg` | 사이트 공통 CI·아이콘 |
| **`hero/`** | **메인 배너 전체 배경** — 상세는 `hero/README.md` 참고 |
| `greeting/representative.webp` | 인사말 페이지 사진 |

와이드 배경은 **`hero/slides/`** 에 두고, `src/components/HeroBanner.jsx`의 `HERO_SLIDES[].backgroundImage`에 파일명을 넣습니다.
