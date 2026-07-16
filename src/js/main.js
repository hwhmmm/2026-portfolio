/* =========================================================
   황원홍 포트폴리오 — 인터랙션 (vanilla JS)
   - 다크/라이트 토글 (localStorage 저장)
   - 스크롤 리빌
   - 스크롤 스파이 네비
   - 히어로 마우스 패럴럭스
   - 메뉴바 스크롤 상태 + TOP 버튼
   ========================================================= */
(function () {
  'use strict';

  var wrap = document.getElementById('wrap');
  var mbar = document.getElementById('mbar');
  var topBtn = document.getElementById('topbtn');
  var hero = document.querySelector('.hero-stage');

  /* ---------- Theme toggle ---------- */
  var saved = null;
  try { saved = localStorage.getItem('wh-theme'); } catch (e) {}
  if (saved === 'dark') wrap.setAttribute('data-theme', 'dark');

  function toggleTheme() {
    var isDark = wrap.getAttribute('data-theme') === 'dark';
    if (isDark) {
      wrap.removeAttribute('data-theme');
      try { localStorage.setItem('wh-theme', 'light'); } catch (e) {}
    } else {
      wrap.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('wh-theme', 'dark'); } catch (e) {}
    }
  }
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-theme-toggle]'),
    function (btn) { btn.addEventListener('click', toggleTheme); }
  );

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(reveals, function (el, i) {
      el.style.transitionDelay = (Math.min(i % 3, 2) * 0.08) + 's';
      rio.observe(el);
    });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  }

  /* ---------- Scroll spy nav ---------- */
  var navLinks = document.querySelectorAll('[data-nav]');
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          Array.prototype.forEach.call(navLinks, function (n) {
            n.classList.toggle('active', n.getAttribute('data-nav') === e.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('section[id]'), function (s) { sio.observe(s); });
  }

  /* ---------- Hero mouse parallax ---------- */
  var pxEls = hero ? hero.querySelectorAll('.px') : [];
  window.addEventListener('mousemove', function (e) {
    if (!hero) return;
    var x = (e.clientX / window.innerWidth - 0.5);
    var y = (e.clientY / window.innerHeight - 0.5);
    Array.prototype.forEach.call(pxEls, function (el) {
      var d = parseFloat(el.getAttribute('data-depth')) || 0;
      el.style.setProperty('--tx', (x * d) + 'px');
      el.style.setProperty('--ty', (y * d) + 'px');
    });
  });

  /* ---------- Menubar state + TOP button ---------- */
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (mbar) mbar.setAttribute('data-scrolled', y > 30 ? '1' : '0');
    if (topBtn) {
      var on = y > 600;
      topBtn.style.opacity = on ? '1' : '0';
      topBtn.style.pointerEvents = on ? 'auto' : 'none';
      topBtn.style.transform = on ? 'translateY(0)' : 'translateY(16px)';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
