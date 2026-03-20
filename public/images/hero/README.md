# Hero(메인 배너) 이미지

메인 상단 **배너 전체 영역**(`.hero__viewport` 크기, 지금은 그라데이션으로 보이는 구간)을 덮는 **와이드 배경**용 파일을 둡니다.

## 폴더 구조

```
public/images/hero/
├── README.md          ← 이 파일
└── slides/            ← 슬라이드별 배경 이미지
    ├── README.md
    ├── placeholder.svg   ← (선택) 문서/참고용. 실제 배경은 아래 필드로만 켭니다.
    └── (예시)
        slide-01.webp
        slide-02.webp
        ...
```

## 켜는 방법

1. `slides/`에 이미지 파일을 넣습니다.
2. `src/scripts/hero-banner.js`의 `HERO_SLIDES[n].backgroundImage`에 **파일명만** 넣습니다.  
   - 예: `backgroundImage: "slide-01.webp"`
3. `null`이면 **배경 이미지 없음** → `.hero__viewport`의 **그라데이션만** 보입니다. (현재 기본값)

배경은 `.hero__bg` 레이어에서 `cover` / `center`로 깔리며, 그라데이션은 그 **아래**에 두어 로딩 전·가장자리에서 비칠 때 자연스럽게 보이게 했습니다.

## 파일·해상도 권장

- **비율**: 배너가 가로로 넓으므로 **와이드**(대략 **16:9 ~ 21:9** 또는 실제 배너 높이에 맞는 크롭) 권장.
- **짧은 변** 기준 **1920px 이상**이면 대형 모니터에서도 여유 있습니다.
- **형식**: `webp` 권장 (`jpg`, `png` 가능).

## 접근성

배경은 장식용 레이어(`aria-hidden`)로 두었습니다. 의미 있는 사진이면 추후 `role="img"` + 대체 텍스트 패턴을 별도로 두는 것을 검토하세요.
