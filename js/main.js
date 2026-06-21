/**
 * TechHub.ia.br – main.js (CRO Optimized v2)
 * Interações: modal, formulário, sticky CTA, contadores FOMO,
 * accordion (Cases), carousel (Depoimentos), scroll-reveal, menu mobile.
 * Vanilla JS puro – sem dependências externas.
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

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ========================================================
     2. NAVBAR – EFEITO DE SCROLL
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
     ======================================================== */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ========================================================
     4. FOMO COUNTERS – Animação de contagem crescente
        Dispara quando a seção hero-stats entra na viewport
     ======================================================== */
  var counters = document.querySelectorAll('.counter');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated || counters.length === 0) return;
    countersAnimated = true;

    counters.forEach(function (counter) {
      var target = parseFloat(counter.getAttribute('data-target')) || 0;
      var prefix = counter.getAttribute('data-prefix') || '';
      var suffix = counter.getAttribute('data-suffix') || '';
      var decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
      var isDown = counter.getAttribute('data-direction') === 'down';
      var duration = 2000; // 2 segundos
      var startTime = null;
      var startValue = isDown ? target : 0;
      var endValue = isDown ? 0 : target;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Easing easeOutExpo
        var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        var current = startValue + (endValue - startValue) * eased;

        counter.textContent = prefix + current.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = prefix + endValue.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Observa o container de stats para disparar a animação
  var heroStats = document.getElementById('heroStats');
  if (heroStats && counters.length > 0) {
    if ('IntersectionObserver' in window) {
      var statsObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.unobserve(heroStats);
          }
        },
        { threshold: 0.5 }
      );
      statsObserver.observe(heroStats);
    } else {
      // Fallback: anima após um pequeno delay
      setTimeout(animateCounters, 400);
    }
  }

  /* ========================================================
     5. LEAD FORM VALIDATION (in-page form #leadForm)
     ======================================================== */
  var leadForm = document.getElementById('leadForm');

  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      clearFormErrors();

      var nome     = document.getElementById('nome');
      var email    = document.getElementById('email');
      var empresa  = document.getElementById('empresa');
      var mensagem = document.getElementById('mensagem');

      var isValid = true;

      // Validate nome
      if (!nome.value.trim()) {
        showFieldError(nome, 'nomeError', 'Nome completo é obrigatório.');
        isValid = false;
      }

      // Validate email
      if (!email.value.trim()) {
        showFieldError(email, 'emailError', 'E-mail é obrigatório.');
        isValid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showFieldError(email, 'emailError', 'Informe um e-mail corporativo válido.');
        isValid = false;
      }

      // Validate empresa
      if (!empresa.value.trim()) {
        showFieldError(empresa, 'empresaError', 'Nome da empresa é obrigatório.');
        isValid = false;
      }

      // Validate mensagem
      if (!mensagem.value.trim()) {
        showFieldError(mensagem, 'mensagemError', 'A mensagem é obrigatória.');
        isValid = false;
      }

      if (isValid) {
        handleFormSuccess(leadForm, document.getElementById('formSuccess'));
      }
    });
  }

  /* ========================================================
     6. MODAL LEAD FORM VALIDATION (#modalLeadForm)
     ======================================================== */
  var modalLeadForm = document.getElementById('modalLeadForm');

  if (modalLeadForm) {
    modalLeadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      clearModalFormErrors();

      var nome     = document.getElementById('modalNome');
      var email    = document.getElementById('modalEmail');
      var empresa  = document.getElementById('modalEmpresa');
      var mensagem = document.getElementById('modalMensagem');

      var isValid = true;

      if (!nome.value.trim()) {
        showFieldError(nome, 'modalNomeError', 'Nome completo é obrigatório.');
        isValid = false;
      }

      if (!email.value.trim()) {
        showFieldError(email, 'modalEmailError', 'E-mail é obrigatório.');
        isValid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showFieldError(email, 'modalEmailError', 'Informe um e-mail corporativo válido.');
        isValid = false;
      }

      if (!empresa.value.trim()) {
        showFieldError(empresa, 'modalEmpresaError', 'Nome da empresa é obrigatório.');
        isValid = false;
      }

      if (!mensagem.value.trim()) {
        showFieldError(mensagem, 'modalMensagemError', 'A mensagem é obrigatória.');
        isValid = false;
      }

      if (isValid) {
        handleFormSuccess(modalLeadForm, document.getElementById('modalFormSuccess'));
      }
    });
  }

  /**
   * Helper: Validate email format
   */
  function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Helper: Show field error
   */
  function showFieldError(field, errorId, message) {
    field.classList.add('error');
    var errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  /**
   * Helper: Clear in-page form errors
   */
  function clearFormErrors() {
    var fields = document.querySelectorAll('#leadForm .form-input, #leadForm .form-textarea');
    fields.forEach(function (f) { f.classList.remove('error'); });
    var errors = document.querySelectorAll('#leadForm .form-error');
    errors.forEach(function (e) { e.textContent = ''; });
  }

  /**
   * Helper: Clear modal form errors
   */
  function clearModalFormErrors() {
    var fields = document.querySelectorAll('#modalLeadForm .form-input, #modalLeadForm .form-textarea');
    fields.forEach(function (f) { f.classList.remove('error'); });
    var errors = document.querySelectorAll('#modalLeadForm .form-error');
    errors.forEach(function (e) { e.textContent = ''; });
  }

  /**
   * Helper: Handle successful form submission via AJAX (fetch)
   * Sends data to FormSubmit without redirecting the user.
   * Shows inline success message instead.
   */
  function handleFormSuccess(form, successDiv) {
    // Coletar dados para log antes de enviar
    var formData = new FormData(form);
    var dados = {};
    formData.forEach(function (value, key) {
      dados[key] = value;
    });

    console.log('Lead capturado:', dados);

    // Desabilita o botão de submit para evitar envio duplo
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    // Envia via fetch (AJAX) – sem redirecionar o usuário
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function (response) {
      if (response.ok) {
        // Sucesso: esconde o form e mostra mensagem de sucesso
        form.style.display = 'none';
        if (successDiv) {
          successDiv.style.display = '';
          // Scroll suave até a mensagem de sucesso
          successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Erro do servidor – reabilita o botão
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Quero uma consultoria gratuita de 30 min';
        }
        console.error('Erro ao enviar formulário:', response.status);
        alert('Ocorreu um erro ao enviar. Por favor, tente novamente ou entre em contato via WhatsApp.');
      }
    })
    .catch(function (error) {
      // Erro de rede – reabilita o botão
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Quero uma consultoria gratuita de 30 min';
      }
      console.error('Erro de rede ao enviar formulário:', error);
      alert('Erro de conexão. Por favor, verifique sua internet e tente novamente.');
    });
  }

  /* ========================================================
     7. MODAL OPEN/CLOSE
     ======================================================== */
  var leadModal = document.getElementById('leadModal');

  window.openLeadModal = function () {
    if (!leadModal) return;
    // Reset modal form if previously submitted
    var modalForm = document.getElementById('modalLeadForm');
    var modalSuccess = document.getElementById('modalFormSuccess');
    if (modalForm && modalSuccess) {
      modalForm.style.display = '';
      modalSuccess.style.display = 'none';
      modalForm.reset();
      clearModalFormErrors();
    }
    leadModal.classList.add('visible');
    leadModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first input
    var firstInput = leadModal.querySelector('input');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 150);
  };

  window.closeLeadModal = function () {
    if (!leadModal) return;
    leadModal.classList.remove('visible');
    leadModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Close modal on overlay click (outside content)
  if (leadModal) {
    leadModal.addEventListener('click', function (e) {
      if (e.target === leadModal) {
        closeLeadModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && leadModal && leadModal.classList.contains('visible')) {
      closeLeadModal();
    }
  });

  /* ========================================================
     8. STICKY CTA BAR – Aparece após 40% de scroll da página
     ======================================================== */
  var stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    var stickyThreshold = 0.10; // 10% da página
    var stickyShown = false;

    window.addEventListener('scroll', function () {
      var scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= stickyThreshold && !stickyShown) {
        stickyCta.classList.add('visible');
        stickyCta.setAttribute('aria-hidden', 'false');
        stickyShown = true;
      } else if (scrollPercent < stickyThreshold && stickyShown) {
        stickyCta.classList.remove('visible');
        stickyCta.setAttribute('aria-hidden', 'true');
        stickyShown = false;
      }
    }, { passive: true });
  }

  /* ========================================================
     9. ACCORDION – Cases de Sucesso
     ======================================================== */
  var accordion = document.getElementById('casesAccordion');
  if (accordion) {
    var accordionHeaders = accordion.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(function (header) {
      header.addEventListener('click', function () {
        var item = header.parentElement;
        var isActive = item.classList.contains('active');

        // Close all items
        accordion.querySelectorAll('.accordion-item').forEach(function (el) {
          el.classList.remove('active');
          el.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ========================================================
     10. CAROUSEL – Depoimentos (com swipe support mobile)
     ======================================================== */
  var carousel = document.getElementById('testimonialCarousel');
  if (carousel) {
    var track = document.getElementById('carouselTrack');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var currentSlide = 0;
    var totalSlides = slides.length;
    var autoRotateInterval;
    var autoRotateDelay = 6000; // 6 segundos entre slides

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      // Update dots
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    // Dot clicks
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var slideIndex = parseInt(dot.getAttribute('data-slide'));
        goToSlide(slideIndex);
        resetAutoRotate();
      });
    });

    // Auto-rotate
    function startAutoRotate() {
      autoRotateInterval = setInterval(function () {
        goToSlide(currentSlide + 1);
      }, autoRotateDelay);
    }

    function resetAutoRotate() {
      clearInterval(autoRotateInterval);
      startAutoRotate();
    }

    // Swipe support for mobile
    var touchStartX = 0;
    var touchEndX = 0;

    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentSlide + 1); // swipe left → next
        } else {
          goToSlide(currentSlide - 1); // swipe right → prev
        }
        resetAutoRotate();
      }
    }

    // Start auto-rotation
    startAutoRotate();

    // Pause on hover/focus for accessibility
    carousel.addEventListener('mouseenter', function () {
      clearInterval(autoRotateInterval);
    });
    carousel.addEventListener('mouseleave', function () {
      startAutoRotate();
    });
  }

  /* ========================================================
     11. AVATAR – FALLBACK PARA IMAGEM COM ERRO
     ======================================================== */
  var avatars = document.querySelectorAll('.team-avatar');

  avatars.forEach(function (img) {
    img.addEventListener('error', function () {
      var name = img.getAttribute('alt') || '?';
      var initials = name
        .split(' ')
        .slice(0, 2)
        .map(function (n) { return n.charAt(0).toUpperCase(); })
        .join('');

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
     12. SMOOTH SCROLL PARA ÂNCORAS INTERNAS (reforço)
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

  /* ========================================================
     13. TEAM CARDS – Acessibilidade via teclado (focus)
     ======================================================== */
  var teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(function (card) {
    card.setAttribute('tabindex', '0');
    card.addEventListener('focus', function () {
      card.classList.add('focused');
    });
    card.addEventListener('blur', function () {
      card.classList.remove('focused');
    });
  });

})();