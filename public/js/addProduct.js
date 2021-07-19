import { addProduct } from './getToken';

const form = document.querySelector('.add');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    addProduct(
      document.querySelector('#name').value,
      document.querySelector('#price').value,
      document.querySelector('#type').value,
      document.querySelector('#warranty').value,
      document.querySelector('#features').value,
      document.querySelector('#about').value
    );
  });
}
