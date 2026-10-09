const btn = document.getElementById('btn');
const message = document.getElementById('message');
const countEl = document.getElementById('count');

let count = 0;

btn.addEventListener('click', () => {
  count++;
  countEl.textContent = count;
  message.textContent = 'JavaScript is working!';
});
