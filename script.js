'use strict';

// Existing Revolut payment destination retained exactly as supplied in the original project.
const REVOLUT_CHECKOUT_URL = 'https://checkout.revolut.com/pay/34bd909a-12e7-49f8-a393-540bd03d9c2f';

const products = [
  { name: "Baldur's Gate 3", price: 54, img: 'IMG_9089.jpg', cat: 'spil' },
  { name: 'GTA V (PS5)', price: 40, img: 'IMG_9087.jpg', cat: 'spil' },
  { name: 'EA Sports FC 27', price: 67, img: 'IMG_9088.jpg', cat: 'spil' },
  { name: "Elden Ring Collector's", price: 87, img: 'IMG_9090.jpg', cat: 'spil' },
  { name: 'UFC 6', price: 60, img: 'IMG_9091.jpg', cat: 'spil' },
  { name: 'EA Sports FC 26', price: 60, img: 'IMG_9092.jpg', cat: 'spil' },
  { name: 'The Last of Us Part I', price: 47, img: 'IMG_9093.jpg', cat: 'spil' },
  { name: 'Uncharted Legacy of Thieves', price: 40, img: 'IMG_9094.jpg', cat: 'spil' },
  { name: 'Red Dead Redemption', price: 44, img: 'IMG_9095.jpg', cat: 'spil' },
  { name: '007 First Light', price: 67, img: 'IMG_9096.jpg', cat: 'spil' },
  { name: 'Mafia: The Old Country', price: 60, img: 'IMG_9097.jpg', cat: 'spil' },
  { name: 'Far Cry 6', price: 33, img: 'IMG_9098.jpg', cat: 'spil' },
  { name: 'Battlefield 6', price: 67, img: 'IMG_9099.jpg', cat: 'spil' },
  { name: 'God of War Ragnarök', price: 54, img: 'IMG_9100.jpg', cat: 'spil' },
  { name: 'PlayStation 5', price: 539, img: 'IMG_9116.jpg', cat: 'konsol' },
  { name: 'Xbox Series X', price: 579, img: 'IMG_9117.jpg', cat: 'konsol' },
  { name: 'Nintendo Switch OLED', price: 335, img: 'switch-oled.jpg', cat: 'konsol' },
  { name: 'DualSense Controller', price: 74, img: 'dualsense.jpg', cat: 'tilbehor' },
  { name: 'Xbox Wireless Controller', price: 67, img: 'xbox-controller.jpg', cat: 'tilbehor' },
  { name: 'Nintendo Switch Pro Controller', price: 80, img: 'switch-pro.jpg', cat: 'tilbehor' },
  { name: 'Gaming Headset', price: 54, img: 'headset.jpg', cat: 'tilbehor' },
  { name: 'Controller Charging Station', price: 35, img: 'charging-dock.jpg', cat: 'tilbehor' },
  { name: 'HDMI Cable 2m', price: 15, img: 'hdmi.jpg', cat: 'tilbehor' },
  { name: 'USB-C Charging Cable', price: 12, img: 'usbc.jpg', cat: 'tilbehor' },
  { name: 'Memory Card 1TB', price: 89, img: 'memory.jpg', cat: 'tilbehor' },
  { name: 'Gaming Mouse', price: 39, img: 'mouse.jpg', cat: 'tilbehor' }
];

const productNotes = {"Baldur's Gate 3": "Role-playing adventure. Confirm platform and edition before ordering.", "GTA V (PS5)": "Open-world action adventure for PlayStation 5.", "EA Sports FC 27": "Football game listing. Confirm release, platform and edition availability.", "Elden Ring Collector's": "Collector's edition listing. Confirm included items, platform and stock.", "UFC 6": "Mixed martial arts game listing. Confirm platform and release availability.", "EA Sports FC 26": "Football game listing. Confirm platform and edition.", "The Last of Us Part I": "Story-driven action adventure. Confirm platform and edition.", "Uncharted Legacy of Thieves": "Action-adventure collection. Confirm platform and edition.", "Red Dead Redemption": "Western action-adventure. Confirm platform and edition.", "007 First Light": "Upcoming spy-action game listing. Confirm release date and platform.", "Mafia: The Old Country": "Story-driven crime action game. Confirm platform and edition.", "Far Cry 6": "Open-world action game. Confirm platform and edition.", "Battlefield 6": "Military action game listing. Confirm platform, edition and availability.", "God of War Ragnarök": "Action-adventure game. Confirm platform and edition.", "PlayStation 5": "Console listing. Confirm exact model, storage, condition and included accessories.", "Xbox Series X": "Console listing. Confirm exact model, condition and included accessories.", "Nintendo Switch OLED": "Hybrid console listing. Confirm colour, condition and included accessories.", "DualSense Controller": "Wireless controller for compatible PlayStation 5 systems. Confirm colour and model.", "Xbox Wireless Controller": "Wireless controller listing. Confirm generation, colour and compatibility.", "Nintendo Switch Pro Controller": "Wireless controller for Nintendo Switch. Confirm model and condition.", "Gaming Headset": "Gaming headset listing. Confirm connection type and device compatibility.", "Controller Charging Station": "Charging accessory listing. Confirm controller compatibility.", "HDMI Cable 2m": "Two-metre HDMI cable. Check the HDMI specification required by your device.", "USB-C Charging Cable": "USB-C cable listing. Confirm charging and data requirements.", "Memory Card 1TB": "Storage product listing. Confirm device compatibility and exact specifications.", "Gaming Mouse": "Gaming mouse listing. Confirm connection type and technical specifications."};

const CART_STORAGE_KEY = 'gamenowgood_cart_v2';
let cart = loadCart();
let activeFilter = 'all';
const grid = document.getElementById('grid');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('search');
const suggestionsBox = document.getElementById('search-suggestions');

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.map(item => {
      const product = products.find(p => p.name === item?.name);
      return product && Number(item.qty) > 0 ? { name: product.name, price: product.price, qty: Math.min(99, Math.floor(Number(item.qty))), img: product.img } : null;
    }).filter(Boolean) : [];
  } catch (_) { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch (_) { /* storage may be disabled */ }
}
function money(value) { return `€${Number(value).toFixed(2).replace(/\.00$/, '')}`; }
function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function render() {
  const query = searchInput.value.trim().toLowerCase();
  const list = products.filter(product => (activeFilter === 'all' || product.cat === activeFilter) && product.name.toLowerCase().includes(query));
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = '<div class="empty-results">No products found. Try another search.</div>';
    return;
  }
  list.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<div class="product-image-wrap"><img src="${safeText(product.img)}" alt="${safeText(product.name)}" loading="lazy"><span class="product-category">${product.cat === 'spil' ? 'GAME' : product.cat === 'konsol' ? 'CONSOLE' : 'ACCESSORY'}</span></div><div class="product-info"><h3>${safeText(product.name)}</h3><p class="product-description">${safeText(productNotes[product.name] || 'Contact us to confirm product details and availability.')}</p><div class="product-bottom"><strong class="price">${money(product.price)}</strong><button class="add-button" type="button" aria-label="Add ${safeText(product.name)} to basket">＋</button></div><button class="buy-button" type="button">Add to basket</button><p class="stock-note">Availability confirmed on request</p></div>`;
    card.querySelector('.add-button').addEventListener('click', () => addDeal(product.name, product.price, 1, product.img));
    card.querySelector('.buy-button').addEventListener('click', () => addDeal(product.name, product.price, 1, product.img));
    grid.appendChild(card);
  });
}
function showSuggestions(query) {
  if (!query.trim()) { suggestionsBox.classList.remove('show'); suggestionsBox.innerHTML = ''; return; }
  const matches = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  suggestionsBox.innerHTML = matches.length ? matches.map(product => `<button class="suggestion-item" type="button" data-name="${safeText(product.name)}"><img src="${safeText(product.img)}" alt="" loading="lazy"><span>${safeText(product.name)}<small>${money(product.price)}</small></span></button>`).join('') : '<div class="suggestion-empty">No matching products</div>';
  suggestionsBox.classList.add('show');
  suggestionsBox.querySelectorAll('[data-name]').forEach(button => button.addEventListener('click', () => {
    searchInput.value = button.dataset.name;
    activeFilter = 'all';
    document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item.dataset.filter === 'all'));
    render(); suggestionsBox.classList.remove('show');
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  }));
}
searchInput.addEventListener('input', () => { render(); showSuggestions(searchInput.value); });
searchInput.addEventListener('focus', () => { if (searchInput.value) showSuggestions(searchInput.value); });
document.addEventListener('click', event => { if (!event.target.closest('.search-wrapper')) suggestionsBox.classList.remove('show'); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  render();
}));

function addDeal(name, price, qty = 1, img = '') {
  const amount = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty = Math.min(99, existing.qty + amount);
  else cart.push({ name, price: Number(price), qty: amount, img });
  updateCart(); openCart();
}
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  const itemsDiv = document.getElementById('cart-items');
  itemsDiv.innerHTML = cart.map((item, index) => `<div class="cart-item">${item.img ? `<img src="${safeText(item.img)}" alt="">` : ''}<div class="cart-item-name"><b>${safeText(item.name)}</b><small>${money(item.price)} each</small></div><div class="qty-control"><button type="button" aria-label="Decrease quantity" onclick="changeQty(${index},-1)">−</button><span>${item.qty}</span><button type="button" aria-label="Increase quantity" onclick="changeQty(${index},1)">＋</button></div><strong>${money(item.price * item.qty)}</strong></div>`).join('') || '<p class="empty-cart">Your basket is empty. Add a product to get started.</p>';
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cart-total').textContent = `Total: ${money(total)}`;
  document.getElementById('show-checkout').disabled = cart.length === 0;
  saveCart();
}
function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
  if (!cart.length) resetCheckout();
}
function resetCheckout() {
  document.getElementById('checkout-form').style.display = 'none';
  document.getElementById('show-checkout').style.display = 'block';
}
function openCart() { document.getElementById('cart-modal').style.display = 'flex'; document.body.classList.add('modal-open'); }
function closeCart() { document.getElementById('cart-modal').style.display = 'none'; document.body.classList.remove('modal-open'); }
function clearCart() { cart = []; updateCart(); resetCheckout(); }
function showCheckoutForm() {
  if (!cart.length) { alert('Your basket is empty.'); return; }
  document.getElementById('checkout-form').style.display = 'block';
  document.getElementById('show-checkout').style.display = 'none';
}
function confirmOrder() {
  const ids = ['fname', 'lname', 'email', 'address', 'city', 'postal', 'country'];
  const values = Object.fromEntries(ids.map(id => [id, document.getElementById(id).value.trim()]));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  if (ids.some(id => !values[id]) || !emailValid) {
    alert('Please complete all required fields and enter a valid email address.');
    const firstInvalid = ids.map(id => document.getElementById(id)).find(input => !input.value.trim() || (input.type === 'email' && !input.validity.valid));
    if (firstInvalid) firstInvalid.focus();
    return;
  }
  if (!cart.length) { alert('Your basket is empty.'); return; }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const order = {
    customer: { name: `${values.fname} ${values.lname}`, email: values.email, phone: document.getElementById('phone').value.trim(), address: `${values.address}, ${values.postal} ${values.city}, ${values.country}` },
    items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.qty })),
    total, currency: 'EUR', createdAt: new Date().toISOString()
  };
  try { localStorage.setItem('lastOrder', JSON.stringify(order)); } catch (_) { /* storage may be disabled */ }
  const subject = encodeURIComponent(`Game Good Now order enquiry - ${money(total)}`);
  const orderLines = order.items.map(item => `- ${item.name} x${item.quantity}: ${money(item.price * item.quantity)}`).join('\\n');
  const body = encodeURIComponent(`Hello Game Good Now,\\n\\nPlease confirm availability and delivery for this order:\\n\\n${orderLines}\\n\\nTotal: ${money(total)}\\n\\nName: ${order.customer.name}\\nEmail: ${order.customer.email}\\nPhone: ${order.customer.phone}\\nAddress: ${order.customer.address}\\n\\nPlease confirm stock, delivery cost and next steps before payment.`);
  alert('Your email app will open with your order enquiry. Send the email and wait for stock and delivery confirmation before making payment. This static website cannot automatically notify the store.');
  window.location.href = `mailto:support@game-good-now.com?subject=${subject}&body=${body}`;
  closeCart();
}

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lang-select').addEventListener('change', event => {
  if (event.target.value !== 'en') {
    alert('This language is not fully translated yet. The store is currently displayed in English.');
    event.target.value = 'en';
  }
});
document.getElementById('cart-modal').addEventListener('click', event => { if (event.target.id === 'cart-modal') closeCart(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
render();
updateCart();
