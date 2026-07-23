/**
 * SEDRA STORE – Main Script
 * Particles • Cursor Glow • Scroll Reveal • Cards • Back To Top
 */

/* ══════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }
  }, 2000);
});

/* ══════════════════════════════════════════
   2. CURSOR GLOW
══════════════════════════════════════════ */
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => {
  if (cursorGlow) cursorGlow.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  if (cursorGlow) cursorGlow.style.opacity = '1';
});

/* ══════════════════════════════════════════
   3. GOLDEN PARTICLES
══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }

    reset(fresh) {
      this.x     = Math.random() * W;
      this.y     = fresh ? Math.random() * H : H + 10;
      this.size  = Math.random() * 2 + 0.5;
      this.speedY= -(Math.random() * 0.4 + 0.1);
      this.speedX= (Math.random() - 0.5) * 0.2;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.5 + 0.1;
      this.phase = Math.random() * Math.PI * 2;
      this.life  = 0;
      this.maxLife = Math.random() * 300 + 200;
    }

    update() {
      this.life++;
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.phase + this.life * 0.02) * 0.15;
      this.phase += 0.01;

      const ratio = this.life / this.maxLife;
      if (ratio < 0.2)      this.alpha = (ratio / 0.2) * this.maxAlpha;
      else if (ratio > 0.8) this.alpha = ((1 - ratio) / 0.2) * this.maxAlpha;
      else                  this.alpha = this.maxAlpha;

      if (this.life >= this.maxLife || this.y < -10) this.reset(false);
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = '#D4AF37';
      ctx.shadowBlur  = 6;
      ctx.shadowColor = 'rgba(212,175,55,0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create particles
  const PARTICLE_COUNT = window.innerWidth < 600 ? 30 : 60;
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ══════════════════════════════════════════
   4. RENDER ACTION CARDS
══════════════════════════════════════════ */
function getButtons() {
  try {
    const saved = localStorage.getItem('sedra_buttons');
    if (saved) return JSON.parse(saved);
  } catch (e) { /* fallback */ }
  return SEDRA_CONFIG.defaultButtons;
}

function createCard(btn) {
  const a = document.createElement('a');
  a.href  = btn.url || '#';
  a.target = btn.url && btn.url.startsWith('http') ? '_blank' : '_self';
  a.rel  = 'noopener noreferrer';
  a.className = 'action-card reveal';
  a.setAttribute('role', 'listitem');
  a.setAttribute('aria-label', btn.label);

  a.innerHTML = `
    <div class="card-icon">${btn.icon || ''}</div>
    <div class="card-label">${btn.label}</div>
    <div class="card-desc">${btn.description || ''}</div>
  `;

  /* Ripple effect */
  a.addEventListener('click', function(e) {
    const rect   = a.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size   = Math.max(rect.width, rect.height) * 2;
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
    a.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  return a;
}

function renderCards() {
  const container = document.getElementById('cards-container');
  if (!container) return;
  container.innerHTML = '';
  const buttons = getButtons();
  buttons.forEach(btn => container.appendChild(createCard(btn)));
  // observeReveal() is called after render via setTimeout below
}

renderCards();

/* ══════════════════════════════════════════
   5. SCROLL REVEAL  (content always visible as fallback)
══════════════════════════════════════════ */
let revealObserver;

function observeReveal() {
  if (revealObserver) revealObserver.disconnect();

  // Only hide elements that are BELOW the current viewport
  const allReveal = document.querySelectorAll('.reveal');
  const vh = window.innerHeight;

  allReveal.forEach(el => {
    const rect = el.getBoundingClientRect();
    // Only prep-hide elements that are below the fold
    if (rect.top > vh + 40) {
      el.classList.add('reveal-ready');
    } else {
      // Already on screen — show immediately
      el.classList.remove('reveal-ready');
    }
  });

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => {
          el.classList.add('visible');
          el.classList.remove('reveal-ready');
        }, i * 80);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  allReveal.forEach(el => {
    if (el.classList.contains('reveal-ready')) {
      revealObserver.observe(el);
    }
  });
}

// Run after a tiny delay so DOM has rendered
setTimeout(observeReveal, 100);

/* ══════════════════════════════════════════
   6. BACK TO TOP
══════════════════════════════════════════ */
const backBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (!backBtn) return;
  if (window.scrollY > 400) backBtn.classList.add('visible');
  else                       backBtn.classList.remove('visible');
}, { passive: true });

if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  backBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* ══════════════════════════════════════════
   7. SMOOTH SCROLL for anchors
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════════════════════════════════════
   8. HERO PARALLAX (subtle — hero only)
══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  const scrolled = window.scrollY;
  const heroH    = document.querySelector('.hero')?.offsetHeight || 800;
  // Only apply while hero is visible
  if (scrolled < heroH) {
    hero.style.transform = `translateY(${scrolled * 0.18}px)`;
    hero.style.opacity   = Math.max(0.05, 1 - scrolled / 700);
  }
}, { passive: true });
