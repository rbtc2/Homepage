# Hero(메인 배너) 이미지

메인 상단 **배너 전체 영역**(`.hero__viewport`)을 덮는 **와이드 배경**용 파일을 둡니다.

## 폴더 구조

```
public/images/hero/
├── README.md          ← 이 파일
└── slides/            ← 슬라이드별 배경 이미지
    ├── README.md
    ├── slide-01.webp
    ├── slide-02.webp
    ├── slide-03.webp
    └── slide-04.webp
```

## 켜는 방법

1. `slides/`에 이미지 파일을 넣습니다.
2. `src/components/HeroBanner.jsx`의 `HERO_SLIDES[n].backgroundImage`에 **파일명만** 넣습니다.
   - 예: `backgroundImage: "slide-01.webp"`
3. 값이 없으면 배경 이미지는 켜지지 않고 `.hero__viewport`의 그라데이션만 보입니다.

배경은 `.hero__bg` 레이어에서 `cover` / `center`로 깔리며, 그라데이션은 그 **아래**에 두어 로딩 전·가장자리에서 비칠 때 자연스럽게 보이게 했습니다.

## 파일·해상도 권장

- **비율**: 배너가 가로로 넓으므로 **와이드**(대략 **16:9 ~ 21:9** 또는 실제 배너 높이에 맞는 크롭) 권장.
- 표시 높이는 `max-height: 28rem` 수준이므로 **가로 1920–2560px**이면 충분합니다. 3840px 원본은 LCP에 부담이 큽니다.
- **형식**: `webp` 권장 (`jpg`, `png` 가능).

## 접근성

배경은 장식용 레이어(`aria-hidden`)로 두었습니다. 의미 있는 사진이면 추후 `role="img"` + 대체 텍스트 패턴을 별도로 두는 것을 검토하세요.
