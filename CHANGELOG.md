# 변경 로그 (CHANGELOG)

형식: 날짜 / 변경 요약. 디자인·정체성 방향은 [docs/IDENTITY.md](docs/IDENTITY.md) 기준.

## 2026-06-30 — v2.0 전면 리뉴얼 (대외용 Company Profile)
- 📁 작업 위치를 `G:\내 드라이브\7_APEX\홈페이지`로 이전, 폴더/파일 역할별 분리 구조 확립.
- 🧱 단일 파일 → **HTML/CSS/JS 분리 + 파일기반 데이터(data/notices.json)** 구조로 재작성(빌드 없는 모던 구성).
- 🎬 IntersectionObserver 기반 **스크롤 등장 모션**(상승 모티프), Pretendard 웹폰트 적용.
- 📈 **3단계 비전 로드맵**(하드웨어 인프라 → 임베디드 S/W·엣지 → 통합 모니터링 플랫폼) 타임라인 신설.
- 🧭 회사소개 서사 보강(“데이터의 가치를 잇는 회사”) + 사업영역 3축 재정의.
- 🙈 회사정보에서 **자본금 상세 등 내부 재무 정보 제거**(대외용 원칙). 공고방법 등 법적 항목은 유지.
- 🔒 관리자(전자공고 CRUD) 유지 — 게시용 JSON 생성 방식으로 개편.
- 📄 IDENTITY.md / README.md / CHANGELOG.md 신설.
- 🌐 게시 주소 `https://apexkr.github.io` 유지(정관 일치).

## (이전) v1.x — C:\...\2\apexkr.github.io
- 사명 변경(APEX LABS→APEX, 에이펙스랩스→에이펙스), 공고주소 apexkr.github.io 확정.
- 단일 index.html 정적 사이트로 최초 게시.
