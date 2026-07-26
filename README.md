# 배롱 (BAERONG) · FLOWER DIARY

다이어리 컨셉 팬페이지 풀세트. 메인 시안(concept-02)의 테마를
프로필 · 일정 · 공지 · 업보 · 옷장 · 관리자 전 페이지에 그대로 확장했습니다.

---

## 폴더 구조

```
index.html            메인 (Flower Diary 표지)
style.css             전 페이지 공용 테마 (메인도 이 파일을 씁니다)
supabase.js           ⚠️ 상단 2줄만 채우면 됨
site.js               다크모드 · 문의 모달 · 공통 유틸
fx.js                 연출(입자 · 클릭 픽셀하트 · 페이지 전환 · 로딩화면)
fxfb.js               미리보기 전용 폴백 (fx.js 없을 때만 동작)
supabase_setup.sql    Supabase SQL Editor 에 한 번에 붙여넣기
assets/
  baerong-blossom.webp  배경 사진
profile/index.html    프로필
schedule/index.html   일정 (이번 주 + 한 달 달력)
notice/index.html     공지
work/index.html       업보
dress/index.html      옷장 (새 옷 포스터 / 기존 옷 앨범)
admin/index.html      관리자
.github/workflows/keepalive.yml   Supabase 잠들기 방지 (월·목)
```

---

## 셋업 순서

### ① Supabase
1. New project 생성 (⚠️ **한 프로젝트 = 한 사람**)
2. Settings → API 에서 `Project URL` 과 `anon public` 키 복사
3. SQL Editor 에 `supabase_setup.sql` 전체를 붙여넣고 **Run**
   (여러 번 다시 실행해도 데이터가 지워지지 않습니다)

### ② supabase.js 상단 2줄 교체
```js
const SUPABASE_URL  = 'https://xxxxxxxx.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOi....';
```

### ③ GitHub 업로드
폴더 구조 그대로 올립니다. `fx.js` · `site.js` · `fxfb.js` · `style.css` 는 **루트**,
`assets/baerong-blossom.webp` 도 꼭 함께 올려주세요.

### ④ Cloudflare Pages
Connect to Git → repo 선택 → 빌드 설정 비움(Framework = None) → Deploy

### ⑤ Supabase 잠들기 방지 (선택)
GitHub 저장소 → Settings → Secrets and variables → Actions 에서
`SUPABASE_URL` / `SUPABASE_ANON_KEY` 두 개를 등록하면
월·목 자동으로 한 번씩 핑을 보냅니다.

### ⑥ SOOP 게시글 삽입
```html
<iframe height="2400" scrolling="no" src="배포주소" style="width:100%;border:0;display:block;"></iframe>
```

---

## ⚠️ 배포 전 꼭 바꿀 것

`admin/index.html` 안의
```js
const ADMIN_PASSWORD = '1234';
```
→ **다른 비밀번호로 교체.** 소스에 그대로 보이므로 다른 곳에서 안 쓰는 비번을 쓰세요.

---

## 관리자 사용법 요약

| 탭 | 하는 일 |
|---|---|
| 🏠 메인 | 프사 · 프로필 정보(생일/데뷔일/MBTI/팬닉…) · 좋아싫어 · 방송 요일 · 링크 |
| 🎀 프로필 | 한마디 · 하고픈 말 · **능력치** · 목표 · TMI · 다시보기(VOD) |
| 📢 공지 | 채팅규칙 · 시참규칙 · 시그이미지 · 구독티콘 · 룰렛확률 등 (이미지 여러 장 가능) |
| 📅 일정 | 날짜별 방송/휴방 · 1부/2부 · 색상 · 하이라이트 |
| ⚡ 업보 | 시청자 · 타입 등록 후 ± 버튼으로 카운트 |
| 👗 옷장 | 의상 / 헤어. “✨ 새 옷으로 올리기” 체크 = 포스터로 노출 |
| ✉️ 문의 | 사이트에서 받은 익명 쪽지 |
| 🎨 테마 | 색 6종 팔레트 — 저장하면 전 페이지에 한 번에 반영 |

### 자주 쓰는 규격
- **생일** `MM.DD` (예: `08.18`) → D-Day 자동
- **데뷔일** `YYYY.MM.DD` (예: `2024.09.23`) → D-Day + 주년 자동
- **능력치** 한 줄에 `이름:숫자` (0~100). 줄을 늘리면 항목이 늘어납니다
- **목표** 한 줄에 `상태|내용`. 상태가 `달성`이면 취소선
- **옷장 사진** 세로 3:4 (900×1200 권장)
- **이미지 넣는 법** SOOP 비공개 게시판에 올린 뒤 이미지 **우클릭 → “이미지 주소 복사”**
  (게시글 주소 ✗ / `https://stimg.sooplive.com/…` 형태가 맞습니다)

---

## 디자인 메모

- 컨셉 : **꽃 일기장** — 각 페이지가 다이어리에서 뜯어낸 한 장 (VOL. 01~05 넘버링)
- 종이 결(가로줄) · 마스킹 테이프 · 점선 · 포스트잇 · 손글씨 낙서
- 글머리표와 클릭 입자는 **픽셀(도트) 하트** — 마인크래프트/도트 감성
- 폰트 : Gamja Flower(이름) · Hi Melody(손글씨) · Noto Sans KR(본문, 굵기 4종)
- 색 : 메인 `#F5D7E2` / 서브 `#E3E3E3` 기준 파스텔 팔레트 (관리자에서 변경 가능)
- 상단바는 전 페이지 **동일 마크업** — 페이지를 옮겨도 헤더가 튀지 않습니다
- 다크모드는 `localStorage` 에 저장돼 페이지를 옮겨도 유지됩니다
