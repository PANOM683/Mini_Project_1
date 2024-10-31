// create a closure that manages transaction and balance
const transactionManager = () => {
  let balance = 0;
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  // Load balance from local storage
  const storedBalance = localStorage.getItem("balance");
  if (storedBalance) {
    balance = parseFloat(storedBalance);
  }

  // add new transaction with date, type, category, and amount whether it's income or expense
  return {
    addTransaction: (date, type, category, amount) => {
      const transaction = {
        date,
        type,
        category,
        amount,
      };

      if (type === "Income") {
        balance += amount;
      } else if (type === "Expense") {
        balance -= amount;
      }
      transactions.push(transaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("balance", balance);
      updateBalanceDisplay();
    },

    // remove a transaction to the transaction array and update the balance
    removeTransaction: (index) => {
      transactions.splice(index, 1);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("balance", balance);
    },

    //returns the current balance
    getBalance: () => {
      return balance;
    },

    // returns the transaction array
    getTransactions: () => {
      return transactions;
    },

    // resets the balance to 0
    resetBalance: () => {
      balance = 0;
      localStorage.setItem("balance", 0);
    },
  };
};

// Function to update the balance display
function updateBalanceDisplay() {
  const balanceDisplay = document.getElementById("balance");
  balanceDisplay.textContent = `Balance: $${manager.getBalance().toFixed(2)}`;
}

// Function to reset the balance method on the manager object to reset the balance to 0 and updates the balance display using 'updateBalanceDisplay'.
function resetBalance() {
  manager.resetBalance();
  updateBalanceDisplay();
}

// Add event listener to the reset balance button to call the resetBalance function when clicked
const resetBalanceButton = document.querySelector(".reset-balance-button");
resetBalanceButton.addEventListener("click", resetBalance);

// Get the form and table elements
const transactionForm = document.getElementById("transactionForm");
const transactionTableBody = document.getElementById("transactionTableBody");
const balanceDisplay = document.getElementById("balance");

// Create a new transaction manager function and assigns it to the manager
const manager = transactionManager();
updateBalanceDisplay();

// Add an event listener to the form to handle the form submission
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const amount = Number.parseFloat(document.getElementById("amount").value);
  // Add the transaction
  const balance = manager.addTransaction(date, type, category, amount);
  // Update the table
  const transaction =
    manager.getTransactions()[manager.getTransactions().length - 1];
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${transaction.date}</td>
    <td>${transaction.type}</td>
    <td>${transaction.category}</td>
    <td>$${transaction.amount}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  transactionTableBody.appendChild(row);

  // Add event listener to delete button
  const deleteBtn = row.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    const index = manager.getTransactions().indexOf(transaction);
    manager.removeTransaction(index);
    row.remove();
  });

  // Update the balance display
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;

  // Clear the form fields
  document.getElementById("date").value = "";
  document.getElementById("type").value = "";
  document.getElementById("category").value = "";
  document.getElementById("amount").value = "";
});

// Load existing transactions from localStorage
const existingTransactions = manager.getTransactions();
existingTransactions.forEach((transaction, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${transaction.date}</td>
    <td>${transaction.type}</td>
    <td>${transaction.category}</td>
    <td>$${transaction.amount}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  transactionTableBody.appendChild(row);

  // Add event listener to delete button
  const deleteBtn = row.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    manager.removeTransaction(index);
    row.remove();
  });
});
