// ===== 3D TILT EFFECT ON HERO CARD =====
const heroCard = document.querySelector('.hero-3d-card');
const perspectiveContainer = document.querySelector('.perspective-container');

if (heroCard && perspectiveContainer) {
  perspectiveContainer.addEventListener('mousemove', (e) => {
    const rect = perspectiveContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  perspectiveContainer.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'rotateX(4deg) rotateY(0deg)';
  });
}

// ===== 3D TILT ON PROBLEM CARDS =====
document.querySelectorAll('.problem-card').forEach(card => {
  const inner = card.querySelector('.card-3d-inner');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    inner.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(
  '.problem-card, .step-card, .advantage-card, .demo-card, .glass-card, .cta-section-3d > *'
);
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    navbar.style.background = 'rgba(24, 24, 27, 0.85)';
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
  } else {
    navbar.style.background = '';
    navbar.style.boxShadow = '';
  }
  lastScroll = scrollY;
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== STAGGERED REVEAL FOR GRIDS =====
document.querySelectorAll('.grid').forEach(grid => {
  const children = grid.querySelectorAll('.reveal');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
  });
});
