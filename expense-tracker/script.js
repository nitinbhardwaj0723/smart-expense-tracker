const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionForm = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const transactionList = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Format Date
function getCurrentDate() {
  const date = new Date();
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter valid details");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    date: getCurrentDate()
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = "";
  amount.value = "";
}

// Show Transactions
function addTransactionDOM(transaction) {
  const li = document.createElement("li");
  li.classList.add(transaction.amount < 0 ? "minus" : "plus");

  li.innerHTML = `
    <div class="transaction-info">
      <span>${transaction.text}</span>
      <span>${transaction.date}</span>
    </div>

    <div class="amount-box">
      <span>${transaction.amount < 0 ? "-" : "+"}₹${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">✕</button>
    </div>
  `;

  transactionList.appendChild(li);
}

// Update Balance
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const incomeAmount = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  const expenseAmount = (
    amounts
      .filter(item => item < 0)
      .reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `₹${total}`;
  income.innerText = `₹${incomeAmount}`;
  expense.innerText = `₹${expenseAmount}`;
}

// Remove Transaction
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Local Storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init App
function init() {
  transactionList.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
transactionForm.addEventListener("submit", addTransaction);