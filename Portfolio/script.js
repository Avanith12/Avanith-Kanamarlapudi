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

// Performance optimization: Individual scroll listeners are already optimized above

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

// ==================== DEVELOPER TOOLS EASTER EGGS ====================
console.log('%c👋 Hello there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #ff6b6b; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cWelcome to Avanith\'s Portfolio! 🚀', 'font-size: 16px; font-weight: bold; color: #4ecdc4; text-shadow: 0 0 10px #4ecdc4;');
console.log('%c', 'font-size: 1px;');
console.log('%c🎮 Developer Console Commands:', 'font-size: 14px; font-weight: bold; color: #ffd93d; text-shadow: 0 0 5px #ffd93d;');
console.log('%c• Type "help()" for available commands', 'font-size: 12px; color: #a8e6cf;');
console.log('%c• Type "about()" to learn more about me', 'font-size: 12px; color: #ffaaa5;');
console.log('%c• Type "projects()" to see my work', 'font-size: 12px; color: #a8e6cf;');
console.log('%c• Type "contact()" to get in touch', 'font-size: 12px; color: #ffaaa5;');
console.log('%c• Type "fun()" for some random facts', 'font-size: 12px; color: #a8e6cf;');
console.log('%c', 'font-size: 1px;');

// Fun developer console commands
window.help = function() {
  console.log('%c🛠️ Available Commands:', 'font-size: 16px; font-weight: bold; color: #ff6b6b; text-shadow: 0 0 8px #ff6b6b;');
  console.log('%cabout() - Learn about Avanith', 'font-size: 12px; color: #4ecdc4;');
  console.log('%cprojects() - View my projects', 'font-size: 12px; color: #ffd93d;');
  console.log('%ccontact() - Get contact info', 'font-size: 12px; color: #a8e6cf;');
  console.log('%cfun() - Random fun facts', 'font-size: 12px; color: #ffaaa5;');
  console.log('%cskills() - My technical skills', 'font-size: 12px; color: #4ecdc4;');
  console.log('%cresume() - Download my resume', 'font-size: 12px; color: #ffd93d;');
  console.log('%cpuppy() - Cute puppy faces! 🐕', 'font-size: 12px; color: #a8e6cf; font-weight: bold;');
  console.log('%csecret() - Hidden easter egg', 'font-size: 12px; color: #ff6b6b; font-weight: bold; text-shadow: 0 0 5px #ff6b6b;');
};

window.about = function() {
  console.log('%c👨‍💻 About Avanith Kanamarlapudi:', 'font-size: 16px; font-weight: bold; color: #4ecdc4; text-shadow: 0 0 10px #4ecdc4;');
  console.log('%c• AIML Research Fellow at UMass Boston', 'font-size: 12px; color: #ffd93d;');
  console.log('%c• Teaching Assistant for CS460: Computer Graphics', 'font-size: 12px; color: #a8e6cf;');
  console.log('%c• Machine Psychology Fellow working on medical AI', 'font-size: 12px; color: #ffaaa5;');
  console.log('%c• Co-founder of The AI Fantastic Team', 'font-size: 12px; color: #4ecdc4;');
  console.log('%c• Published researcher in IEEE conferences', 'font-size: 12px; color: #ffd93d;');
  console.log('%c• Passionate about AI, Web Graphics, and Medical Imaging', 'font-size: 12px; color: #a8e6cf;');
};

window.projects = function() {
  console.log('%c🚀 My Key Projects:', 'font-size: 16px; font-weight: bold; color: #ffd93d; text-shadow: 0 0 8px #ffd93d;');
  console.log('%c• Knowledge Distillation for Cybersecurity', 'font-size: 12px; color: #4ecdc4;');
  console.log('%c• Breast Cancer Detection using CNN & U-Net', 'font-size: 12px; color: #ffaaa5;');
  console.log('%c• Image Colorization using GANs', 'font-size: 12px; color: #a8e6cf;');
  console.log('%c• Social Media Data Analysis & Website', 'font-size: 12px; color: #4ecdc4;');
  console.log('%c• Interactive 3D Portfolio (this one!)', 'font-size: 12px; color: #ffd93d; font-weight: bold;');
  console.log('%c• Movie Verse Platform (Full-stack)', 'font-size: 12px; color: #ffaaa5;');
  console.log('%c• AI News Chatbot', 'font-size: 12px; color: #a8e6cf;');
};

window.contact = function() {
  console.log('%c📧 Get In Touch:', 'font-size: 16px; font-weight: bold; color: #00bfa6;');
  console.log('%c📧 Email: kanamarlapudi.avanith@gmail.com', 'font-size: 12px; color: #333;');
  console.log('%c💼 LinkedIn: https://linkedin.com/in/avanith-kanamarlapudi-8aa081204/', 'font-size: 12px; color: #333;');
  console.log('%c🐙 GitHub: https://github.com/Avanith12', 'font-size: 12px; color: #333;');
  console.log('%c📝 Medium: https://medium.com/@kanamarlapudi-avanith', 'font-size: 12px; color: #333;');
  console.log('%c', 'font-size: 1px;');
  console.log('%c💡 Pro tip: Click the contact form above for instant email!', 'font-size: 12px; color: #ff6b6b;');
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
  console.log('%cOr visit: files/Avanith_Kanamarlapudi_October_2025.pdf', 'font-size: 12px; color: #333;');
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

window.puppy = function() {
  console.log('%c🐕🐕🐕 PUPPY PARTY! 🐕🐕🐕', 'font-size: 16px; font-weight: bold; color: #ff6b6b; text-shadow: 0 0 10px #ff6b6b;');
  console.log('%c', 'font-size: 1px;');
  
  const puppyFaces = [
    '    /\\_/\\\n   (  o.o  )\n    > ^ <',
    '    /\\_/\\\n   (  ^.^  )\n    > ^ <',
    '    /\\_/\\\n   (  -.-  )\n    > ^ <',
    '    /\\_/\\\n   (  @.@  )\n    > ^ <',
    '    /\\_/\\\n   (  U.U  )\n    > ^ <'
  ];
  
  const colors = ['#ffd93d', '#4ecdc4', '#a8e6cf', '#ffaaa5', '#ff6b6b'];
  
  for (let i = 0; i < 3; i++) {
    const randomPuppy = puppyFaces[Math.floor(Math.random() * puppyFaces.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    console.log('%c' + randomPuppy, 'font-size: 12px; color: ' + randomColor + '; text-shadow: 0 0 5px ' + randomColor + ';');
    console.log('%c', 'font-size: 1px;');
  }
  
  console.log('%c🎾 Woof! Woof! Thanks for playing with me! 🎾', 'font-size: 12px; color: #4ecdc4; text-shadow: 0 0 5px #4ecdc4;');
  console.log('%c🐕 Did you know? Avanith loves dogs AND coding! 🐕', 'font-size: 12px; color: #ffd93d;');
  console.log('%c💡 Type "puppy()" again for more puppy faces! 💡', 'font-size: 12px; color: #ffaaa5;');
};

// ASCII Art for extra fun
console.log('%c', 'font-size: 1px;');
console.log('%c    ╔══════════════════════════════════════╗', 'font-size: 12px; color: #4ecdc4; text-shadow: 0 0 5px #4ecdc4;');
console.log('%c    ║  🚀 Welcome to Avanith\'s Portfolio! 🚀  ║', 'font-size: 12px; color: #ffd93d; text-shadow: 0 0 8px #ffd93d;');
console.log('%c    ║                                      ║', 'font-size: 12px; color: #4ecdc4; text-shadow: 0 0 5px #4ecdc4;');
console.log('%c    ║  Type "help()" to get started!      ║', 'font-size: 12px; color: #ffaaa5; text-shadow: 0 0 5px #ffaaa5;');
console.log('%c    ╚══════════════════════════════════════╝', 'font-size: 12px; color: #4ecdc4; text-shadow: 0 0 5px #4ecdc4;');
console.log('%c', 'font-size: 1px;');

// Cute ASCII Puppy! 🐕
console.log('%c', 'font-size: 1px;');
console.log('%c🐕 Woof! Hi there, developer! 🐕', 'font-size: 14px; font-weight: bold; color: #ff6b6b; text-shadow: 0 0 8px #ff6b6b;');
console.log('%c', 'font-size: 1px;');
console.log('%c    /\\_/\\', 'font-size: 12px; color: #ffd93d;');
console.log('%c   (  o.o  )', 'font-size: 12px; color: #ffd93d;');
console.log('%c    > ^ <', 'font-size: 12px; color: #ffd93d;');
console.log('%c', 'font-size: 1px;');
console.log('%c    /\\_/\\', 'font-size: 12px; color: #4ecdc4;');
console.log('%c   (  o.o  )', 'font-size: 12px; color: #4ecdc4;');
console.log('%c    > ^ <', 'font-size: 12px; color: #4ecdc4;');
console.log('%c', 'font-size: 1px;');
console.log('%c    /\\_/\\', 'font-size: 12px; color: #a8e6cf;');
console.log('%c   (  o.o  )', 'font-size: 12px; color: #a8e6cf;');
console.log('%c    > ^ <', 'font-size: 12px; color: #a8e6cf;');
console.log('%c', 'font-size: 1px;');
console.log('%c    /\\_/\\', 'font-size: 12px; color: #ffaaa5;');
console.log('%c   (  o.o  )', 'font-size: 12px; color: #ffaaa5;');
console.log('%c    > ^ <', 'font-size: 12px; color: #ffaaa5;');
console.log('%c', 'font-size: 1px;');
console.log('%c🎾 This puppy loves code! Type "puppy()" for more fun! 🎾', 'font-size: 12px; color: #4ecdc4; text-shadow: 0 0 5px #4ecdc4;');
console.log('%c', 'font-size: 1px;');
