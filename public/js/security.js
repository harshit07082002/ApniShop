import { changeDetails, changePasswordDetails } from './getToken';
const submit = document.querySelector('.submitChanges');
const submitPass = document.querySelector('.change-Password');

if (submit) {
  submit.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const address = document.querySelector('#address').value;
    const PinCode = document.querySelector('#PinCode').value;
    changeDetails(name, email, address, PinCode);
  });
}
if (submitPass) {
  submitPass.addEventListener('submit', (e) => {
    e.preventDefault();
    const current = document.querySelector('#current-password').value;
    const newpass = document.querySelector('#password').value;
    const confirmpass = document.querySelector('#confirm-password').value;
    console.log(current, newpass, confirmpass);
    changePasswordDetails(current, newpass, confirmpass);
  });
}
