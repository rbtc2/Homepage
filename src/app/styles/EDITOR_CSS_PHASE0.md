# editor.css Phase 0 인벤토리

작성 목적: 파일 분할(Phase 1+) 전 **로드 경로·접두어·교차 의존**을 고정한다.  
`editor.css`는 **전역 한 번만** `globals.css`에서 import된다.

```text
src/app/globals.css  →  @import './styles/editor.css';
```

---

## 1. 접두어 → 소스 컴포넌트 매핑

| 접두 / 블록 | 대표 파일 | 비고 |
|-------------|-----------|------|
| `ep`, `ep__*` | `EditorPageFrame.jsx`, `EditorActionBar.jsx`, `RichEditor.jsx` | 루트 `.ep`, 액션바, 메인, 페이퍼 |
| `ep-toolbar*` | `RichEditor.jsx`, `PressEditor.jsx`, `ToolbarBtn.jsx`, `TableToolbar.jsx` | Press는 `ep-toolbar--press` 병용 |
| `ep-content` | TipTap `editorProps.attributes` + `EditorContent` (`RichEditor.jsx` 등) | 본문 편집 영역 |
| `ep-editor-wrap` | `RichEditor.jsx`, `PressEditor.jsx` | `EditorContent` 래퍼 |
| `ep-color-wrap`, `ep-color-icon*` | `ColorPicker.jsx`, `CellColorPicker.jsx`, `CellBorderPicker.jsx` | 툴바 트리거 래퍼 공유 |
| `ep-tbl-wrap` | `RichEditor.jsx` (표 툴바 주변) | `editor.css` 내 정의 |
| `ep-link-wrap` | `LinkPicker.jsx` | |
| `ep-cover__*` | `EditorCoverUrlField.jsx` | |
| `ep__meta-date*` | `EditorMetaDate.jsx` | |
| `dp`, `dp__*` | `DatePicker.jsx` | |
| `cp`, `cp__*` | `ColorPicker.jsx`, `CellColorPicker.jsx`; `CellBorderPicker`는 `cp__*` 일부 재사용 | |
| `tgp`, `tgp__*` | `TableGridPicker.jsx` | |
| `cbp`, `cbp__*` | `CellBorderPicker.jsx` | |
| `lp`, `lp__*` | `LinkPicker.jsx` | |
| `ecm`, `ecm__*` | `EditorContextMenu.jsx` | 루트 `.ecm` |

**언론 편집기 전용** 클래스 `press-ep__*`는 **`press.css`**에 정의되어 있으며, `EditorPageFrame`의 `paperClassName` 등으로 `ep__paper`와 함께 쓰인다. (`press.css`에 `.press-ep .ep-content` 오버라이드 존재)

---

## 2. `.nd__body--html` — 에디터 CSS에 있으나 “공개 상세” 소비

`editor.css`에 있지만 **관리자 에디터 전용이 아님**. 다음 페이지가 `dangerouslySetInnerHTML` 본문에 사용한다.

| 경로 |
|------|
| `src/app/notices/[id]/page.jsx` |
| `src/app/archive/[id]/page.jsx` |
| `src/app/disclosures/[id]/page.jsx` |
| `src/app/gallery/[id]/page.jsx` |
| `src/app/wr-news/[id]/page.jsx` |
| `src/app/press/[id]/page.jsx` (`nd__body nd__body--html pd__body`) |

**분할 시**: 이 블록을 다른 파일로 옮기면 **`globals.css`의 import 순서**로 공개 상세 스타일 우선순위가 바뀔 수 있음 (회귀 검증 필수).

---

## 3. `board.css`와의 관계 (중복·충돌 스캔)

- `board.css`: **목록/레이아웃** — `.nd-wrap`, `.nd-crumb*`, `.nd__hd`, `.nd__title`, `.nd__body`, `.nd__para` 등. **공지 상세의 타이포는 `.nd__para` 쪽**.
- `editor.css`: **같은 `nd` 네임스페이스의 변형** — `.nd__body--html` + TipTap 산출 HTML용 타이포/표/링크.

**네임스페이스 충돌**: `.nd__body` vs `.nd__body--html` — 서로 다른 클래스. 목록용 `notice-table*`와 에디터 표 스타일도 접두가 다름.

**의미적 중복**: `.ep-content`와 `.nd__body--html`에 **유사한 타이포그래피 규칙이 병치**되어 있음 (의도적 이중 유지 가능; 향후 “프로즈 HTML 한 벌”로 통합 후보).

---

## 4. 공통 선택자 (분할 시 순서 민감)

아래 규칙은 **`.ep-content`와 `.nd__body--html`을 한 묶음**으로 둔다.

- 링크: `.ep-content a`, `.nd__body--html a` (editor.css 약 1033행대)
- 표: `.ep-content table`, `.nd__body--html table` (약 1049행대)
- 에디터 전용: `.selectedCell`, `.column-resize-handle`, `.tableWrapper`, `.resize-cursor` — **`.ep-content`에만** 해당

**분할 시**: 공통 블록을 자르면 **파일 import 순서**가 기존 단일 파일 내 순서와 같아야 한다.

---

## 5. 반응형 블록

- `editor.css` 약 1120행~: `.ep__*` 중심 미디어쿼리
- 약 1145행~: 관리자 공지(an-*) 관련 — **에디터와 admin-board 영역 경계**가 한 파일에 있음. Phase 1에서 파일명 정할 때 **“admin-board와 인접한지”** 확인 권장.

---

## 6. Phase 1 권장 순서 (참고, 이번 단계에서 확정 아님)

1. 위젯 단위 (`dp`, `cp`, `tgp`, `cbp`, `lp`, `ecm`) — JSX 1:1 매핑이 명확.
2. `ep-*` 셸 + 툴바 + `.ep-content` 기본 타이포 + 해당 미디어쿼리.
3. `.ep-content` + `.nd__body--html` 공통(링크·표) — **마지막에** 옮기거나 별도 `rich-text-shared`로 두고 import 순서 고정.
4. `.nd__body--html` 단독 타이포만 `board` 또는 `shared`로 이전 시 — **상세 6페이지** 스모크 테스트.

---

## 7. 체크리스트 (분할 PR 전)

- [ ] 관리자 RichEditor 화면(표·색·링크·우클릭 메뉴·작성일)
- [ ] 공지/자료/갤러리/WR뉴스/언론 상세 중 HTML 본문 있는 페이지 1개 이상
- [ ] 좁은 뷰포트에서 `.ep` 메타 행·툴바

---

*본 문서는 Phase 0 산출물이며, 코드 분할 시 이 매핑을 기준으로 검증한다.*
