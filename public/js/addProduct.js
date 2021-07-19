import { addProduct } from './getToken';

const form = document.querySelector('.add');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    const featuresArray = document.querySelector('#features').value.split('\n');
    console.log(featuresArray);
    form.append('name', document.querySelector('#name').value);
    form.append('price', document.querySelector('#price').value);
    form.append('productType', document.querySelector('#type').value);
    form.append('warranty', document.querySelector('#warranty').value);
    form.append('features', featuresArray);
    form.append('photo', document.getElementById('photo').files[0]);
    form.append('about', document.querySelector('#about').value);
    addProduct(form);
  });
}
