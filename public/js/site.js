document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.navlinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('is-open');
    });
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('is-open');
      }
    });
  }

  var userChip = document.querySelector('.user-chip');
  if (userChip) {
    var chipBtn = userChip.querySelector('.user-chip__btn');
    chipBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      userChip.classList.toggle('is-open');
    });
    document.addEventListener('click', function () {
      userChip.classList.remove('is-open');
    });
  }
});
