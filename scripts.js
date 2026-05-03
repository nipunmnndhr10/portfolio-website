// Simple smooth scroll on nav click

// for every nav item add a click event listener, read data-section attr, find the matching section id, scroll to it
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const sectionId = item.getAttribute('data-section');
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// store all nav items and sections
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');


window.addEventListener('scroll', () => { // runs every time the user scrolls

  // to check which section is currently in the center of the viewport (screen)
  // how far the page is scrolled + half the viewport height (to get the center point of the screen)
  const scrollY = window.scrollY + window.innerHeight / 2; // center of viewport

  sections.forEach(section => {
    const sectionTop = section.offsetTop;  // where section starts
    const sectionBottom = sectionTop + section.offsetHeight; // where section ends

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      const currentId = section.getAttribute('id'); // get the id of the section currently in view

      // add 'active' class to the nav item whose data-section matches the current section in view, remove from others
      navItems.forEach(item => {
        if (item.dataset.section === currentId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });
});

// ── Auto-scrolling photo gallery (no scroll-lock) ──────────────────
const photoTrack = document.getElementById('photoGalleryTrack');
const videoShell = document.querySelector('.photography-video-shell');

// Make the video shell always visible
if (videoShell) {
  videoShell.classList.add('is-visible');
}

if (photoTrack) {
  // Duplicate all panels so the track can loop seamlessly
  const originalPanels = Array.from(photoTrack.children);
  originalPanels.forEach(panel => {
    const clone = panel.cloneNode(true);
    photoTrack.appendChild(clone);
  });

  // Width of the original (non-cloned) content
  let singleSetWidth = 0;
  function measureSet() {
    singleSetWidth = 0;
    const gap = parseFloat(getComputedStyle(photoTrack).gap) || 0;
    originalPanels.forEach((p, i) => {
      singleSetWidth += p.offsetWidth + (i < originalPanels.length - 1 ? gap : 0);
    });
    // add one gap for spacing between original last and cloned first
    singleSetWidth += gap;
  }
  measureSet();
  window.addEventListener('resize', measureSet);

  let offset = 0;
  let paused = false;
  const speed = 0.6; // px per frame

  function autoScroll() {
    if (!paused) {
      offset += speed;
      // Reset seamlessly when the first set has fully scrolled away
      if (offset >= singleSetWidth) {
        offset -= singleSetWidth;
      }
      photoTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);

  // Pause on hover over any photo panel (including clones)
  photoTrack.addEventListener('mouseenter', () => { paused = true; });
  photoTrack.addEventListener('mouseleave', () => { paused = false; });
}

// Typing Effect
const texts = [
  "Visual Storytelling",
  "Editing & Post-Production",
  "Web & Software Development",
  "AI & Machine Learning"
];

let count = 0;
let index = 0;
let currentText = '';
let letter = '';

const typingElement = document.getElementById('typing');

function type() {
  if (count === texts.length) count = 0;

  currentText = texts[count];
  letter = currentText.slice(0, ++index);

  typingElement.textContent = letter;

  if (letter.length === currentText.length) {
    setTimeout(() => {
      count++;
      index = 0;
      setTimeout(type, 1500); // pause before next phrase
    }, 2000);
  } else {
    setTimeout(type, 60); // typing speed
  }
}

// Start typing effect
window.onload = () => {
  setTimeout(type, 800);
};

// ── Scroll Reveal Animation ─────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
  threshold: 0.1, // Trigger when 10% of the element is visible
  rootMargin: "0px 0px -30px 0px" // Trigger slightly before the bottom of the viewport
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Stop observing once revealed
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealOnScroll.observe(el);
});