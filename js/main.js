/* =========================================================
   main.js — 초기화: 모바일 네비, 스크롤 등장 모션, 데이터 로드
   ========================================================= */
(function () {
  // ---- 모바일 메뉴 ----
  const nav = document.getElementById("nav");
  const mb = document.getElementById("menuBtn");
  if (mb && nav) {
    mb.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open")));
  }

  // ---- 스크롤 등장 모션 (IntersectionObserver) ----
  function initReveal() {
    const els = document.querySelectorAll(".reveal, .phase");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  // ---- 부팅 ----
  async function boot() {
    initReveal();
    if (!window.APEX) return;
    const jobs = [];
    if (APEX.store) jobs.push(APEX.store.load());
    if (APEX.site) jobs.push(APEX.site.load());
    await Promise.all(jobs);
    if (APEX.site && APEX.renderSite) APEX.renderSite();
    if (APEX.store && APEX.initBoard) APEX.initBoard();
    if (APEX.initAdmin) APEX.initAdmin();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
