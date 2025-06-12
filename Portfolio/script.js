// Smooth Scroll for Navigation Links
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    if (this.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 40,
          behavior: "smooth",
        });
      }
    }
  });
});

// Fade-in on Scroll
const faders = document.querySelectorAll(".card, .logos img, .pub-img, .edu-card");
const appearOptions = {
  threshold: 0.3,
  rootMargin: "0px 0px -50px 0px",
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  fader.classList.add("fade-in");
  appearOnScroll.observe(fader);
});

// Auto Slideshow for "My Journey"
const slides = document.querySelectorAll(".journey-slider .slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

if (slides.length > 0) {
  showSlide(currentSlide);
  setInterval(nextSlide, 6000); // every 6 seconds
}

// Light/Dark Theme Toggle
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "Toggle Theme";
toggleBtn.className = "theme-toggle";
document.body.appendChild(toggleBtn);

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  toggleBtn.textContent = document.body.classList.contains("light-theme")
    ? "Dark Mode"
    : "Light Mode";
});

// Experience logo click toggle
document.querySelectorAll('.logo-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.logo-card').forEach(c => {
      if (c !== card) c.classList.remove('show-desc');
    });
    card.classList.toggle('show-desc');
  });
});
// Toggle description inside logo cards
function toggleDesc(card) {
  // Close others
  document.querySelectorAll(".logo-card").forEach(c => {
    if (c !== card) c.classList.remove("active");
  });

  // Toggle clicked one
  card.classList.toggle("active");
}
document.addEventListener("DOMContentLoaded", function () {
  const typewriteSpan = document.querySelector(".typewrite");
  if (!typewriteSpan) return;

  const text = typewriteSpan.getAttribute("data-text");
  let index = 0;

  function type() {
    if (index < text.length) {
      typewriteSpan.textContent += text.charAt(index);
      index++;
      setTimeout(type, 70); // typing speed
    }
  }

  type();
});
// Flash Effect on Page Load
window.addEventListener("load", () => {
  document.body.classList.add("light-theme"); // Start in light mode
  setTimeout(() => {
    document.body.classList.remove("light-theme"); // Switch back to dark mode
  }, 2200); // Flash duration (500ms = half a second)
});
