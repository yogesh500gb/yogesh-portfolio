
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const current = document.body.dataset.page || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === 'case-studies.html' && href === 'portfolio.html')) a.classList.add('active');
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: .08 });

  document.querySelectorAll('.feature-card,.metric-card,.project-card,.work-card,.process-card,.expertise-row,.timeline-item,.case-card,.insight-grid article,.proof-grid img').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
});
