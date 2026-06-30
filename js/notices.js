/* =========================================================
   notices.js — 전자공고 데이터 스토어 + 게시판 렌더링
   데이터 출처: data/notices.json (게시본 = SEED)
   관리자 임시 편집분은 localStorage에 저장되어 미리보기로 우선 표시됨.
   ========================================================= */
window.APEX = window.APEX || {};
(function () {
  const LS_KEY = "apex_notices_draft";

  const store = {
    seed: [],     // 실제 게시된 공고 (notices.json)
    data: [],     // 화면 표시용 (임시본 있으면 그것, 없으면 seed 복제)
    loaded: false,

    async load() {
      try {
        const res = await fetch("data/notices.json?cb=" + Date.now(), { cache: "no-store" });
        const json = await res.json();
        this.seed = Array.isArray(json.notices) ? json.notices : [];
      } catch (e) {
        console.warn("[APEX] notices.json 로드 실패:", e);
        this.seed = [];
      }
      const draft = localStorage.getItem(LS_KEY);
      this.data = draft ? JSON.parse(draft) : JSON.parse(JSON.stringify(this.seed));
      this.loaded = true;
    },
    save() { localStorage.setItem(LS_KEY, JSON.stringify(this.data)); },
    hasDraft() { return !!localStorage.getItem(LS_KEY); },
    reset() { localStorage.removeItem(LS_KEY); this.data = JSON.parse(JSON.stringify(this.seed)); }
  };
  APEX.store = store;

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  let openId = null;

  function renderBoard() {
    const rowsEl = $("rows"), emptyEl = $("empty");
    if (!rowsEl) return;
    const kw = ($("q").value || "").trim().toLowerCase();
    const f = $("from").value, t = $("to").value, c = $("cat").value;

    const list = store.data
      .filter((n) => {
        if (kw && !(n.title.toLowerCase().includes(kw) || n.body.toLowerCase().includes(kw))) return false;
        if (c && n.category !== c) return false;
        if (f && n.date < f) return false;
        if (t && n.date > t) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

    rowsEl.innerHTML = "";
    emptyEl.hidden = list.length > 0;
    list.forEach((n, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td class="num">' + (list.length - i) + "</td>" +
        '<td class="ttl">' + esc(n.title) + '<span class="tag">' + esc(n.category) + "</span></td>" +
        '<td class="date">' + esc(n.date) + "</td>" +
        '<td class="date">' + (esc(n.updated) || "—") + "</td>";
      tr.addEventListener("click", () => { openId = openId === n.id ? null : n.id; renderBoard(); });
      rowsEl.appendChild(tr);
      if (openId === n.id) {
        const br = document.createElement("tr");
        br.className = "body-row";
        br.innerHTML = '<td></td><td colspan="3">' + esc(n.body) + "</td>";
        rowsEl.appendChild(br);
      }
    });
  }
  APEX.renderBoard = renderBoard;

  APEX.initBoard = function () {
    ["q", "from", "to", "cat"].forEach((id) => {
      const el = $(id);
      if (el) el.addEventListener("input", renderBoard);
    });
    renderBoard();
  };
})();
