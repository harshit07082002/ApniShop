import { signin, Logout } from './getToken';

const search = document.querySelector('.form a');
const inputSearch = document.querySelector('#search');
if (search) {
  search.addEventListener('click', () => {
    if (inputSearch.value !== '') {
      const item = inputSearch.value.split(' ').join('-');
      window.location.href = `http://127.0.0.1:8000/product/${item}`;
    }
  });
  document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 && inputSearch.value !== '') {
      const item = inputSearch.value.split(' ').join('-');
      window.location.href = `http://127.0.0.1:8000/product/${item}`;
    }
  });
}

const logout = document.querySelector('.logoutt');
if (logout) {
  logout.addEventListener('click', () => {
    Logout();
  });
}

const cart = document.querySelector('.cart');
if (cart) {
  cart.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:8000/cart';
  });
}

const orders = document.querySelector('.orders');
if (orders) {
  orders.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:8000/orders';
  });
}
