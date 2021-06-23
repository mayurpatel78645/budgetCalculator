class IdGenerator {
  constructor() {
    this.id = 0;
  }
}

const idGenerator = new IdGenerator();

class Transaction {
  constructor(amount, description) {
    this.amount = amount;
    this.description = description;
    this.id = idGenerator.id++;
    let dateString = new Date().toLocaleDateString('default', {month:'short', day:'numeric', year:'numeric'});
    this.date = `${dateString.slice(0,3)}. ${dateString.slice(4)}`
  }
}

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
  }

  addTransaction(amount, description) {
    amount >= 0 ? this.incomeList.push(new Transaction(amount, description)) : this.expenseList.push(new Transaction(amount, description));
    this.render();
  }

  removeTransaction(id) {
    const transactionToRemove = this.findTransaction(id);
    if (transactionToRemove === undefined) return console.log(`Transaction not found`);
    if (transactionToRemove.amount >= 0) {
      this.incomeList.splice(this.incomeList.findIndex(transaction => transaction.id === id), 1);
      return this.render();
    }
    this.expenseList.splice(this.expenseList.findIndex(transaction => transaction.id === id), 1);
    this.render();
  }

  findTransaction(id) {
    return this.incomeList.concat(this.expenseList).find(transaction => transaction.id === id);
  }

  render() {
    this.renderExpenses();
    this.renderIncome();
    this.renderTopIncome();
    this.renderTopExpense();
    this.renderBudget();
  }

  renderExpenses() {
    const expensesList = document.querySelector('.expenses__list');
    expensesList.innerHTML = "";
    this.expenseList.forEach(transaction => {
      expensesList.insertAdjacentHTML('beforeend', this.expensesHTML(transaction));
    });
  }

  renderIncome() {
    const incomeList = document.querySelector('.income__list');
    incomeList.textContent = "";
    this.incomeList.forEach(transaction => {
      incomeList.insertAdjacentHTML('beforeend', this.incomeHTML(transaction));
    });
  }

  renderBudget() {
    const budgetValue = document.querySelector('.budget__value');
    const budgetTitleMonth = document.querySelector('.budget__title--month');
    budgetTitleMonth.innerHTML = new Date().toLocaleDateString('default', {month: 'long', year: 'numeric'});
    let difference = this.totalIncome() - Math.abs(this.totalExpense());
    budgetValue.innerHTML = `${Math.sign(difference) === -1 ? '-' : '+'} $${Math.abs(difference).toFixed(2)}`;
  }

  renderTopIncome() {
    const topIncome = document.querySelector('.budget__income--value');
    topIncome.innerHTML = `+ $${parseFloat(this.totalIncome()).toFixed(2)}`;
  }

  renderTopExpense() {
    let topExpensePercent = document.querySelector('.budget__expenses--percentage');
    const topExpense = document.querySelector('.budget__expenses--value');
    topExpense.innerHTML = `- $${parseFloat(this.totalExpense()).toFixed(2)}`;
    let expensePercentCalc = ((this.totalExpense() / this.totalIncome()) * 100).toFixed(0);
    topExpensePercent.innerHTML = `${isFinite(expensePercentCalc) ? expensePercentCalc : this.totalExpense()}%`
  }

  totalExpense() {
    let total = 0;
    for (let transaction of this.expenseList) {
      total += transaction.amount;
    }
    return Math.abs(total);
  }

  totalIncome() {
    let total = 0;
    for (let transaction of this.incomeList) {
      total += transaction.amount;
    }
    return total;
  }

  incomeHTML(transaction) {
    return `
    <div class="item" data-transaction-id="${transaction.id}">
        <div class="item__description">${transaction.description}</div>            
        <div class="right">
          <div class="item__value">+ $${transaction.amount.toFixed(2)}</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
        <div class="item__date">${transaction.date}</div>
    `;
  }

  expensesHTML(transaction) {
    let expensePercentCalc = ((transaction.amount/this.totalIncome())*100).toFixed(0);
    return `
    <div class="item" data-transaction-id="${transaction.id}">
        <div class="item__description">${transaction.description}</div>
        <div class="right">
          <div class="item__value">- $${Math.abs(transaction.amount).toFixed(2)}</div>
          <div class="item__percentage">${isFinite(expensePercentCalc) ? expensePercentCalc : this.totalExpense()}%</div>
          <div class="item__delete">
            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
          </div>
        </div>
        <div class="item__date">${transaction.date}</div>
    `;
  }
}

const transactionList = new TransactionList();
