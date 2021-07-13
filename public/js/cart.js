import { updateQTY } from './getToken';
import { deleteItem } from './getToken';
import { checkout } from './getToken';

const del = document.querySelector('.items-cart');
if (del) {
  console.log('clicked');
  del.addEventListener('click', (e) => {
    if (e.target.matches('.delete')) {
      const id = e.target.dataset.id;
      deleteItem(id);
    } else if (e.target.matches('.img')) {
      console.log('inside');
      window.location.href = `/item/${e.target.dataset.id}`;
    }
  });

  del.addEventListener('change', (e) => {
    if (e.target.matches('#qty')) {
      const newQTY = e.target.value;
      updateQTY(newQTY, e.target.dataset.id);
    }
  });
}

const buy = document.querySelector('.buy');
if (buy) {
  buy.addEventListener('click', (e) => {
    checkout(buy.dataset.id);
  });
}
