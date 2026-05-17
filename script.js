// Fade-up on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Form submit
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '전송 완료! ✓';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = '메시지 보내기 →';
    btn.disabled = false;
    btn.style.opacity = '1';
    e.target.reset();
  }, 3000);
}
