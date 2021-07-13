const stripe = Stripe(
  'pk_test_51JCPtpSIbz25nq7sqfMMLWNCwThcbZM0VT1Ymd0yI1j7oe1pQGdihBMhiaxBLCN6P3Hk33XA7YjboCP2YESYDWSB00qLX0DerY'
);
const form = document.querySelector('.create-review');
import { addReview } from './getToken';

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    addReview(
      document.querySelector('#review').value,
      document.querySelector('#rating').value,
      document.querySelector('#review').dataset.id
    );
  });
}
