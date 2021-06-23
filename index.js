const addDescription = document.querySelector('.add__description');
const addValue = document.querySelector('.add__value');

document.addEventListener('click', handleEvent);

function handleEvent(e) {
  const eventTarget = e.target;
  if (eventTarget.className === 'ion-ios-checkmark-outline' && addValue.value && addDescription.value) {
    transactionList.addTransaction(parseFloat(addValue.value), addDescription.value);
    addValue.value = "";
    addDescription.value = "";
  }
  if (eventTarget.className === 'ion-ios-close-outline') {
    transactionList.removeTransaction(parseInt(eventTarget.closest('.item').dataset.transactionId));
  }
}
