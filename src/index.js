import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import refs from './js/refs/refs.js';
import Response from './js/responseClass/response.js';
import marcupCardsImages from './js/marcup/marcup.js';
import getColor from './js/hover-card/hover.js';

const response = new Response();
let isSubmit = false;
let isResponse = true;
let totalHits = 0;

const marcupCards = async () => {
  if (!isResponse) return;
  try {
    const requestResponse = await response.getResponse();
    checks(requestResponse);
    simpleLightbox();
    infinitiObserver();
    getColor();
  } catch {
    console.error(error);
  }
};

const reset = () => {
  response.page = 1;
  refs.gallery.innerHTML = '';
  totalHits = 0;
  isSubmit = true;
  isResponse = true;
  refs.galleryLinkEnd.classList.add('visually-hidden');
  refs.preloader.style.display = 'block';
};

const handleSubmitForm = e => {
  e.preventDefault();
  reset();

  const { searchQuery } = e.target;
  if (searchQuery.value === '') {
    return Notify.warning('The input field must not be empty! Try again');
  }

  response.searchName = searchQuery.value;

  marcupCards();

  e.target.reset();
};

refs.searchForm.addEventListener('submit', handleSubmitForm);

const infinitiObserver = () => {
  const options = {
    rootMargin: '-50px',
    threshold: [0, 0.25, 0.5, 0.75, 1.0],
  };
  const callback = function ([entry], observer) {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      isSubmit = false;

      refs.preloader.classList.remove('visually-hidden');

      const setTimeoutId = setTimeout(() => {
        refs.preloader.classList.add('visually-hidden');
        marcupCards();
        clearTimeout(setTimeoutId);
      }, 1000);
    }
  };
  const observer = new IntersectionObserver(callback, options);
  const lastCard = document.querySelector('.photo-card:last-child');

  if (lastCard) {
    observer.observe(lastCard);
  }
};

const checks = obj => {
  const { hits } = obj.data;
  totalHits += hits.length;

  if (totalHits >= obj.data.totalHits) {
    refs.preloader.style.display = 'none';
    refs.galleryLinkEnd.classList.remove('visually-hidden');
    isResponse = false;
  }

  if (hits.length === 0) {
    if (!isSubmit) return;
    refs.galleryLinkEnd.classList.add('visually-hidden');
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }

  if (hits.length !== 0 && isSubmit) Notify.info(`Hooray! We found ${obj.data.totalHits} images.`);

  hits.map(marcupCardsImages);
};

const simpleLightbox = () => {
  const instance = new SimpleLightbox('.gallery .gallery__link', {
    showCounter: false,
    captions: true,
    captionDelay: 250,
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionPosition: 'bottom',
  });

  if (!isSubmit) {
    instance.refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight,
      behavior: 'smooth',
    });
  }
};