function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldState(field, isValid, message) {
  if (!field.el) return;
  field.el.classList.toggle('is-invalid', !isValid);
  field.el.classList.toggle('is-valid', isValid);

  let feedback = field.el.parentElement.querySelector('.invalid-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    field.el.parentElement.appendChild(feedback);
  }
  feedback.textContent = message || '';
}

function getFields() {
  return {
    userName:    { el: document.getElementById('userName'),    label: 'Name' },
    userEmail:   { el: document.getElementById('userEmail'),   label: 'Email' },
    userMessage: { el: document.getElementById('userMessage'), label: 'Message' },
  };
}

function validateField(fields, key) {
  const field = fields[key];
  if (!field.el) return true;
  const value = field.el.value.trim();

  if (!value) {
    setFieldState(field, false, `${field.label} is required.`);
    return false;
  }
  if (key === 'userEmail' && !isValidEmail(value)) {
    setFieldState(field, false, 'Please enter a valid email address.');
    return false;
  }
  setFieldState(field, true, '');
  return true;
}

function sendMessage() {
  const fields = getFields();
  const isValid = Object.keys(fields).every(key => validateField(fields, key));
  if (!isValid) return;

  const name    = fields.userName.el.value.trim();
  const email   = fields.userEmail.el.value.trim();
  const message = fields.userMessage.el.value.trim();

  const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`);

  window.location.href = `mailto:arranvestalsept15@gmail.com?subject=${subject}&body=${body}`;

  const btn = document.querySelector('.btn-send-glass');
  if (!btn) return;

  const original = btn.textContent;
  btn.textContent = '✓ Opening your mail app...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    Object.values(fields).forEach(({ el }) => {
      if (el) {
        el.value = '';
        el.classList.remove('is-valid', 'is-invalid');
      }
    });
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {

  AOS.init({ duration: 1000, once: false, offset: 180 });

  const navbar         = document.querySelector('.navbar');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navLinks       = document.querySelectorAll('.nav-link, .navbar-brand');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId?.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (!target) return;

      const offset = navbar?.offsetHeight ?? 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });

      if (navbarCollapse?.classList.contains('show')) {
        (bootstrap.Collapse.getInstance(navbarCollapse) ||
          new bootstrap.Collapse(navbarCollapse, { toggle: false })).hide();
      }
    });
  });

  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (navbar) {
      navbar.style.backgroundColor = window.scrollY > 50
        ? 'rgba(0, 0, 0, 0.92)'
        : 'rgba(0, 0, 0, 0.6)';
      navbar.classList.toggle('shadow-lg', window.scrollY > 50);
    }

    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', !!current && href?.includes(current));
    });
  }

  let scrollTimer;
  window.addEventListener('scroll', () => {
    if (!scrollTimer) {
      scrollTimer = setTimeout(() => { onScroll(); scrollTimer = null; }, 50);
    }
  });

  onScroll();

  const skillCards    = document.querySelectorAll('.skill-card');
  const skillsSection = document.querySelector('#skills');

  skillCards.forEach((card, i) => {
    card.style.cssText += `opacity:0; transform:translateY(20px);
      transition: opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`;
  });

  if (skillsSection) {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        skillCards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        obs.unobserve(skillsSection);
      });
    }, { threshold: 0.1 }).observe(skillsSection);
  }

  const fields = getFields();
  Object.keys(fields).forEach(key => {
    const { el } = fields[key];
    if (!el) return;
    el.addEventListener('blur',  () => validateField(fields, key));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) validateField(fields, key);
    });
  });

  // ✅ Tab switcher moved INSIDE DOMContentLoaded so elements exist when this runs
  const tabBtns = document.querySelectorAll('.about-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.about-tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

});

// Scroll to top button visibility
window.onscroll = function () {
  const btn = document.getElementById("scrollTopBtn");
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}