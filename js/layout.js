/* =========================================================
   layout.js — 공통 헤더(로고+목차) · 푸터 · 관리자 오버레이를
   모든 페이지에 주입. 로고=홈(index.html), 목차는 페이지별 링크.
   활성 표시는 <body data-page="key">로 결정.
   ========================================================= */
(function () {
  var page = document.body.getAttribute("data-page") || "";

  var NAV = [
    { key: "about", href: "about.html", label: "회사소개" },
    { key: "vision", href: "vision.html", label: "비전 로드맵" },
    { key: "biz", href: "biz.html", label: "사업영역" },
    { key: "company", href: "company.html", label: "회사정보" },
    { key: "brand", href: "brand.html", label: "브랜드·로고" },
    { key: "notice", href: "notice.html", label: "전자공고", cta: true }
  ];

  var LOGO =
    '<svg class="logo-svg" viewBox="0 0 174 82" height="30" role="img" aria-label="APEX">' +
    '<defs><linearGradient id="apexGrad" gradientUnits="userSpaceOnUse" x1="8" y1="14" x2="166" y2="72">' +
    '<stop offset="0" stop-color="#1b56e0"/><stop offset=".58" stop-color="#06b6a4"/><stop offset="1" stop-color="#4dd9ff"/></linearGradient></defs>' +
    '<g fill="none" stroke="url(#apexGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M8 58 26 14 44 58"/><path d="M15.5 43 H36.5"/>' +
    '<path d="M56 14 V58"/><path d="M56 14 H72 C82 14 82 35 72 35 H56"/>' +
    '<path d="M92 14 V58"/><path d="M92 14 H120"/><path d="M92 35 H114"/><path d="M92 58 H120"/>' +
    '<path d="M132 14 166 58"/><path d="M166 14 132 58"/></g>' +
    '<path d="M8 74 H166" stroke="url(#apexGrad)" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>' +
    '<g fill="url(#apexGrad)"><circle cx="26" cy="74" r="3"/><circle cx="64" cy="74" r="3"/><circle cx="106" cy="74" r="3"/><circle cx="149" cy="74" r="3"/></g></svg>';

  var navItems = NAV.map(function (n) {
    var cls = (n.cta ? "cta " : "") + (n.key === page ? "active" : "");
    return '<li><a class="' + cls.trim() + '" href="' + n.href + '">' + n.label + "</a></li>";
  }).join("");

  var header =
    '<header id="top"><div class="wrap nav">' +
    '<a class="brand" href="index.html" aria-label="APEX 홈"><span class="brand-mark" aria-hidden="true">' + LOGO + "</span>" +
    '<span class="brand-text"><small>주식회사 에이펙스</small></span></a>' +
    '<button class="menu-btn" id="menuBtn" aria-label="메뉴 열기">☰</button>' +
    '<nav id="nav" aria-label="주요 메뉴"><ul>' + navItems + "</ul></nav>" +
    "</div></header>";

  var footer =
    "<footer><div class=\"wrap frow\">" +
    "<div><strong>주식회사 에이펙스</strong> (APEX Co., Ltd.)<br>" +
    "대전광역시 유성구 대정로28번안길 80 · 대표이사 전혜민</div>" +
    '<div class="fright">공고 홈페이지 https://apexkr.github.io<br>' +
    "© 2026 APEX Co., Ltd. All rights reserved.<br>" +
    '<a href="brand.html" style="color:var(--brand)">브랜드 · 로고</a> · ' +
    '<button class="admin-link" id="adminLink">관리자</button></div>' +
    "</div></footer>";

  var dashLogo =
    '<svg viewBox="0 0 48 48" width="22" height="22"><defs><linearGradient id="dashGrad" gradientUnits="userSpaceOnUse" x1="6" y1="6" x2="42" y2="42">' +
    '<stop offset="0" stop-color="#1b56e0"/><stop offset=".58" stop-color="#06b6a4"/><stop offset="1" stop-color="#4dd9ff"/></linearGradient></defs>' +
    '<rect x="3" y="3" width="42" height="42" rx="12" fill="url(#dashGrad)"/>' +
    '<g fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 35 24 12 34.5 35"/><path d="M18.6 27.6 H29.4"/></g>' +
    '<circle cx="24" cy="12" r="2.3" fill="#fff"/></svg>';

  var overlays =
    '<div class="overlay" id="loginOverlay"><div class="modal modal-sm">' +
    '<div class="modal-head"><h3>관리자 로그인</h3><button class="x" data-close aria-label="닫기">×</button></div>' +
    '<div class="modal-body">' +
    '<div class="field"><label for="adId">아이디</label><input id="adId" autocomplete="username" /></div>' +
    '<div class="field"><label for="adPw">비밀번호</label><input id="adPw" type="password" autocomplete="current-password" /></div>' +
    '<p id="loginErr" class="err" hidden>아이디 또는 비밀번호가 올바르지 않습니다.</p>' +
    '<button class="btn-sm primary block" id="loginBtn">로그인</button></div></div></div>' +

    '<div class="overlay" id="adminOverlay"><div class="dash">' +
    '<div class="dash-head"><div class="dash-title"><span class="brand-mark" aria-hidden="true">' + dashLogo + "</span> APEX 관리자 대시보드</div>" +
    '<div class="dash-head-actions"><button class="btn-sm" id="logoutBtn">로그아웃</button><button class="x" data-close aria-label="닫기">×</button></div></div>' +
    '<div class="dash-body"><nav class="dash-side" aria-label="관리 메뉴">' +
    '<button class="dash-nav active" data-tab="overview">개요</button>' +
    '<button class="dash-nav" data-tab="notices">전자공고</button>' +
    '<button class="dash-nav" data-tab="site">회사정보·소개</button>' +
    '<button class="dash-nav" data-tab="publish">게시(배포)</button></nav>' +
    '<div class="dash-main">' +
    '<p class="admin-banner">편집 내용은 <b>이 브라우저에만 임시 저장(미리보기)</b>됩니다. 실제 게시는 <b>[게시(배포)]</b> 탭에서 JSON을 생성해 <code>data/*.json</code> 교체 후 배포(commit·push)해야 반영됩니다.</p>' +
    '<section class="dash-panel" data-panel="overview"><h3 class="dash-h">개요</h3>' +
    '<div class="stat-grid"><div class="stat"><b id="statCount">0</b><span>등록 공고</span></div>' +
    '<div class="stat"><b id="statLatest">—</b><span>최근 공고일</span></div>' +
    '<div class="stat"><b id="statDraft">없음</b><span>미게시 임시변경</span></div></div>' +
    '<p class="dash-note">왼쪽 메뉴에서 <b>전자공고</b>와 <b>회사정보·소개</b>를 관리하세요. 편집을 마치면 <b>게시(배포)</b> 탭에서 파일을 내보내 배포합니다.</p></section>' +
    '<section class="dash-panel" data-panel="notices" hidden><h3 class="dash-h">전자공고 관리</h3>' +
    '<div class="admin-list" id="adminList"></div><button class="btn-sm primary" id="newBtn">+ 새 공고 작성</button>' +
    '<div id="editArea" hidden><input type="hidden" id="fId" />' +
    '<div class="field"><label for="fTitle">제목</label><input id="fTitle" /></div>' +
    '<div class="field row2"><div><label for="fCat">분류</label><select id="fCat"><option>일반공고</option><option>결산공고</option><option>주주총회</option><option>기타</option></select></div>' +
    '<div><label for="fDate">최초 공고일자</label><input id="fDate" type="date" /></div>' +
    '<div><label for="fUpdated">변경일자</label><input id="fUpdated" type="date" /></div></div>' +
    '<div class="field"><label for="fBody">본문</label><textarea id="fBody"></textarea></div>' +
    '<div class="admin-actions"><button class="btn-sm primary" id="saveBtn">저장</button><button class="btn-sm" id="cancelBtn">취소</button></div></div></section>' +
    '<section class="dash-panel" data-panel="site" hidden><h3 class="dash-h">회사정보 · 소개</h3>' +
    '<h4 class="dash-sub">회사정보</h4>' +
    '<div class="field row2"><div><label for="sName">상호(국문)</label><input id="sName" /></div><div><label for="sNameEn">상호(영문)</label><input id="sNameEn" /></div></div>' +
    '<div class="field row2"><div><label for="sCeo">대표이사</label><input id="sCeo" /></div><div><label for="sEst">설립일</label><input id="sEst" /></div></div>' +
    '<div class="field"><label for="sAddr">본점 소재지</label><input id="sAddr" /></div>' +
    '<div class="field"><label for="sField">사업 분야</label><input id="sField" /></div>' +
    '<div class="field"><label for="sNotice">공고방법</label><input id="sNotice" /></div>' +
    '<h4 class="dash-sub">히어로 / 회사소개 문구</h4>' +
    '<div class="field"><label for="sHeroKicker">상단 키워드</label><input id="sHeroKicker" /></div>' +
    '<div class="field"><label for="sHeroTitle">히어로 제목 (HTML 가능)</label><textarea id="sHeroTitle" style="min-height:70px"></textarea></div>' +
    '<div class="field"><label for="sHeroLead">히어로 설명</label><textarea id="sHeroLead" style="min-height:70px"></textarea></div>' +
    '<div class="field"><label for="sAboutTitle">회사소개 제목</label><input id="sAboutTitle" /></div>' +
    '<div class="field"><label for="sAboutLead">회사소개 본문 (HTML 가능)</label><textarea id="sAboutLead"></textarea></div>' +
    '<div class="admin-actions"><button class="btn-sm primary" id="siteSaveBtn">회사정보·소개 저장(미리보기)</button></div></section>' +
    '<section class="dash-panel" data-panel="publish" hidden><h3 class="dash-h">게시 (배포)</h3>' +
    '<p class="dash-note">① 버튼으로 파일 내용 생성 → ② 복사해 해당 파일 교체 → ③ <code>git push</code> 하면 실제 게시됩니다. (Claude에게 맡겨도 됩니다.)</p>' +
    '<div class="admin-actions"><button class="btn-sm primary" id="exportNoticesBtn">data/notices.json 생성</button>' +
    '<button class="btn-sm primary" id="exportSiteBtn">data/site.json 생성</button><button class="btn-sm" id="copyBtn" hidden>복사</button></div>' +
    '<p id="exportLabel" class="dash-note" hidden></p><textarea id="exportBox" readonly hidden></textarea>' +
    '<div class="admin-actions" style="margin-top:16px"><button class="btn-sm danger" id="resetBtn">모든 임시본 초기화</button></div></section>' +
    "</div></div></div></div>";

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer + overlays);

  // 모바일 메뉴
  var nav = document.getElementById("nav"), mb = document.getElementById("menuBtn");
  if (mb && nav) {
    mb.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); }); });
  }
})();
