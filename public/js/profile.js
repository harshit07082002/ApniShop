const order = document.querySelector('.your-order');
const security = document.querySelector('.securty');
const allOrders = document.querySelector('.allOrders');

if (order) {
  order.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:8000/orders';
  });
}

if (security) {
  security.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:8000/profile/security';
  });
}
if (allOrders) {
  allOrders.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:8000/profile/AllOrders';
  });
}
