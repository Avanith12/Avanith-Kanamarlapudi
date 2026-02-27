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
function initSmoothScroll() {
  document.querySelectorAll(".nav-links a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: "smooth",
          });
        }
        
        // Close mobile menu if open
        const navLinks = document.getElementById('nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
          const hamburger = document.querySelector('.hamburger');
          if (hamburger) {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
          }
          navLinks.classList.remove('active');
          const navOverlay = document.querySelector('.nav-overlay');
          if (navOverlay) {
            navOverlay.classList.remove('active');
          }
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// Initialize smooth scroll when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
  initSmoothScroll();
}

// ==================== MOBILE NAVIGATION ====================
function initMobileNavigation() {
  'use strict';

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.getElementById('nav-links');
  const body = document.body;
  let navOverlay = document.querySelector('.nav-overlay');
  
  if (!hamburger || !navLinks) {
    return;
  }

  var navLinksParent = navLinks.parentNode;
  
  // Create overlay if it doesn't exist
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  let menuJustOpened = false;
  
  function openMenu() {
    menuJustOpened = true;
    setTimeout(function() { menuJustOpened = false; }, 350);
    body.classList.add('mobile-menu-open');
    if (navLinks && navLinksParent) {
      document.body.appendChild(navLinks);
      navLinks.classList.add('active');
      navLinks.style.setProperty('display', 'flex', 'important');
      navLinks.style.setProperty('visibility', 'visible', 'important');
      navLinks.style.setProperty('opacity', '1', 'important');
      navLinks.style.setProperty('right', '0', 'important');
      navLinks.style.setProperty('transform', 'translateX(0)', 'important');
      navLinks.style.setProperty('z-index', '1003', 'important');
    }
    if (hamburger) {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    if (navOverlay) {
      navOverlay.classList.add('active');
      navOverlay.style.setProperty('display', 'block', 'important');
      navOverlay.style.setProperty('opacity', '1', 'important');
      navOverlay.style.setProperty('visibility', 'visible', 'important');
      navOverlay.style.setProperty('z-index', '1002', 'important');
    }
    body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    body.classList.remove('mobile-menu-open');
    if (navLinks && navLinksParent) {
      navLinks.classList.remove('active');
      navLinks.style.removeProperty('right');
      navLinks.style.removeProperty('display');
      navLinks.style.removeProperty('transform');
      navLinksParent.appendChild(navLinks);
    }
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    if (navOverlay) {
      navOverlay.classList.remove('active');
      navOverlay.style.removeProperty('display');
      navOverlay.style.removeProperty('opacity');
    }
    body.style.overflow = '';
  }
  
  function toggleMenu() {
    if (navLinks && navLinks.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  
  // Hamburger button click - use a flag to prevent double-firing
  if (hamburger) {
    let touchHandled = false;

    hamburger.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      touchHandled = true;
      toggleMenu();
    }, { passive: false });

    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (touchHandled) {
        touchHandled = false;
        return;
      }
      toggleMenu();
    });
  }
  
  // Close menu when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', function() {
      if (menuJustOpened) return;
      closeMenu();
    });
    navOverlay.addEventListener('touchend', function(e) {
      e.preventDefault();
      if (menuJustOpened) return;
      closeMenu();
    });
  }
  
  // Close menu when clicking a nav link
  if (navLinks) {
    navLinks.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        setTimeout(closeMenu, 300);
      }
    });
    
    // Touch support for nav links
    navLinks.addEventListener('touchend', function(e) {
      if (e.target.tagName === 'A') {
        setTimeout(closeMenu, 300);
      }
    });
  }
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });
  
  // Close menu on window resize (if resizing to desktop)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });
}

// Initialize mobile navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileNavigation);
} else {
  // DOM is already loaded
  initMobileNavigation();
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
let slideInterval = null;

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
  if (slides.length === 0) return;
  
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
  
  // Update dots
  const dots = document.querySelectorAll('.dot');
  if (dots.length > 0) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}

function nextSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
  resetSlideInterval();
}

function resetSlideInterval() {
  if (slideInterval !== null) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
  if (slides.length > 0) {
    slideInterval = setInterval(nextSlide, 7000);
  }
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

  // Check for saved theme preference - default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = getCurrentTheme();
    const nextTheme = getNextTheme(currentTheme);
    applyTheme(nextTheme);
  });
}

function getCurrentTheme() {
  if (document.body.classList.contains('monochrome-theme')) {
    return 'monochrome';
  } else if (document.body.classList.contains('light-theme')) {
    return 'light';
  }
  return 'dark';
}

function getNextTheme(currentTheme) {
  const themes = ['dark', 'light', 'monochrome'];
  const currentIndex = themes.indexOf(currentTheme);
  return themes[(currentIndex + 1) % themes.length];
}

function applyTheme(theme) {
  // Remove all theme classes
  document.body.classList.remove('light-theme', 'monochrome-theme');
  
  // Hide/show Three.js canvas based on theme
  const bgCanvas = document.getElementById('bg-canvas');
  
  if (theme === 'monochrome') {
    document.body.classList.add('monochrome-theme');
    toggleBtn.innerHTML = '<i class="fas fa-palette"></i> Dark Mode';
    if (bgCanvas) bgCanvas.style.display = 'none';
  } else if (theme === 'light') {
    document.body.classList.add('light-theme');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Monochrome';
    if (bgCanvas) bgCanvas.style.display = 'block';
  } else {
    // dark theme
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    if (bgCanvas) bgCanvas.style.display = 'block';
  }
  
  localStorage.setItem('theme', theme);
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
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        if (window.pageYOffset > 500) {
          scrollToTopBtn.classList.add('visible');
        } else {
          scrollToTopBtn.classList.remove('visible');
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

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

let navHighlightTicking = false;
window.addEventListener('scroll', () => {
  if (!navHighlightTicking) {
    window.requestAnimationFrame(() => {
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
      
      navHighlightTicking = false;
    });
    navHighlightTicking = true;
  }
}, { passive: true });

// ==================== CONTACT FORM HANDLING ====================
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form elements with error checking
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    if (!nameInput || !emailInput || !subjectInput || !messageInput) {
      return;
    }
    
    // Get form data
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim()
    };
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    
    // Create mailto link
    const mailtoLink = `mailto:kanamarlapudi.avanith@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    const submitBtn = contactForm.querySelector('.submit-btn');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitBtn.style.background = '#4caf50';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        contactForm.reset();
      }, 3000);
    } else {
      contactForm.reset();
    }
  });
}

// Initialize contact form when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

// ==================== NAVBAR BACKGROUND ON SCROLL ====================
const navbar = document.querySelector('.navbar');

if (navbar) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 100) {
          navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
          navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ==================== PERFORMANCE OPTIMIZATIONS ====================
// Lazy load images - Native lazy loading is handled by the browser via the loading="lazy" attribute
// No need to manually trigger - browser handles it automatically
if (!('loading' in HTMLImageElement.prototype)) {
  // Fallback for browsers that don't support native lazy loading
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

// Performance optimization: Individual scroll listeners are already optimized above

// ==================== CLEANUP ON PAGE UNLOAD ====================
window.addEventListener('beforeunload', () => {
  // Clear intervals
  if (slideInterval !== null) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
  
  // Clean up Three.js background
  if (window.interactiveThreeJSBackground) {
    window.interactiveThreeJSBackground.destroy();
  }
});

// Also cleanup on page visibility change (when tab is hidden)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause slider when tab is hidden
    if (slideInterval !== null) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  } else {
    // Resume slider when tab is visible
    if (slides.length > 0 && slideInterval === null) {
      slideInterval = setInterval(nextSlide, 7000);
    }
  }
});

// ==================== DEVELOPER TOOLS EASTER EGGS ====================
// Console logs removed for production performance
// Developer commands still available via window functions

// Professional developer console commands
window.help = function() {
  console.log('%c╔══════════════════════════════════════════════════════════════╗', 'font-size: 12px; color: #0092A2; text-shadow: 0 0 8px #0092A2;');
  console.log('%c║                    🛠️  Available Commands  🛠️               ║', 'font-size: 14px; font-weight: bold; color: #0092A2; text-shadow: 0 0 10px #0092A2;');
  console.log('%c║                                                              ║', 'font-size: 12px; color: #0092A2;');
  console.log('%c║  about()     - Learn about Avanith\'s background            ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  projects()  - View portfolio projects                     ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  contact()   - Get contact information                     ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  skills()    - Technical skills and expertise            ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  resume()    - Download resume                            ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  fun()       - Interesting facts about Avanith           ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c╚══════════════════════════════════════════════════════════════╝', 'font-size: 12px; color: #0092A2; text-shadow: 0 0 8px #0092A2;');
};

window.about = function() {
  console.log('%c╔══════════════════════════════════════════════════════════════╗', 'font-size: 12px; color: #0092A2; text-shadow: 0 0 8px #0092A2;');
  console.log('%c║                👨‍💻 About Avanith Kanamarlapudi                ║', 'font-size: 14px; font-weight: bold; color: #0092A2; text-shadow: 0 0 10px #0092A2;');
  console.log('%c║                                                              ║', 'font-size: 12px; color: #0092A2;');
  console.log('%c║  • AIML Research Fellow at UMass Boston                     ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Teaching Assistant for CS460: Computer Graphics          ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Machine Psychology Fellow working on medical AI          ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Co-founder of The AI Fantastic Team                      ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Published researcher in IEEE conferences                 ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Passionate about AI, Web Graphics, and Medical Imaging   ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c╚══════════════════════════════════════════════════════════════╝', 'font-size: 12px; color: #0092A2; text-shadow: 0 0 8px #0092A2;');
};

window.projects = function() {
  console.log('%c╔══════════════════════════════════════════════════════════════╗', 'font-size: 12px; color: #0092A2; text-shadow: 0 0 8px #0092A2;');
  console.log('%c║                      🚀 Key Projects 🚀                     ║', 'font-size: 14px; font-weight: bold; color: #0092A2; text-shadow: 0 0 10px #0092A2;');
  console.log('%c║                                                              ║', 'font-size: 12px; color: #0092A2;');
  console.log('%c║  • Knowledge Distillation for Cybersecurity                 ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Breast Cancer Detection using CNN & U-Net               ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Image Colorization using GANs                           ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Social Media Data Analysis & Website                    ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • Interactive 3D Portfolio (this one!)                    ║', 'font-size: 11px; color: #ffffff; font-weight: bold;');
  console.log('%c║  • Movie Verse Platform (Full-stack)                        ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  • AI News Chatbot                                         ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c╚══════════════════════════════════════════════════════════════╝', 'font-size: 12px; color: #0092A2; text-shadow: 0 0 8px #0092A2;');
};

window.contact = function() {
  console.log('%c╔══════════════════════════════════════════════════════════════╗', 'font-size: 12px; color: #0092A2; text-shadow: 0 0 8px #0092A2;');
  console.log('%c║                      📧 Get In Touch 📧                     ║', 'font-size: 14px; font-weight: bold; color: #0092A2; text-shadow: 0 0 10px #0092A2;');
  console.log('%c║                                                              ║', 'font-size: 12px; color: #0092A2;');
  console.log('%c║  📧 Email: kanamarlapudi.avanith@gmail.com                  ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  💼 LinkedIn: linkedin.com/in/avanith-kanamarlapudi-8aa081204/ ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  🐙 GitHub: github.com/Avanith12                            ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║  📝 Medium: medium.com/@kanamarlapudi-avanith              ║', 'font-size: 11px; color: #b0b0b0;');
  console.log('%c║                                                              ║', 'font-size: 12px; color: #0092A2;');
  console.log('%c║  💡 Pro tip: Click the contact form above for instant email! ║', 'font-size: 11px; color: #ffffff; font-weight: bold;');
  console.log('%c╚══════════════════════════════════════════════════════════════╝', 'font-size: 12px; color: #0092A2; text-shadow: 0 0 8px #0092A2;');
};

window.fun = function() {
  const facts = [
    "I can solve a Rubik's cube in under 2 minutes! 🧩",
    "I once built a website in 3 hours using only ChatGPT and VS Code! ⚡",
    "My favorite programming language is Python, but I love JavaScript for web magic! 🐍✨",
    "I've completed 6+ internships and built 10+ projects! 🚀",
    "I'm currently pursuing MS in Computer Science with a 3.9+ GPA! 📚",
    "I love teaching and have delivered workshops on web development! 👨‍🏫",
    "I'm fascinated by the intersection of AI and medical imaging! 🏥🤖",
    "I can speak 3 languages: English, Telugu, and Hindi! 🗣️",
    "My dream is to make AI accessible to everyone! 🌟",
    "I believe in the power of community and knowledge sharing! 🤝"
  ];
  
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  console.log('%c🎲 Random Fun Fact:', 'font-size: 16px; font-weight: bold; color: #00bfa6;');
  console.log(`%c${randomFact}`, 'font-size: 14px; color: #333;');
  console.log('%c', 'font-size: 1px;');
  console.log('%cRun fun() again for another random fact!', 'font-size: 12px; color: #666;');
};

window.skills = function() {
  console.log('%c🛠️ My Technical Arsenal:', 'font-size: 16px; font-weight: bold; color: #00bfa6;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c🤖 AI & Machine Learning:', 'font-size: 14px; font-weight: bold; color: #017481;');
  console.log('%cPython, TensorFlow, PyTorch, Keras, Scikit-learn, OpenCV', 'font-size: 12px; color: #333;');
  console.log('%cCNNs, GANs, U-Net, DenseNet, Transfer Learning, Knowledge Distillation', 'font-size: 12px; color: #333;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c🌐 Web Graphics & 3D:', 'font-size: 14px; font-weight: bold; color: #017481;');
  console.log('%cWebGL, WebGPU, Three.js, XTK, Computer Graphics, 3D Visualization', 'font-size: 12px; color: #333;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c🏥 Medical AI:', 'font-size: 14px; font-weight: bold; color: #017481;');
  console.log('%cMedical Imaging, DICOM Processing, DeepSight, Breast Cancer Detection', 'font-size: 12px; color: #333;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c💻 Web Development:', 'font-size: 14px; font-weight: bold; color: #017481;');
  console.log('%cHTML/CSS, JavaScript, Bootstrap, Responsive Design, API Integration', 'font-size: 12px; color: #333;');
};

window.resume = function() {
  console.log('%c📄 Resume Download:', 'font-size: 16px; font-weight: bold; color: #00bfa6;');
  console.log('%cClick the "Resume" button in the navigation to download my PDF!', 'font-size: 12px; color: #333;');
  console.log('%cOr visit: files/Avanith_Kanamarlapudi_February_2026.pdf', 'font-size: 12px; color: #333;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c💡 Pro tip: The resume button is in the top navigation!', 'font-size: 12px; color: #ff6b6b;');
};

window.secret = function() {
  console.log('%c🎉 SECRET EASTER EGG UNLOCKED!', 'font-size: 18px; font-weight: bold; color: #ff6b6b; text-shadow: 0 0 15px #ff6b6b, 0 0 30px #ff6b6b; animation: rainbow 2s infinite;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c🎮 You found the hidden command!', 'font-size: 14px; color: #4ecdc4; text-shadow: 0 0 8px #4ecdc4;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c🌟 Here\'s a secret: This portfolio was built with love, Three.js, and lots of coffee! ☕', 'font-size: 12px; color: #ffd93d;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c🚀 Want to collaborate? I\'m always open to exciting projects!', 'font-size: 12px; color: #a8e6cf;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c💡 Type "contact()" to get in touch!', 'font-size: 12px; color: #ffaaa5;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c🎨 Thanks for exploring my code! You\'re awesome! ✨', 'font-size: 12px; color: #4ecdc4; text-shadow: 0 0 5px #4ecdc4;');
};


