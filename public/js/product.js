import { addToCart1 } from './getToken';

const stripe = Stripe(
  'pk_test_51JCPtpSIbz25nq7sqfMMLWNCwThcbZM0VT1Ymd0yI1j7oe1pQGdihBMhiaxBLCN6P3Hk33XA7YjboCP2YESYDWSB00qLX0DerY'
);
const allReviews = document.querySelector('#allReviews');
const addReview = document.querySelector('#writeReview');

if (allReviews) {
  allReviews.addEventListener('click', () => {
    window.location.href = `/reviews/${allReviews.dataset.id}`;
  });
}
if (addReview) {
  addReview.addEventListener('click', () => {
    window.location.href = `/addReview/${addReview.dataset.id}`;
  });
}

const addToCart = document.querySelector('.cart1');
const qty = document.querySelector('#qty');

if (addToCart) {
  addToCart.addEventListener('click', () => {
    const items = qty.value;
    const id = addToCart.dataset.id;
    addToCart1(items, id);
  });
}
