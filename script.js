/**
 * TechHub.ia.br – script.js
 * Interações, animações e lógica de carregamento
 * Vanilla JS puro (sem dependências externas)
 */

(function () {
  'use strict';

  /* ========================================================
     1. MOBILE MENU TOGGLE
     ======================================================== */
  var menuToggle = document.getElementById('menuToggle');
  var navLinks   = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var isActive = navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isActive));
    });

    // Fecha o menu ao clicar em qualquer link (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ========================================================
     2. NAVBAR – EFEITO DE SCROLL (adiciona classe .scrolled)
     ======================================================== */
  var navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ========================================================
     3. SCROLL-REVEAL (Intersection Observer)
        Adiciona .visible aos elementos com classe .reveal
        quando entram na viewport
     ======================================================== */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // dispara apenas uma vez
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: exibe todos imediatamente se IntersectionObserver não for suportado
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ========================================================
     4. HOVER MICROINTERAÇÃO – ANEL VERDE NAS FOTOS DO TIME
        (reforço via JS para garantir compatibilidade)
        O CSS já cuida do efeito; este bloco adiciona
        acessibilidade via teclado (focus)
     ======================================================== */
  var teamCards = document.querySelectorAll('.team-card');

  teamCards.forEach(function (card) {
    // Permite foco via teclado para acessibilidade
    card.setAttribute('tabindex', '0');

    card.addEventListener('focus', function () {
      card.classList.add('focused');
    });

    card.addEventListener('blur', function () {
      card.classList.remove('focused');
    });
  });

  /* ========================================================
     5. AVATAR – FALLBACK PARA IMAGEM COM ERRO DE CARREGAMENTO
        Se a foto não carregar, exibe um SVG de avatar genérico
     ======================================================== */
  var avatars = document.querySelectorAll('.team-avatar');

  avatars.forEach(function (img) {
    img.addEventListener('error', function () {
      // Gera um SVG de avatar placeholder com as iniciais do nome
      var name = img.getAttribute('alt') || '?';
      var initials = name
        .split(' ')
        .slice(0, 2)
        .map(function (n) { return n.charAt(0).toUpperCase(); })
        .join('');

      // Substitui por um SVG inline como data URI
      var svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">',
        '<rect width="90" height="90" rx="45" fill="#1A1A1A"/>',
        '<rect width="90" height="90" rx="45" fill="none" stroke="#00E676" stroke-width="2" opacity="0.4"/>',
        '<text x="45" y="56" text-anchor="middle" font-family="Inter,sans-serif"',
        ' font-weight="700" font-size="28" fill="#00E676">' + initials + '</text>',
        '</svg>'
      ].join('');

      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  });

  /* ========================================================
     6. SMOOTH SCROLL PARA ÂNCORAS INTERNAS
        (reforço para navegadores que não suportam CSS scroll-behavior)
     ======================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navbarHeight = navbar ? navbar.offsetHeight : 0;
        var targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

})();
