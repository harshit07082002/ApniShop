const stripe = Stripe(
  'pk_test_51JCPtpSIbz25nq7sqfMMLWNCwThcbZM0VT1Ymd0yI1j7oe1pQGdihBMhiaxBLCN6P3Hk33XA7YjboCP2YESYDWSB00qLX0DerY'
);
const container = document.querySelector('.elements');
if (container) {
  container.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
      window.location.href = `http://127.0.0.1:8000/item/${e.target.dataset.id}`;
    } else if (e.target.closest('.price').dataset.id) {
      window.location.href = `http://127.0.0.1:8000/item/${
        e.target.closest('.price').dataset.id
      }`;
    }
  });
}
