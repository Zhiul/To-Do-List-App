import { isMobile } from './mobile';
import { acceptsInput, keyboardIsOnScreen } from './virtualKeyboard';

const body = document.querySelector('body');
const nav = document.querySelector('nav');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
const overlay2 = document.getElementById('overlay2');

function startNavAppearingAnimation() {
  nav.classList.add('appearing');
  setTimeout(() => {
    nav.classList.remove('appearing');
  }, 450);
}

function startBodyZoomInAnimation() {
  document.body.willChange = 'transform';
  document.body.classList.add('zoom-in');
  setTimeout(() => {
    document.body.classList.remove('zoom-in');
    document.body.willChange = null;
  }, 201);
}

function disappearNav() {
  nav.style.opacity = '0';
}

closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-modal-target]')) {
    const modal = document.querySelector(event.target.dataset.modalTarget);
    openModal(modal);
  }
});

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

overlay2.addEventListener('click', () => {
  const modal = document.querySelector('.modal.active');
  closeModal(modal);
});

function openModal(modal) {
  window.history.pushState({ id: 1 }, null, '?q=1234&u=beware');
  if (modal == null) return;
  modal.classList.remove('disabled');
  modal.classList.add('active');
  if (overlay.classList.contains('active')) {
    overlay2.classList.add('active');
  } else {
    overlay.classList.add('active');
    if (modal.classList.contains('no-zoom') && isMobile) disappearNav();
  }
  document.body.scrollTop = 0;
}

function closeModal(modal) {
  if (modal == null) return;

  function closeModal(delay) {
    delay ? (delay = 20) : (delay = 0);

    setTimeout(() => {
      modal.classList.remove('active');
      modal.classList.add('disabled');
      if (overlay2.classList.contains('active')) {
        overlay2.classList.remove('active');
      } else {
        overlay.classList.remove('active');
      }
      if (isMobile && !modal.classList.contains('no-zoom')) {
        startBodyZoomInAnimation();
      } else if (isMobile && modal.classList.contains('no-zoom')) {
        nav.style.opacity = 1;
        startNavAppearingAnimation();
      }
    }, delay);
  }

  modal.style.height = null;
  setTimeout(() => {
    modal.style.transition = '1ms ease-in-out';
    modal.style.height = `${modal.offsetHeight}px`;
    modal.style.height = null;
    setTimeout(() => {
      modal.style.transition = null;
    }, 8);
  }, 4);

  const allowDelay = false;

  if (acceptsInput(document.activeElement) && keyboardIsOnScreen && isMobile) {
    document.activeElement.blur();

    if ('virtualKeyboard' in navigator) {
      navigator.virtualKeyboard.addEventListener('geometrychange', closeModal, {
        once: true,
      });
    } else {
      window.addEventListener('resize', closeModal, { once: true });
    }
  } else {
    closeModal(true);
  }
}

export function closeModals() {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach((modal) => {
    closeModal(modal);
  });
}
