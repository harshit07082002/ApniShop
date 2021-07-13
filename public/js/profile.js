const order = document.querySelector('.your-order');
const security = document.querySelector('.securty');
const allOrders = document.querySelector('.allOrders');

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
