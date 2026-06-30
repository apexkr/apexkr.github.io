/* =========================================================
   admin.js — 관리자 대시보드
   탭: 개요 / 전자공고 / 회사정보·소개 / 게시(배포)
   ⚠️ 정적 사이트라 비밀번호는 소스에 노출됨 → '관리 편의용 잠금'.
      실제 게시: [게시] 탭에서 JSON 생성 → data/*.json 교체 → 배포(commit/push).
   ========================================================= */
window.APEX = window.APEX || {};
(function () {
  const ADMIN_ID = "admin";
  const ADMIN_PW = "apex!2026"; // 변경하려면 이 값을 수정하세요.

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  APEX.initAdmin = function () {
    const store = APEX.store;     // 공고
    const site = APEX.site;       // 사이트 콘텐츠
    const loginOv = $("loginOverlay"), adminOv = $("adminOverlay");
    const open = (o) => o.classList.add("open");
    const close = (o) => o.classList.remove("open");

    document.querySelectorAll("[data-close]").forEach((b) =>
      b.addEventListener("click", () => { close(loginOv); close(adminOv); }));
    [loginOv, adminOv].forEach((o) => o.addEventListener("click", (e) => { if (e.target === o) close(o); }));

    /* ---- 로그인 ---- */
    $("adminLink").addEventListener("click", () => {
      if (sessionStorage.getItem("apex_admin") === "1") openDash();
      else { $("adId").value = ""; $("adPw").value = ""; $("loginErr").hidden = true; open(loginOv); $("adId").focus(); }
    });
    function doLogin() {
      if ($("adId").value === ADMIN_ID && $("adPw").value === ADMIN_PW) {
        sessionStorage.setItem("apex_admin", "1"); close(loginOv); openDash();
      } else { $("loginErr").hidden = false; }
    }
    $("loginBtn").addEventListener("click", doLogin);
    $("adPw").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
    $("logoutBtn").addEventListener("click", () => { sessionStorage.removeItem("apex_admin"); close(adminOv); });

    function openDash() { open(adminOv); switchTab("overview"); renderAdmin(); loadSiteForm(); refreshStats(); }

    /* ---- 탭 전환 ---- */
    const navs = document.querySelectorAll(".dash-nav");
    function switchTab(name) {
      navs.forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
      document.querySelectorAll(".dash-panel").forEach((p) => { p.hidden = p.dataset.panel !== name; });
      if (name === "overview") refreshStats();
    }
    navs.forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));

    /* ---- 개요 통계 ---- */
    function refreshStats() {
      const list = store.data || [];
      $("statCount").textContent = list.length;
      const latest = list.map((n) => n.date).sort().pop();
      $("statLatest").textContent = latest || "—";
      const draft = (store.hasDraft && store.hasDraft()) || (site.hasDraft && site.hasDraft());
      $("statDraft").textContent = draft ? "있음" : "없음";
    }

    /* ---- 전자공고 CRUD ---- */
    function renderAdmin() {
      const listEl = $("adminList");
      const items = store.data.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      listEl.innerHTML = items.length ? "" : '<div class="admin-item"><span class="meta">등록된 공고가 없습니다.</span></div>';
      items.forEach((n) => {
        const row = document.createElement("div");
        row.className = "admin-item";
        row.innerHTML = '<div class="grow"><b>' + esc(n.title) + "</b>" +
          '<span class="meta">' + esc(n.category) + " · " + esc(n.date) +
          (n.updated ? " · 변경 " + esc(n.updated) : "") + "</span></div>";
        const ed = document.createElement("button");
        ed.className = "btn-sm"; ed.textContent = "수정";
        ed.addEventListener("click", () => showForm(n));
        const del = document.createElement("button");
        del.className = "btn-sm danger"; del.textContent = "삭제";
        del.addEventListener("click", () => {
          if (confirm("이 공고를 삭제할까요? (법정 게시기간 준수에 유의하세요)")) {
            store.data = store.data.filter((x) => x.id !== n.id);
            store.save(); APEX.renderBoard(); renderAdmin(); refreshStats();
          }
        });
        row.appendChild(ed); row.appendChild(del);
        listEl.appendChild(row);
      });
    }
    const editArea = $("editArea");
    function showForm(n) {
      $("fId").value = n ? n.id : "";
      $("fTitle").value = n ? n.title : "";
      $("fCat").value = n ? n.category : "일반공고";
      $("fDate").value = n ? n.date : "";
      $("fUpdated").value = n ? (n.updated || "") : "";
      $("fBody").value = n ? n.body : "";
      editArea.hidden = false;
      editArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    $("newBtn").addEventListener("click", () => showForm(null));
    $("cancelBtn").addEventListener("click", () => { editArea.hidden = true; });
    $("saveBtn").addEventListener("click", () => {
      const title = $("fTitle").value.trim(), date = $("fDate").value;
      if (!title || !date) { alert("제목과 최초 공고일자는 필수입니다."); return; }
      const obj = { title, category: $("fCat").value, date, updated: $("fUpdated").value, body: $("fBody").value };
      const idVal = $("fId").value;
      if (idVal) {
        const i = store.data.findIndex((x) => x.id === +idVal);
        if (i >= 0) store.data[i] = { ...store.data[i], ...obj };
      } else {
        const nextId = store.data.reduce((m, x) => Math.max(m, x.id), 0) + 1;
        store.data.push({ id: nextId, ...obj });
      }
      store.save(); editArea.hidden = true; APEX.renderBoard(); renderAdmin(); refreshStats();
    });

    /* ---- 회사정보·소개 폼 ---- */
    function loadSiteForm() {
      const d = site.data; if (!d) return;
      const c = d.company || {}, h = d.hero || {}, a = d.about || {};
      $("sName").value = c.name_ko || ""; $("sNameEn").value = c.name_en || "";
      $("sCeo").value = c.ceo || ""; $("sEst").value = c.established || "";
      $("sAddr").value = c.address || ""; $("sField").value = c.field || "";
      $("sNotice").value = c.notice_method || "";
      $("sHeroKicker").value = h.kicker || ""; $("sHeroTitle").value = h.title_html || ""; $("sHeroLead").value = h.lead || "";
      $("sAboutTitle").value = a.title || ""; $("sAboutLead").value = a.lead || "";
    }
    $("siteSaveBtn").addEventListener("click", () => {
      if (!site.data) site.data = { company: {}, hero: {}, about: {} };
      site.data.company = {
        name_ko: $("sName").value, name_en: $("sNameEn").value, ceo: $("sCeo").value,
        address: $("sAddr").value, established: $("sEst").value,
        field: $("sField").value, notice_method: $("sNotice").value
      };
      site.data.hero = { kicker: $("sHeroKicker").value, title_html: $("sHeroTitle").value, lead: $("sHeroLead").value };
      site.data.about = { title: $("sAboutTitle").value, lead: $("sAboutLead").value };
      site.save(); APEX.renderSite(); refreshStats();
      alert("저장됨(미리보기). 실제 게시는 [게시] 탭에서 site.json을 생성해 배포하세요.");
    });

    /* ---- 게시(내보내기) ---- */
    function showExport(label, text) {
      $("exportLabel").textContent = label; $("exportLabel").hidden = false;
      const box = $("exportBox"); box.value = text; box.hidden = false; $("copyBtn").hidden = false;
    }
    $("exportNoticesBtn").addEventListener("click", () => {
      const ordered = store.data.slice().sort((a, b) => a.id - b.id);
      const json = { _comment: "전자공고 데이터베이스. 관리자 대시보드에서 편집 후 이 파일을 교체하고 배포하면 게시됩니다.", notices: ordered };
      showExport("↓ 이 내용으로 data/notices.json 전체를 교체하세요.", JSON.stringify(json, null, 2));
    });
    $("exportSiteBtn").addEventListener("click", () => {
      const json = { _comment: "사이트 콘텐츠 데이터. 관리자 대시보드에서 편집 후 이 파일을 교체하고 배포하면 반영됩니다.", ...(site.data || {}) };
      showExport("↓ 이 내용으로 data/site.json 전체를 교체하세요.", JSON.stringify(json, null, 2));
    });
    $("copyBtn").addEventListener("click", () => {
      const box = $("exportBox"); box.select();
      navigator.clipboard.writeText(box.value).then(() => {
        $("copyBtn").textContent = "✅ 복사됨"; setTimeout(() => ($("copyBtn").textContent = "📋 복사"), 1500);
      });
    });
    $("resetBtn").addEventListener("click", () => {
      if (confirm("브라우저 임시본(공고·회사정보)을 모두 지우고 현재 게시본으로 되돌릴까요?")) {
        store.reset(); site.reset();
        APEX.renderBoard(); APEX.renderSite();
        renderAdmin(); loadSiteForm(); refreshStats();
        $("exportBox").hidden = true; $("copyBtn").hidden = true; $("exportLabel").hidden = true;
      }
    });
  };
})();
