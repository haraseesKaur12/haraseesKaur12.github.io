const yearTargets = document.querySelectorAll("[data-year]");
yearTargets.forEach((target) => {
  target.textContent = new Date().getFullYear();
});

const currentPage = document.body.dataset.page;
const currentHref = currentPage === "home" ? "index.html" : `${currentPage}.html`;

document.querySelectorAll(".primary-nav a, .footer-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentHref) {
    link.classList.add("active");
  }
});

const masthead = document.querySelector(".masthead");
const primaryNav = document.querySelector(".primary-nav");
const navToggle = document.querySelector(".nav-toggle");

if (masthead && primaryNav && navToggle) {
  const setNavOpen = (isOpen) => {
    masthead.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  };

  const measureExpandedNav = () => {
    const wasCollapsed = masthead.classList.contains("nav-collapsed");
    const wasOpen = masthead.classList.contains("nav-open");

    if (wasCollapsed) {
      navToggle.hidden = true;
      masthead.classList.remove("nav-collapsed", "nav-open");
    }

    const navStyles = window.getComputedStyle(primaryNav);
    const gap = parseFloat(navStyles.columnGap) || 0;
    const linkWidth = [...primaryNav.children].reduce(
      (total, link) => total + link.getBoundingClientRect().width,
      0
    );
    const navWidth = linkWidth + gap * Math.max(primaryNav.children.length - 1, 0);
    const brandWidth = masthead.querySelector(".wordmark")?.getBoundingClientRect().width || 0;

    if (wasCollapsed) {
      masthead.classList.add("nav-collapsed");
      navToggle.hidden = false;
      if (wasOpen) {
        masthead.classList.add("nav-open");
      }
    }

    return brandWidth + navWidth;
  };

  const syncNavMode = () => {
    const requiredWidth = measureExpandedNav() + 74;
    const shouldCollapse = masthead.getBoundingClientRect().width < requiredWidth;

    masthead.classList.toggle("nav-collapsed", shouldCollapse);
    navToggle.hidden = !shouldCollapse;

    if (!shouldCollapse) {
      setNavOpen(false);
    }
  };

  let navFrame = 0;
  const queueNavSync = () => {
    cancelAnimationFrame(navFrame);
    navFrame = requestAnimationFrame(syncNavMode);
  };

  navToggle.addEventListener("click", () => {
    setNavOpen(!masthead.classList.contains("nav-open"));
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setNavOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (masthead.classList.contains("nav-open") && !masthead.contains(event.target)) {
      setNavOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });

  window.addEventListener("resize", queueNavSync);
  window.addEventListener("load", queueNavSync);
  if (document.fonts) {
    document.fonts.ready.then(queueNavSync);
  }

  syncNavMode();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  const delay = Math.min(index * 45, 360);
  element.style.setProperty("--reveal-delay", `${delay}ms`);
  observer.observe(element);
});
