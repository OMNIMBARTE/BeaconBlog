document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile nav toggle ── */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks  = document.querySelector('.navlinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── User chip dropdown ── */
  var userChip = document.querySelector('.user-chip');
  if (userChip) {
    var chipBtn = userChip.querySelector('.user-chip__btn');
    chipBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = userChip.classList.toggle('is-open');
      chipBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      userChip.classList.remove('is-open');
      if (chipBtn) chipBtn.setAttribute('aria-expanded', 'false');
    });
  }

  /* ── Sticky masthead scroll shadow ── */
  var masthead = document.getElementById('masthead');
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Reading progress bar ── */
  var progressBar  = document.getElementById('readProgress');
  var articleBody  = document.getElementById('articleBody');
  if (progressBar && articleBody) {
    window.addEventListener('scroll', function () {
      var bodyTop    = articleBody.getBoundingClientRect().top + window.scrollY;
      var bodyHeight = articleBody.offsetHeight;
      var pct = Math.min(Math.max(((window.scrollY - bodyTop) / bodyHeight) * 100, 0), 100);
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Read-time estimator ── */
  var readTimeLabel = document.getElementById('readTimeLabel');
  if (readTimeLabel && articleBody) {
    var words   = articleBody.textContent.trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.round(words / 200));
    readTimeLabel.textContent = minutes + ' min read';
  }

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.reveal');
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Dropzone drag-over + filename preview ── */
  var dropzone  = document.getElementById('dropzoneField');
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function () { dropzone.classList.remove('drag-over'); });
    });
    var fileInput = dropzone.querySelector('input[type="file"]');
    var hint      = document.getElementById('coverImageHint');
    if (fileInput && hint) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) {
          hint.textContent   = '✓ ' + fileInput.files[0].name;
          hint.style.color   = 'var(--green)';
        }
      });
    }
  }

  /* ──────────────────────────────────────────────
     THEME SWITCHER
     ────────────────────────────────────────────── */
  var THEMES = {
    newsprint: { icon: '☀️',  label: 'Newsprint' },
    dark:      { icon: '🌙',  label: 'Dark'      },
    slate:     { icon: '🔷',  label: 'Slate'     },
    forest:    { icon: '🌿',  label: 'Forest'    }
  };

  var themeKey   = 'blogify-theme';
  var pickerWrap = document.getElementById('themePicker');
  var pickerBtn  = document.getElementById('themePickerBtn');
  var pickerMenu = document.getElementById('themePickerMenu');
  var themeIcon  = document.getElementById('themeIcon');

  function applyTheme(name) {
    if (name === 'newsprint') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', name);
    }
    try { localStorage.setItem(themeKey, name); } catch(e) {}

    // update icon
    if (themeIcon && THEMES[name]) themeIcon.textContent = THEMES[name].icon;

    // update active state on buttons
    if (pickerMenu) {
      pickerMenu.querySelectorAll('.theme-option').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.dataset.theme === name);
      });
    }
  }

  // Initialize from storage
  var savedTheme = 'newsprint';
  try { savedTheme = localStorage.getItem(themeKey) || 'newsprint'; } catch(e) {}
  applyTheme(savedTheme);

  if (pickerBtn && pickerMenu && pickerWrap) {
    // Toggle menu open/close
    pickerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = pickerWrap.classList.toggle('is-open');
      pickerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Select a theme
    pickerMenu.querySelectorAll('.theme-option').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        applyTheme(btn.dataset.theme);
        pickerWrap.classList.remove('is-open');
        pickerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function () {
      pickerWrap.classList.remove('is-open');
      pickerBtn.setAttribute('aria-expanded', 'false');
    });

    // Keyboard: Escape closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        pickerWrap.classList.remove('is-open');
        pickerBtn.setAttribute('aria-expanded', 'false');
        if (userChip) userChip.classList.remove('is-open');
      }
    });
  }

});
