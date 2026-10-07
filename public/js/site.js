document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile nav toggle ── */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.navlinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
      var isOpen = userChip.classList.toggle('is-open');
      chipBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      userChip.classList.remove('is-open');
      chipBtn.setAttribute('aria-expanded', 'false');
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
  var progressBar = document.getElementById('readProgress');
  var articleBody = document.getElementById('articleBody');
  if (progressBar && articleBody) {
    window.addEventListener('scroll', function () {
      var bodyRect  = articleBody.getBoundingClientRect();
      var bodyTop   = bodyRect.top + window.scrollY;
      var bodyHeight = articleBody.offsetHeight;
      var scrolled  = window.scrollY - bodyTop;
      var pct = Math.min(Math.max((scrolled / bodyHeight) * 100, 0), 100);
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Read time estimate ── */
  var readTimeLabel = document.getElementById('readTimeLabel');
  if (readTimeLabel && articleBody) {
    var words = articleBody.textContent.trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.round(words / 200));
    readTimeLabel.textContent = minutes + ' min read';
  }

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    /* Fallback: just show everything */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Dropzone drag-over highlight ── */
  var dropzone = document.getElementById('dropzoneField');
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function () {
        dropzone.classList.remove('drag-over');
      });
    });

    /* Show selected filename */
    var fileInput = dropzone.querySelector('input[type="file"]');
    var hint = document.getElementById('coverImageHint');
    if (fileInput && hint) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) {
          hint.textContent = '✓ ' + fileInput.files[0].name;
          hint.style.color = 'var(--green)';
        }
      });
    }
  }

});
