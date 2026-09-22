const form = document.querySelector('#transaction-form');
const descriptionInput = document.querySelector('#description');
const amountInput = document.querySelector('#amount');
const typeInput = document.querySelector('#type');
const list = document.querySelector('#transaction-list');
const emptyState = document.querySelector('#empty-state');
const balanceEl = document.querySelector('#balance');
const incomeEl = document.querySelector('#income');
const expenseEl = document.querySelector('#expense');
const clearButton = document.querySelector('#clear-all');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function save() { localStorage.setItem('transactions', JSON.stringify(transactions)); }

function render() {
  const income = transactions.filter(t => t.type === 'income').reduce((total, t) => total + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((total, t) => total + t.amount, 0);
  balanceEl.textContent = money(income - expense);
  incomeEl.textContent = money(income);
  expenseEl.textContent = money(expense);
  list.innerHTML = '';
  emptyState.hidden = transactions.length > 0;
  clearButton.hidden = transactions.length === 0;

  transactions.forEach(transaction => {
    const sign = transaction.type === 'income' ? '+' : '-';
    const item = document.createElement('li');
    item.className = 'transaction';
    item.innerHTML = `<div class="transaction-info"><span class="dot ${transaction.type}"></span><span class="description"></span></div><div><span class="value ${transaction.type}">${sign} ${money(transaction.amount)}</span> <button class="delete" aria-label="Excluir ${transaction.description}">×</button></div>`;
    item.querySelector('.description').textContent = transaction.description;
    item.querySelector('.delete').addEventListener('click', () => {
      transactions = transactions.filter(t => t.id !== transaction.id);
      save(); render();
    });
    list.appendChild(item);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const amount = Number(amountInput.value);
  if (!descriptionInput.value.trim() || amount <= 0) return;
  transactions.unshift({ id: crypto.randomUUID(), description: descriptionInput.value.trim(), amount, type: typeInput.value });
  save(); form.reset(); render(); descriptionInput.focus();
});

clearButton.addEventListener('click', () => {
  if (confirm('Deseja apagar todas as movimentações?')) { transactions = []; save(); render(); }
});

render();
