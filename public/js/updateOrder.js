import { updateStatus } from './getToken';
const approve = document.querySelector('.approve');

if (approve) {
  approve.addEventListener('click', () => {
    console.log('clicked');
    updateStatus(approve.dataset.id);
  });
}
