const card = document.querySelector('.cards');
const card2 = document.querySelector('.shoesCards');
if (card) {
  card.addEventListener('click', (e) => {
    console.log(e.target);
    if (e.target.closest('.card').dataset.id) {
      console.log('clicked');
      window.location.href = `/item/${e.target.closest('.card').dataset.id}`;
    }
  });
}

if (card2) {
  card2.addEventListener('click', (e) => {
    console.log(e.target);
    if (e.target.closest('.card').dataset.id) {
      console.log('clicked');
      window.location.href = `/item/${e.target.closest('.card').dataset.id}`;
    }
  });
}
