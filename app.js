let items = JSON.parse(localStorage.getItem('items')) || [];

function addItem() {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name.trim() === '') {
      alert('Please fill in the name of the existing item before adding a new one.');
      return; // Exit the function
    }
  }

  // If no existing item's name is empty, add a new item
  items.push({ name: '', quantity: 0, unit: '' });
  renderItems();
}

function removeItem(index) {
  items.splice(index, 1);
  renderItems();
}

function saveItems() {
  console.log(items)
  localStorage.setItem('items', JSON.stringify(items));
  renderItems();
  showNotification();
}

function filterItems() {
  const filteredItems = items.filter(item =>
    item.quantity === 0 || item.quantity === undefined || item.quantity === ''
  );
  renderItems(filteredItems);
}

function handleInputChange(index, field, event) {
  if (field === 'quantity') {
    items[index][field] = parseInt(event.target.value, 10) || 0;
  } else {
    items[index][field] = event.target.value;
  }
}

function searchItems() {
  const query = document.getElementById('search').value.toLowerCase();
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(query)
  );
  renderItems(filteredItems);
}

function clearSearch() {
  document.getElementById('search').value = '';
  renderItems();
}

function downloadItems() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "items.json");
  dlAnchorElem.click();
}

function uploadItems() {
  const uploadInput = document.getElementById('upload');
  const file = uploadInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      items = JSON.parse(e.target.result);
      renderItems();
    }
    reader.readAsText(file);
  }
}

function showNotification() {
  const notification = document.getElementById('notification');
  notification.classList.add('show');
  setTimeout(function() {
    notification.classList.remove('show');
  }, 2000);
}

function renderItems(itemsToRender = items) {
  const itemsDiv = document.getElementById('items');
  itemsDiv.innerHTML = '';

  itemsToRender.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    const nameInput = document.createElement('input');
    nameInput.value = item.name;
    nameInput.oninput = event => handleInputChange(index, 'name', event);
    itemDiv.appendChild(nameInput);

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = 0;
    quantityInput.value = item.quantity;
    quantityInput.oninput = event => handleInputChange(index, 'quantity', event);
    itemDiv.appendChild(quantityInput);

    const unitSelect = document.createElement('select');
    unitSelect.onchange = event => handleInputChange(index, 'unit', event);
    ['gm', 'kg', 'ml', 'l'].forEach(unit => {
      const option = document.createElement('option');
      option.value = unit;
      option.text = unit;
      if (unit === item.unit) {
        option.selected = true;
      }
      unitSelect.appendChild(option);
    });
    itemDiv.appendChild(unitSelect);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => removeItem(index);
    itemDiv.appendChild(removeButton);

    itemsDiv.appendChild(itemDiv);
  });
}

renderItems();
