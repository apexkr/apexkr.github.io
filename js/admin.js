/* =========================================================
   admin.js — 관리자 로그인 + 전자공고 CRUD + 게시용 JSON 생성
   ⚠️ 정적 사이트 특성상 비밀번호는 소스에 노출됩니다 → '관리 편의용 잠금'입니다.
      실제 게시: [게시용 JSON 생성] → data/notices.json 교체 → 배포(commit/push).
   ========================================================= */
window.APEX = window.APEX || {};
(function () {
  const ADMIN_ID = "admin";
  const ADMIN_PW = "apex!2026"; // 변경하려면 이 값을 수정하세요.

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  APEX.initAdmin = function () {
    const store = APEX.store;
    const loginOv = $("loginOverlay"), adminOv = $("adminOverlay");
    const open = (o) => o.classList.add("open");
    const close = (o) => o.classList.remove("open");

    document.querySelectorAll("[data-close]").forEach((b) =>
      b.addEventListener("click", () => { close(loginOv); close(adminOv); }));
    [loginOv, adminOv].forEach((o) => o.addEventListener("click", (e) => { if (e.target === o) close(o); }));

    $("adminLink").addEventListener("click", () => {
      if (sessionStorage.getItem("apex_admin") === "1") { open(adminOv); renderAdmin(); }
      else { $("adId").value = ""; $("adPw").value = ""; $("loginErr").hidden = true; open(loginOv); $("adId").focus(); }
    });

    function doLogin() {
      if ($("adId").value === ADMIN_ID && $("adPw").value === ADMIN_PW) {
        sessionStorage.setItem("apex_admin", "1");
        close(loginOv); open(adminOv); renderAdmin();
      } else { $("loginErr").hidden = false; }
    }
    $("loginBtn").addEventListener("click", doLogin);
    $("adPw").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
    $("logoutBtn").addEventListener("click", () => { sessionStorage.removeItem("apex_admin"); close(adminOv); });

    function renderAdmin() {
      const list = $("adminList");
      const items = store.data.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      list.innerHTML = items.length ? "" : '<div class="admin-item"><span class="meta">등록된 공고가 없습니다.</span></div>';
      items.forEach((n) => {
        const row = document.createElement("div");
        row.className = "admin-item";
        row.innerHTML =
          '<div class="grow"><b>' + esc(n.title) + "</b>" +
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
            store.save(); APEX.renderBoard(); renderAdmin();
          }
        });
        row.appendChild(ed); row.appendChild(del);
        list.appendChild(row);
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
      store.save(); editArea.hidden = true; APEX.renderBoard(); renderAdmin();
    });

    $("resetBtn").addEventListener("click", () => {
      if (confirm("브라우저 임시본을 지우고 현재 게시본으로 되돌릴까요?")) {
        store.reset(); APEX.renderBoard(); renderAdmin();
        $("exportBox").hidden = true; $("copyBtn").hidden = true;
      }
    });

    $("exportBtn").addEventListener("click", () => {
      const ordered = store.data.slice().sort((a, b) => a.id - b.id);
      const json = {
        _comment: "전자공고 데이터베이스. 관리자 패널에서 편집 후 [게시용 JSON 생성]으로 이 파일을 교체하고 배포(commit/push)하면 게시됩니다.",
        notices: ordered
      };
      const box = $("exportBox");
      box.value = JSON.stringify(json, null, 2);
      box.hidden = false; $("copyBtn").hidden = false;
    });
    $("copyBtn").addEventListener("click", () => {
      const box = $("exportBox"); box.select();
      navigator.clipboard.writeText(box.value).then(() => {
        $("copyBtn").textContent = "✅ 복사됨";
        setTimeout(() => ($("copyBtn").textContent = "📋 복사"), 1500);
      });
    });
  };
})();
