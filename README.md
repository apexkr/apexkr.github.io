# 주식회사 에이펙스 (APEX Co., Ltd.) 공식 홈페이지

대외용 회사 소개서(Company Profile) + 법적 **전자공고** 매체.
**라이트 테마 · 다이나믹 스크롤 모션 · 빌드 없는 모던 정적 구성**으로 제작.

- 🌐 게시 주소: **https://apexkr.github.io**
- 🎯 디자인·정체성 방향: **[docs/IDENTITY.md](docs/IDENTITY.md)** ← 변경 전 반드시 확인
- 📝 변경 이력: [CHANGELOG.md](CHANGELOG.md)

---

## 기술 구성
순수 **HTML + CSS + Vanilla JavaScript**. 프레임워크·빌드 단계 없음(node_modules 없음).
→ Google Drive 동기화 폴더에서도 가볍게 작업·배포 가능. 파일을 고치면 그대로 게시됨.

- 모던 느낌/모션: `IntersectionObserver` + CSS 트랜지션(스크롤 등장), Pretendard 웹폰트
- 데이터: **파일 기반 DB** — `data/notices.json` (git으로 버전관리 = 전자공고 변경이력이 곧 법적 감사추적)

## 폴더 구조
```
홈페이지/                # 멀티 페이지: 로고=홈, 목차 각 항목=개별 페이지
├─ index.html          # 홈(히어로 + 섹션 바로가기)
├─ about.html          # 회사소개
├─ vision.html         # 비전 로드맵
├─ biz.html            # 사업영역
├─ company.html        # 회사정보
├─ notice.html         # 전자공고(게시판)
├─ brand.html          # 브랜드·로고(다운로드)
├─ favicon.svg         # 파비콘(모노라인 A)
├─ css/
│  ├─ base.css         # 디자인 토큰(색/타이포)·리셋
│  ├─ layout.css       # 헤더/네비/섹션/히어로/푸터
│  ├─ components.css   # 버튼·카드·타임라인·표·게시판·모달·관리자
│  └─ animations.css   # 스크롤 등장 모션
├─ js/
│  ├─ layout.js        # 공통 헤더(로고+목차)·푸터·관리자 오버레이 주입 (전 페이지 공유)
│  ├─ notices.js       # 공고 데이터 스토어 + 게시판 렌더링
│  ├─ site.js          # 회사정보·히어로·소개 콘텐츠 렌더링
│  ├─ admin.js         # 관리자 대시보드(공고·회사정보 편집 + JSON 내보내기)
│  └─ main.js          # 초기화(스크롤 모션·데이터 부팅)
├─ data/
│  ├─ notices.json     # 전자공고 데이터베이스(게시본)
│  └─ site.json        # 회사정보·히어로·소개 콘텐츠
├─ docs/IDENTITY.md    # 브랜드 아이덴티티/디자인 방향(필수)
├─ CHANGELOG.md        # 변경 로그
└─ .nojekyll           # GitHub Pages Jekyll 처리 비활성화
```

> 목차(상단 메뉴)·헤더·푸터는 `js/layout.js` 한 곳에서 관리합니다. 메뉴 항목을 바꾸려면 layout.js의 `NAV` 배열만 수정하세요.

## 새 전자공고 올리는 법
1. 하단 **🔒 관리자** → 로그인(기본 ID `admin` / PW `apex!2026` — `js/admin.js`에서 변경).
2. **+ 새 공고 작성** 으로 추가/수정/삭제 (이 시점엔 브라우저 임시본).
3. **[게시용 JSON 생성]** → 출력된 내용으로 `data/notices.json` 교체.
4. 배포: 아래 명령으로 commit·push (보통은 Claude에게 맡기면 됨).

> ⚠️ 관리자 비밀번호는 정적 사이트라 소스에 노출됩니다 → '편의용 잠금'일 뿐 보안장치가 아닙니다.
> 실제 게시는 반드시 `data/notices.json` 반영(배포)으로만 이뤄집니다.

## 배포 (GitHub Pages)
```bash
cd "G:/내 드라이브/7_APEX/홈페이지"
git add -A
git commit -m "변경 내용"
git push
```
푸시 후 1~2분 내 https://apexkr.github.io 에 반영됩니다.

## 법적 유의
- 사이트의 상호·공고 주소는 **정관·등기와 일치**해야 효력이 있습니다(현재: 주식회사 에이펙스 / apexkr.github.io).
- 전자공고는 법정 게시기간(이의신청 기간 또는 게시일로부터 3개월 이상) 동안 **임의 삭제 금지**.
