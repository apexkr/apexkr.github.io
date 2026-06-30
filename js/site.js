/* =========================================================
   site.js — 사이트 콘텐츠(회사정보/히어로/회사소개) 스토어 + 렌더링
   출처: data/site.json. 관리자 임시 편집분은 localStorage 우선.
   HTML에 기본값(폴백/SEO)이 이미 있으므로, 데이터가 있을 때만 덮어씀.
   ========================================================= */
window.APEX = window.APEX || {};
(function () {
  const LS_KEY = "apex_site_draft";

  const site = {
    seed: null,
    data: null,
    async load() {
      try {
        const res = await fetch("data/site.json?cb=" + Date.now(), { cache: "no-store" });
        this.seed = await res.json();
      } catch (e) {
        console.warn("[APEX] site.json 로드 실패:", e);
        this.seed = null;
      }
      const draft = localStorage.getItem(LS_KEY);
      this.data = draft ? JSON.parse(draft) : (this.seed ? JSON.parse(JSON.stringify(this.seed)) : null);
    },
    save() { localStorage.setItem(LS_KEY, JSON.stringify(this.data)); },
    hasDraft() { return !!localStorage.getItem(LS_KEY); },
    reset() { localStorage.removeItem(LS_KEY); this.data = this.seed ? JSON.parse(JSON.stringify(this.seed)) : null; }
  };
  APEX.site = site;

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const setText = (id, v) => { const el = $(id); if (el && v != null) el.textContent = v; };
  const setHtml = (id, v) => { const el = $(id); if (el && v != null) el.innerHTML = v; };

  function renderSite() {
    const d = site.data;
    if (!d) return;
    if (d.hero) {
      setText("heroKicker", d.hero.kicker);
      setHtml("heroTitle", d.hero.title_html);
      setText("heroLead", d.hero.lead);
    }
    if (d.about) {
      setText("aboutTitle", d.about.title);
      setHtml("aboutLead", d.about.lead);
    }
    if (d.company) {
      const c = d.company;
      const dl = $("companyDl");
      if (dl) {
        const rows = [
          ["상호", esc(c.name_ko) + ' <span class="muted">(' + esc(c.name_en) + ")</span>"],
          ["대표이사", esc(c.ceo)],
          ["본점 소재지", esc(c.address)],
          ["설립일", esc(c.established)],
          ["사업 분야", esc(c.field)],
          ["공고방법", esc(c.notice_method)]
        ];
        dl.innerHTML = rows.map((r) => "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>").join("");
      }
    }
  }
  APEX.renderSite = renderSite;
})();
