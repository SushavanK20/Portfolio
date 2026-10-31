// ---------- Mobile menu ----------
const nav = document.getElementById("nav");
const toggle = document.getElementById("nav-toggle");
const toggleIcon = toggle.querySelector(".material-symbols-outlined");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  toggleIcon.textContent = open ? "close" : "menu";
}
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll(".nav__link").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ---------- App bar elevation on scroll ----------
const bar = document.getElementById("app-bar");
const onScroll = () => bar.classList.toggle("app-bar--scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Active nav link ----------
const links = [...document.querySelectorAll(".nav__link")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));

// ---------- Ripple effect ----------
document.querySelectorAll(".ripple").forEach((el) => {
  el.addEventListener("pointerdown", (e) => {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const wave = document.createElement("span");
    wave.className = "ripple-wave";
    wave.style.width = wave.style.height = size + "px";
    wave.style.left = e.clientX - rect.left - size / 2 + "px";
    wave.style.top = e.clientY - rect.top - size / 2 + "px";
    el.appendChild(wave);
    wave.addEventListener("animationend", () => wave.remove());
  });
});

// ---------- Hero pipeline: runs once on load ----------
(function runPipeline() {
  const stages = [...document.querySelectorAll("#pipeline .stage")];
  const log = document.getElementById("pipeline-log");
  const messages = [
    "plan: 12 resources to add, 0 to destroy",
    "build: image pushed to registry",
    "test: all checks passed",
    "scan: no critical findings",
    "deploy: terraform apply complete",
    "monitor: dashboards healthy, alerts quiet",
  ];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    stages.forEach((s) => s.classList.add("is-done"));
    log.textContent = messages[messages.length - 1];
    return;
  }
  let i = 0;
  function step() {
    if (i > 0) stages[i - 1].classList.replace("is-running", "is-done");
    if (i === stages.length) return;
    stages[i].classList.add("is-running");
    log.textContent = messages[i];
    i++;
    setTimeout(step, 750);
  }
  setTimeout(step, 500);
  setTimeout(() => stages[stages.length - 1].classList.add("is-done"), 500 + 750 * stages.length);
})();

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
