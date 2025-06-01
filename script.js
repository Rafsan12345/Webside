// Global cart object using sessionStorage to persist across pages
let cart = JSON.parse(sessionStorage.getItem('cart')) || {};

const prices = {
  'T001 - tech': 700, 'T002 - tech': 900, 'T003 - tech': 900,
  'T004 - tech': 900, 'T005 - tech': 900,
  'F001 - F': 300, 'F002 - F': 500, 'F003 - F': 300, 'F004 - F': 500, 'F005 - F': 500,
  'H001 - H': 700, 'H002 - H': 200, 'H003 - H': 700, 'H004 - H': 200, 'H005 - H': 200,
  'C001 - C': 400, 'C002 - C': 400, 'C003 - C': 400, 'C004 - C': 400, 'C005 - C': 400,
};

const productDetails = {
  'T001 - tech': 'Smartwatch with heart rate monitor.',
  'T002 - tech': 'Smartwatch with GPS.',
  'T003 - tech': 'Smartwatch with Bluetooth.',
  'T004 - tech': 'Smartwatch with AMOLED screen.',
  'T005 - tech': 'Smartwatch with fitness tracking.',
  // Add more descriptions as needed
};

// Update product prices on page load
document.addEventListener('DOMContentLoaded', () => {
  for (const id in prices) {
    const el = document.getElementById(id);
    if (el) el.innerText = prices[id] + '৳';
  }

  updateCartDisplay();
  const cartPopup = document.getElementById('cart-popup');
  if (cartPopup) cartPopup.style.display = 'none';
});

function addToCart(id) {
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { name: id, qty: 1, price: prices[id] || 0 };
  }
  saveCart();
  updateCartDisplay();
}

function removeFromCart(id) {
  if (cart[id]) {
    cart[id].qty--;
    if (cart[id].qty <= 0) delete cart[id];
  }
  saveCart();
  updateCartDisplay();
}

function deleteItem(id) {
  delete cart[id];
  saveCart();
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cart-items');
  const subtotalSpan = document.getElementById('subtotal');
  const totalSpan = document.getElementById('total');
  const cartCount = document.getElementById('cart-count');

  if (!cartItemsDiv || !subtotalSpan || !totalSpan || !cartCount) return;

  cartItemsDiv.innerHTML = '';
  let subtotal = 0;

  for (const key in cart) {
    const item = cart[key];
    const itemTotal = item.qty * item.price;
    subtotal += itemTotal;

    const div = document.createElement('div');
    div.innerHTML = `
      ${item.name} - Qty: ${item.qty}
      <button onclick="addToCart('${item.name}')">+</button>
      <button onclick="removeFromCart('${item.name}')">-</button>
      <button onclick="deleteItem('${item.name}')">🗑️</button>
      <br><small>${item.qty} × ${item.price} BDT = ${itemTotal} BDT</small><hr>
    `;
    cartItemsDiv.appendChild(div);
  }

  subtotalSpan.innerText = subtotal + ' BDT';
  totalSpan.innerText = subtotal + ' BDT';
  cartCount.textContent = Object.keys(cart).length;
}

function toggleCart() {
  const popup = document.getElementById('cart-popup');
  if (popup) {
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  }
}

function showDetails(id) {
  const content = productDetails[id] || 'No details available.';
  document.getElementById('details-content').innerText = content;
  document.getElementById('details-popup').style.display = 'block';
}

function closeDetails() {
  document.getElementById('details-popup').style.display = 'none';
}

function placeOrder() {
  if (Object.keys(cart).length === 0) {
    alert('Your cart is empty!');
    return;
  }
  submitForm();
  alert('Order placed!');
  cart = {};
  saveCart();
  updateCartDisplay();
}

function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function submitForm() {
  const name = document.getElementById('customerName').value;
  const address = document.getElementById('customerAddress').value;
  const phone = document.getElementById('customerPhone').value;

  const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeKe-nodiw1qbUoV5SQ76-U16ZwktlGlBC9z1IJ8hobqltM0g/formResponse';
  const formData = new FormData();

  let cartSummary = '';
  let subtotal = 0;
  for (const id in cart) {
    const item = cart[id];
    const total = item.qty * item.price;
    subtotal += total;
    cartSummary += `${item.name} - Qty: ${item.qty} × ${item.price} = ${total} BDT\n`;
  }
  cartSummary += `\nSubtotal: ${subtotal} BDT`;

  formData.append('entry.114250250', cartSummary);
  formData.append('entry.516785708', name);
  formData.append('entry.1685221504', address);
  formData.append('entry.1759499733', phone);

  fetch(formURL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  }).then(() => {
    document.getElementById('customerName').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerPhone').value = '';
  });
}

function openTestPage1() {
  window.location.href = 'tech/index.html';
}


function openTestPage2() {
  window.location.href = 'food/index.html';
}


function openTestPage3() {
  window.location.href = 'health/index.html';
}

function openTestPage4() {
  window.location.href = 'cloth/index.html';
}