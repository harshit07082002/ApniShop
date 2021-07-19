const order = document.querySelector('.your-order');
const security = document.querySelector('.securty');
const allOrders = document.querySelector('.allOrders');
const addProduct = document.querySelector('.addProduct');

if (order) {
  order.addEventListener('click', () => {
    window.location.href = '/orders';
  });
}

if (security) {
  security.addEventListener('click', () => {
    window.location.href = '/profile/security';
  });
}
if (allOrders) {
  allOrders.addEventListener('click', () => {
    window.location.href = '/profile/AllOrders';
  });
}
if (addProduct) {
  addProduct.addEventListener('click', () => {
    window.location.href = '/profile/addProduct';
  });
}
