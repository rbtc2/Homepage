# 정적 이미지 (`public/images`)

빌드 없이 그대로 서빙되는 이미지를 둡니다.

| 경로 | 용도 |
|------|------|
| `logo-sample.svg` 등 | 사이트 공통 CI·아이콘 |
| **`hero/`** | **메인 배너 전체 배경** — 상세는 `hero/README.md` 참고 |

와이드 배경 원본은 **`hero/slides/`** 에 두고, `src/scripts/hero-banner.js`의 `HERO_SLIDES[].backgroundImage`에 파일명을 넣으면 됩니다. (`null`이면 그라데이션만 표시)
