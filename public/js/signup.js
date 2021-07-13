import { signup } from './getToken';
const stripe = Stripe(
  'pk_test_51JCPtpSIbz25nq7sqfMMLWNCwThcbZM0VT1Ymd0yI1j7oe1pQGdihBMhiaxBLCN6P3Hk33XA7YjboCP2YESYDWSB00qLX0DerY'
);
const form = document.querySelector('.signupForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const address = document.querySelector('#address').value;
    const PinCode = document.querySelector('#PinCode').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;

    signup(name, email, address, PinCode, password, confirmPassword);
  });
}
