import { updateStatus } from './getToken';
const approve = document.querySelector('.items-cart');

if (approve) {
  approve.addEventListener('click', (e) => {
    if (e.target.matches('.approve')) updateStatus(e.target.dataset.id);
  });
}
