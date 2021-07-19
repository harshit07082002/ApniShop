import { changeDetails, changePasswordDetails } from './getToken';
const submit = document.querySelector('.submitChanges');
const submitPass = document.querySelector('.change-Password');

if (submit) {
  submit.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(document.getElementById('photo').files[0]);
    const form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('address', document.querySelector('#address').value);
    form.append('pincode', document.querySelector('#PinCode').value);
    if (document.getElementById('photo').files[0])
      form.append('photo', document.getElementById('photo').files[0]);
    changeDetails(form);
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
