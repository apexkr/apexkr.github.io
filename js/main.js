/* =========================================================
   main.js — 초기화: 모바일 네비, 스크롤 등장 모션, 데이터 로드
   ========================================================= */
(function () {
  // 헤더/목차/푸터/모바일 메뉴는 layout.js가 주입·처리합니다.

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
