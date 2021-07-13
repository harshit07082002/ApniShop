import { signin, Logout } from './getToken';
const stripe = Stripe(
  'pk_test_51JCPtpSIbz25nq7sqfMMLWNCwThcbZM0VT1Ymd0yI1j7oe1pQGdihBMhiaxBLCN6P3Hk33XA7YjboCP2YESYDWSB00qLX0DerY'
);
const form = document.querySelector('.signinForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    signin(email, password);
  });
}

console.log('inside');
