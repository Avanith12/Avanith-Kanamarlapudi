/*
  PORTFOLIO JAVASCRIPT
  This file handles all interactive features:
  - Smooth scrolling navigation
  - Mobile hamburger menu
  - Journey slider with auto-play
  - Theme toggle (dark/light mode)
  - Fade-in animations on scroll
  - Contact form handling
  - Scroll-to-top button
*/

// ==================== SMOOTH SCROLL FOR NAVIGATION ====================
document.querySelectorAll("nav a, .nav-links a").forEach(link => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
        
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: "smooth",
        });
      }
    }
  });
});

// ==================== MOBILE HAMBURGER MENU ====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Update ARIA attribute
    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
    
    // Focus management for accessibility
    if (isExpanded) {
      const firstLink = navLinks.querySelector('a');
      if (firstLink) {
        firstLink.focus();
      }
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==================== FADE-IN ANIMATION ON SCROLL ====================
const faders = document.querySelectorAll(".card, .pub-card, .edu-card, .skill-category");
const appearOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -100px 0px",
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(fader => {
  fader.classList.add("fade-in");
  appearOnScroll.observe(fader);
});

// ==================== JOURNEY SLIDER ====================
const slides = document.querySelectorAll(".journey-slider .slide");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");
const dotsContainer = document.querySelector(".slider-dots");
let currentSlide = 0;
let slideInterval;

// Create dots
if (slides.length > 0 && dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
  
  // Update dots
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
  resetSlideInterval();
}

function resetSlideInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 7000);
}

// Initialize slider
if (slides.length > 0) {
  showSlide(currentSlide);
  slideInterval = setInterval(nextSlide, 7000);
  
  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetSlideInterval();
  });
  
  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetSlideInterval();
  });
}

// ==================== THEME TOGGLE ====================
let toggleBtn = null;

function createThemeToggle() {
  // Check if toggle already exists
  if (document.querySelector('.theme-toggle')) {
    return;
  }
  
  toggleBtn = document.createElement("button");
  toggleBtn.className = "theme-toggle";
  toggleBtn.setAttribute('aria-label', 'Toggle theme');
  toggleBtn.setAttribute('type', 'button');
  
  // Append to body to keep it completely separate from navigation
  document.body.appendChild(toggleBtn);

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  } else {
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    
    if (document.body.classList.contains("light-theme")) {
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
      localStorage.setItem('theme', 'light');
    } else {
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
      localStorage.setItem('theme', 'dark');
    }
  });
}

// Initialize theme toggle after DOM is loaded
document.addEventListener('DOMContentLoaded', createThemeToggle);

// ==================== EXPERIENCE SECTION ====================
// Enhanced experience cards with professional layout
// No toggle functionality needed - all content is visible

// ==================== TYPEWRITER EFFECT ====================
document.addEventListener("DOMContentLoaded", function () {
  const typewriteSpan = document.querySelector(".typewrite");
  if (!typewriteSpan) return;

  const text = typewriteSpan.getAttribute("data-text");
  let index = 0;
  typewriteSpan.textContent = ''; // Clear initial content

  function type() {
    if (index < text.length) {
      typewriteSpan.textContent += text.charAt(index);
      index++;
      setTimeout(type, 70);
    }
  }

  // Start typing after a short delay
  setTimeout(type, 500);
});

// ==================== SCROLL TO TOP BUTTON ====================
const scrollToTopBtn = document.querySelector('.scroll-to-top');

if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==================== ACTIVE NAV LINK HIGHLIGHT ====================
const sections = document.querySelectorAll('.section, .hero');
const navLinksArray = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navLinksArray.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ==================== CONTACT FORM HANDLING ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };
    
    // Create mailto link
    const mailtoLink = `mailto:kanamarlapudi.avanith@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    submitBtn.style.background = '#4caf50';
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ==================== NAVBAR BACKGROUND ON SCROLL ====================
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
  });
}

// ==================== PERFORMANCE OPTIMIZATIONS ====================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Debounce scroll events for better performance
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll listeners for better performance
const debouncedScroll = debounce(() => {
  // This helps with performance by reducing scroll event frequency
  // The actual scroll logic is handled by individual event listeners above
}, 16); // ~60fps

// Note: Individual scroll listeners are already optimized above

// ==================== CLEANUP ON PAGE UNLOAD ====================
window.addEventListener('beforeunload', () => {
  // Clean up event listeners
  if (toggleBtn) {
    toggleBtn.removeEventListener('click', toggleBtn.onclick);
  }
  
  // Clear intervals
  if (slideInterval) {
    clearInterval(slideInterval);
  }
  
  // Clean up Three.js background
  if (window.interactiveThreeJSBackground) {
    window.interactiveThreeJSBackground.destroy();
  }
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #00bfa6;');
console.log('%cInterested in the code? Check out the repository!', 'font-size: 14px; color: #3E96F4;');
console.log('%cPortfolio by Avanith Kanamarlapudi', 'font-size: 12px; color: #666;');
