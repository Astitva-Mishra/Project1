document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initActiveNavHighlight();
  initBackToTop();
  initContactForm();
});

function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".site-nav");

  if (!toggleBtn || !navMenu) return;

  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !isOpen);
    toggleBtn.classList.toggle("open");
    navMenu.classList.toggle("open");
    overlay.classList.toggle("visible");

    document.body.style.overflow = isOpen ? "" : "hidden";
  }

  function closeMenu() {
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.classList.remove("open");
    navMenu.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  const navLinks = navMenu.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll(".scroll-reveal");
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.05,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (sections.length === 0 || navLinks.length === 0) return;

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#${id}` || (id === "hero" && href === "#")) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    {
      root: null,
      threshold: 0.35,
      rootMargin: "-20% 0px -30% 0px",
    },
  );

  sections.forEach((sec) => activeObserver.observe(sec));
}

function initBackToTop() {
  const bttBtn = document.getElementById("back-to-top");
  if (!bttBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      bttBtn.classList.add("visible");
    } else {
      bttBtn.classList.remove("visible");
    }
  });

  bttBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (!form || !statusEl) return;

  const inputs = form.querySelectorAll(".form-control");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const parent = input.closest(".form-group");
      if (parent) parent.classList.remove("invalid");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    statusEl.className = "form-status";
    statusEl.textContent = "";

    inputs.forEach((input) => {
      const parent = input.closest(".form-group");
      if (!parent) return;

      const val = input.value.trim();
      if (!val) {
        parent.classList.add("invalid");
        isValid = false;
      } else if (input.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          parent.classList.add("invalid");
          const errorMsg = parent.querySelector(".error-msg");
          if (errorMsg)
            errorMsg.textContent = "Please enter a valid email address";
          isValid = false;
        }
      }
    });

    if (isValid) {
      const submitBtn = form.querySelector(".btn-submit");
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Sending...</span>";

      setTimeout(() => {
        statusEl.classList.add("success");
        statusEl.textContent =
          "Thank you! Your message was sent successfully. I will get back to you shortly.";

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        form.reset();

        inputs.forEach((input) => {
          const parent = input.closest(".form-group");
          if (parent) parent.classList.remove("invalid");
        });
      }, 1200);
    } else {
      statusEl.classList.add("error");
      statusEl.textContent =
        "Please check all fields and fill out the required information.";
    }
  });
}
