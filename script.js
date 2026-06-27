/**
 * 10isConnect — script.js
 * Lightweight, dependency-free JavaScript
 */

(function () {
  'use strict';

  /* ─── STICKY NAV ─────────────────────── */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── MOBILE MENU ────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  /* ─── SMOOTH SCROLL ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        toggleMenu(false);
      }
    });
  });

  /* ─── SCROLL REVEAL ──────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── PLATFORM PREVIEW TABS ──────────── */
  const tabs = document.querySelectorAll('.prev-tab');
  const panels = document.querySelectorAll('.prev-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('active');
        animateBars(panel);
      }
    });
  });

  /* ─── ANIMATE STAT BARS ──────────────── */
  function animateBars(container) {
    container.querySelectorAll('.sbm-fill').forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = target; }, 50);
      });
    });
    container.querySelectorAll('.rating-fill').forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = target; }, 50);
      });
    });
  }

  /* Animate bars when stats section enters view */
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBars(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.preview-window, .phone-screen').forEach(el => {
    statsObserver.observe(el);
  });

  /* ─── COUNTER ANIMATION ──────────────── */
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();
    const startVal = 0;
    const isFloat = target % 1 !== 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * ease;
      el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.dataset.count;
          const target = parseFloat(raw);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ─── ACTIVE NAV LINK HIGHLIGHT ──────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active-link',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ─── CTA EMAIL FORM ─────────────────── */
  const ctaSubmit = document.querySelector('.cta-submit');
  const ctaInput = document.querySelector('.cta-input');
  const ctaFine = document.querySelector('.cta-fine');

  if (ctaSubmit && ctaInput) {
    ctaSubmit.addEventListener('click', () => {
      const email = ctaInput.value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        shakeEl(ctaInput.closest('.cta-input-group'));
        return;
      }
      if (!emailRe.test(email)) {
        shakeEl(ctaInput.closest('.cta-input-group'));
        ctaFine.textContent = 'Please enter a valid email address.';
        ctaFine.style.color = '#f87171';
        return;
      }

      ctaSubmit.textContent = '✓ You\'re on the list!';
      ctaSubmit.style.background = 'linear-gradient(135deg,#375623,#70AD47)';
      ctaInput.value = '';
      ctaInput.disabled = true;
      ctaSubmit.disabled = true;
      ctaFine.textContent = 'Welcome to the 10isConnect community. We\'ll be in touch soon.';
      ctaFine.style.color = 'rgba(168,204,56,0.8)';
    });

    ctaInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') ctaSubmit.click();
    });
  }

  function shakeEl(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  }

  /* ─── INJECT SHAKE KEYFRAME ──────────── */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }
    .nav-link.active-link { color: #fff !important; }
  `;
  document.head.appendChild(shakeStyle);

  /* ─── CURSOR GLOW (desktop only) ─────── */
  if (window.innerWidth > 960 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed;pointer-events:none;z-index:9999;
      width:300px;height:300px;border-radius:50%;
      background:radial-gradient(circle,rgba(0,176,155,0.04) 0%,transparent 70%);
      transform:translate(-50%,-50%);
      transition:left 0.15s ease,top 0.15s ease;
      left:-300px;top:-300px;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ─── FEATURE CARD TILT (desktop) ────── */
  if (window.innerWidth > 960) {
    document.querySelectorAll('.eco-card, .feature-card, .vc-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ─── LOGO FALLBACK INIT ─────────────── */
  document.querySelectorAll('.logo-img').forEach(img => {
    if (!img.complete || img.naturalWidth === 0) {
      img.style.display = 'none';
      const fallback = img.nextElementSibling;
      if (fallback) fallback.style.display = 'flex';
    }
  });

})();
