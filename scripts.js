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

// Lock vertical scroll while moving horizontally through the photo track.
const photographySection = document.getElementById('photography');
const photoTrack = document.getElementById('photoGalleryTrack');
const videoShell = document.querySelector('.photography-video-shell');
let photoOffset = 0;
let photoMaxShift = 0;

function updateVideoShellVisibility() {
  if (!videoShell) {
    return;
  }

  const shouldShowVideo = photoMaxShift > 0 && photoOffset >= photoMaxShift - 1;
  videoShell.classList.toggle('is-visible', shouldShowVideo);
}

function recalcPhotoBounds() {
  if (!photographySection || !photoTrack) {
    return;
  }

  photoMaxShift = Math.max(photoTrack.scrollWidth - photoTrack.clientWidth, 0);
  photoOffset = Math.min(photoOffset, photoMaxShift);
  photoTrack.style.transform = `translate3d(${-photoOffset}px, 0, 0)`;
  updateVideoShellVisibility();
}

function handlePhotoWheel(event) {
  if (!photographySection || !photoTrack) {
    return;
  }

  const sectionRect = photographySection.getBoundingClientRect();
  const sectionPinned = sectionRect.top <= 0 && sectionRect.bottom >= window.innerHeight;

  if (!sectionPinned || photoMaxShift <= 0) {
    return;
  }

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  const movingForward = delta > 0;
  const movingBackward = delta < 0;
  const atStart = photoOffset <= 0;
  const atEnd = photoOffset >= photoMaxShift;

  const shouldLockToHorizontal = (movingForward && !atEnd) || (movingBackward && !atStart);

  if (shouldLockToHorizontal) {
    event.preventDefault();
    photoOffset = Math.min(Math.max(photoOffset + delta * 1.1, 0), photoMaxShift);
    photoTrack.style.transform = `translate3d(${-photoOffset}px, 0, 0)`;
    updateVideoShellVisibility();
  }
}

if (photographySection && photoTrack) {
  recalcPhotoBounds();
  window.addEventListener('resize', recalcPhotoBounds);
  window.addEventListener('wheel', handlePhotoWheel, { passive: false });
  updateVideoShellVisibility();
}
