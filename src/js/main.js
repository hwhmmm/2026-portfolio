/* =========================================================
   황원홍 포트폴리오 — 인터랙션 (vanilla JS)
   - 다크/라이트 토글 (localStorage 저장)
   - 스크롤 리빌
   - 스크롤 스파이 네비
   - 히어로 마우스 패럴럭스
   - 메뉴바 스크롤 상태 + TOP 버튼
   ========================================================= */
(() => {
  'use strict';

  const wrap = document.getElementById('wrap');
  const mbar = document.getElementById('mbar');
  const topBtn = document.getElementById('topbtn');
  const hero = document.querySelector('.hero-stage');

  /* ---------- Theme toggle ---------- */
  let saved = null;
  try { saved = localStorage.getItem('wh-theme'); } catch {}
  if (saved === 'dark') wrap.setAttribute('data-theme', 'dark');

  const toggleTheme = () => {
    const isDark = wrap.getAttribute('data-theme') === 'dark';
    if (isDark) {
      wrap.removeAttribute('data-theme');
      try { localStorage.setItem('wh-theme', 'light'); } catch {}
    } else {
      wrap.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('wh-theme', 'dark'); } catch {}
    }
  };
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const worksGrid = document.querySelector('.works-grid');
  if ('IntersectionObserver' in window) {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (worksGrid && worksGrid.contains(e.target)) {
          /* works 카드: 같은 줄(offsetTop 동일)을 한 번에 등장 */
          const top = e.target.offsetTop;
          [...worksGrid.children].forEach((c) => {
            if (c.offsetTop === top && !c.classList.contains('in')) {
              c.classList.add('in');
              rio.unobserve(c);
            }
          });
        } else {
          e.target.classList.add('in');
          rio.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = (worksGrid && worksGrid.contains(el))
        ? '0s'
        : `${Math.min(i % 3, 2) * 0.08}s`;
      rio.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Scroll spy nav ---------- */
  const navLinks = document.querySelectorAll('[data-nav]');
  if ('IntersectionObserver' in window) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((n) => {
            n.classList.toggle('active', n.getAttribute('data-nav') === e.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach((s) => sio.observe(s));
  }

  /* ---------- Hero mouse parallax ---------- */
  const pxEls = hero ? hero.querySelectorAll('.px') : [];
  window.addEventListener('mousemove', (e) => {
    if (!hero) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    pxEls.forEach((el) => {
      const d = parseFloat(el.getAttribute('data-depth')) || 0;
      el.style.setProperty('--tx', `${x * d}px`);
      el.style.setProperty('--ty', `${y * d}px`);
    });
  });

  /* ---------- Menubar state + TOP button ---------- */
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (mbar) mbar.setAttribute('data-scrolled', y > 30 ? '1' : '0');
    if (topBtn) {
      const on = y > 600;
      topBtn.style.opacity = on ? '1' : '0';
      topBtn.style.pointerEvents = on ? 'auto' : 'none';
      topBtn.style.transform = on ? 'translateY(0)' : 'translateY(16px)';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
