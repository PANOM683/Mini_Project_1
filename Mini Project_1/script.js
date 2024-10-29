// Get the form and table elements  
const transactionForm = document.getElementById('transactionForm');  
const transactionTableBody = document.getElementById('transactionTableBody');  
const balanceDisplay = document.getElementById('balance'); // Get the balance display element  
  
// Create a transaction manager  
const transactionManager = () => {  
  let balance = 0;  
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];  
  
    // Load balance from local storage  
    const storedBalance = localStorage.getItem('balance');  
    if (storedBalance) {  
     balance = parseFloat(storedBalance);  
    } 

  return {  
  addTransaction: (date, type, category, amount) => {  
  const transaction = {  
    date,  
    type,  
    category,  
    amount,
  };  
  
  if (type === 'Income') {  
    balance += amount;  
  } else if (type === 'Expense') {  
    balance -= amount;  
  }  
  
  transactions.push(transaction);  
  localStorage.setItem('transactions', JSON.stringify(transactions));  
  localStorage.setItem('balance', balance.toString()); // Store balance in local storage
  updateBalanceDisplay();  
  return balance;  
  },  
  
  removeTransaction: (index) => {  
  const transaction = transactions[index];  
  if (transaction.type === 'Income') {  
    balance += transaction.amount;  
  } else if (transaction.type === 'Expense') {  
    balance -= transaction.amount;  
  }  
  
  transactions.splice(index, 1);  
  localStorage.setItem('transactions', JSON.stringify(transactions));  
  //localStorage.setItem('balance', balance.toString()); // Store balance in local storage  
  return balance;  
  },  

  getBalance: () => {  
  return balance;  
  },  
  getTransactions: () => {  
  return transactions;  
  }  
  };  
};  
  
// Create a new transaction manager  
const manager = transactionManager();  
  
// Add an event listener to the form  
transactionForm.addEventListener('submit', (e) => {  
  e.preventDefault();  
  const date = document.getElementById('date').value;  
  const type = document.getElementById('type').value;  
  const category = document.getElementById('category').value;  
  const amount = Number.parseFloat(document.getElementById('amount').value);  
  
  // Validate date and amount  
 /* if (!isValidDate(date)) {  
  alert('Invalid date');  
  return;  
  }  
  if (isNaN(amount)) {  
  alert('Invalid amount');  
  return;  
  }  */
  
  // Add the transaction  
  const balance = manager.addTransaction(date, type, category, amount);  
  
  // Update the table  
  const transaction = manager.getTransactions()[manager.getTransactions().length - 1];  
  const row = document.createElement('tr');  
  row.innerHTML = `  
  <td>${transaction.date}</td>  
  <td>${transaction.type}</td>  
  <td>${transaction.category}</td>  
  <td>$${transaction.amount}</td>  
  <td><button class="delete-btn">Delete</button></td>  
  `;  
  transactionTableBody.appendChild(row);  
  
  // Add event listener to delete button  
  const deleteBtn = row.querySelector('.delete-btn');  
  deleteBtn.addEventListener('click', () => {  
  manager.removeTransaction(manager.getTransactions().indexOf(transaction));  
  row.remove();   
  });  
  
  // Update the balance display  
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;  
  
  // Clear the form fields  
  document.getElementById('date').value = '';  
  document.getElementById('type').value = '';  
  document.getElementById('category').value = '';  
  document.getElementById('amount').value = '';  
});  
  
// Load existing transactions from localStorage  
const existingTransactions = manager.getTransactions();  
existingTransactions.forEach((transaction, index) => {  
  const row = document.createElement('tr');  
  row.innerHTML = `  
  <td>${transaction.date}</td>  
  <td>${transaction.type}</td>  
  <td>${transaction.category}</td>  
  <td>${transaction.amount}</td>  
  <td><button class="delete-btn">Delete</button></td>  
  `;  
  transactionTableBody.appendChild(row);  
  
  // Add event listener to delete button  
  const deleteBtn = row.querySelector('.delete-btn');  
  deleteBtn.addEventListener('click', () => {  
  manager.removeTransaction(index);  
  row.remove();   
  updateBalanceDisplay(); 
  });  
});  
  
// Initialize the balance display  
function updateBalanceDisplay() {  
  const balance = manager.getBalance();  
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;  
}  
updateBalanceDisplay();  
  
// Helper function to validate date  
/*function isValidDate(date) {  
  const dateParts = date.split('-');  
  const year = parseInt(dateParts[0], 10);  
  const month = parseInt(dateParts[1], 10);  
  const day = parseInt(dateParts[2], 10);  
  const dateObject = new Date(year, month - 1, day);  
  return dateObject.getFullYear() === year && dateObject.getMonth() === month - 1 && dateObject.getDate() === day;  
} */



// Add event listener to reset balance button
const resetBalanceButton = document.querySelector('.reset-balance-button');
resetBalanceButton.addEventListener('click', () => {  
  resetBalance();
});

function resetBalance() {
  balance = 0.00;
  localStorage.setItem('balance', balance.toString());
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
}
