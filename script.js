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
