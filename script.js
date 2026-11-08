'use strict';

// Existing Revolut payment destination retained exactly as supplied.
const REVOLUT_CHECKOUT_URL = 'https://checkout.revolut.com/pay/34bd909a-12e7-49f8-a393-540bd03d9c2f';

// Configure these values in EmailJS before enabling order emails.
const EMAILJS_PUBLIC_KEY = 'ADD_EMAILJS_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'ADD_EMAILJS_SERVICE_ID';
const EMAILJS_STORE_TEMPLATE_ID = 'ADD_STORE_TEMPLATE_ID';
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'ADD_CUSTOMER_TEMPLATE_ID';

// Game catalogue is PS5-only. Xbox and Nintendo consoles/accessories remain available.
const products = [
  { name: "Baldur's Gate 3 (PS5)", price: 54, img: 'IMG_9089.webp', cat: 'spil', description: 'A story-rich role-playing adventure built for PlayStation 5.' },
  { name: 'GTA V (PS5)', price: 24.99, img: 'IMG_9087.webp', cat: 'spil', description: 'Explore Los Santos in the enhanced PlayStation 5 edition.' },
  { name: 'EA Sports FC 27 (PS5)', price: 67, img: 'IMG_9088.webp', cat: 'spil', description: 'Football action for PlayStation 5. Confirm edition and availability before ordering.' },
  { name: "Elden Ring Collector's Edition (PS5)", price: 87, img: 'IMG_9090.webp', cat: 'spil', description: 'Explore a vast fantasy world in this action role-playing adventure.' },
  { name: 'UFC 6 (PS5)', price: 60, img: 'IMG_9091.webp', cat: 'spil', description: 'Mixed martial arts action for PlayStation 5.' },
  { name: 'EA Sports FC 26 (PS5)', price: 60, img: 'IMG_9092.webp', cat: 'spil', description: 'The football experience for PlayStation 5.' },
  { name: 'The Last of Us Part I (PS5)', price: 47, img: 'IMG_9093.webp', cat: 'spil', description: 'Experience the acclaimed story rebuilt for PlayStation 5.' },
  { name: "Uncharted: Legacy of Thieves Collection (PS5)", price: 40, img: 'IMG_9094.webp', cat: 'spil', description: 'Two cinematic action-adventure journeys in one collection.' },
  { name: 'Red Dead Redemption (PS5 compatible)', price: 44, img: 'IMG_9095.webp', cat: 'spil', description: 'A classic western adventure. Confirm the exact edition and PS5 compatibility before ordering.' },
  { name: '007 First Light (PS5)', price: 67, img: 'IMG_9096.webp', cat: 'spil', description: 'A James Bond action-adventure title listed for PlayStation 5.' },
  { name: 'Mafia: The Old Country (PS5)', price: 60, img: 'IMG_9097.webp', cat: 'spil', description: 'A cinematic crime story set in the origins of the Mafia.' },
  { name: 'Far Cry 6 (PS5)', price: 33, img: 'IMG_9098.webp', cat: 'spil', description: 'Fight your way across the island of Yara.' },
  { name: 'Battlefield 6 (PS5)', price: 67, img: 'IMG_9099.webp', cat: 'spil', description: 'Large-scale first-person action for PlayStation 5.' },
  { name: 'God of War Ragnarök (PS5)', price: 54, img: 'IMG_9100.webp', cat: 'spil', description: 'Continue the journey of Kratos and Atreus across the Norse realms.' },
  { name: 'PlayStation 5 Console', price: 539, img: 'IMG_9116.webp', cat: 'konsol', description: 'PlayStation 5 console listing. Confirm model, condition and included accessories before ordering.' },
  { name: 'Xbox Series X', price: 579, img: 'IMG_9117.webp', cat: 'konsol', description: 'Xbox Series X console listing. Confirm model, condition and included accessories before ordering.' },
  { name: 'Nintendo Switch OLED', price: 335, img: 'switch-oled.webp', cat: 'konsol', description: 'Nintendo Switch OLED console listing. Confirm model, condition and included accessories before ordering.' },
  { name: 'DualSense Wireless Controller', price: 74, img: 'dualsense.webp', cat: 'tilbehor', description: 'The official wireless controller designed for PlayStation 5.' },
  { name: 'Xbox Wireless Controller', price: 67, img: 'xbox-controller.webp', cat: 'tilbehor', description: 'Wireless controller accessory for compatible Xbox consoles. Confirm compatibility before ordering.' },
  { name: 'Nintendo Switch Pro Controller', price: 80, img: 'switch-pro.webp', cat: 'tilbehor', description: 'Controller accessory for Nintendo Switch. Confirm compatibility before ordering.' },
  { name: 'Controller Charging Station', price: 35, img: 'charging-dock.webp', cat: 'tilbehor', description: 'Charging station listing. Confirm controller compatibility before ordering.' },
  { name: 'Gaming Mouse', price: 39, img: 'mouse.webp', cat: 'tilbehor', description: 'Gaming mouse accessory. Check connection and device compatibility before ordering.' },
  { name: 'Memory Card 1TB', price: 89, img: 'memory.webp', cat: 'tilbehor', description: 'Storage accessory listing. Confirm device compatibility and exact capacity before ordering.' },
  { name: 'Gaming Headset — PS5 compatible', price: 54, img: 'headset.webp', cat: 'tilbehor', description: 'Gaming headset listing. Confirm connection type and compatibility before ordering.' },
  { name: 'HDMI Cable 2m — PS5 compatible', price: 15, img: 'hdmi.webp', cat: 'tilbehor', description: 'HDMI cable for connecting your PlayStation 5 to a compatible display.' },
  { name: 'USB-C Charging Cable — DualSense', price: 12, img: 'usbc.webp', cat: 'tilbehor', description: 'USB-C charging cable listing for compatible DualSense charging.' }
];

const CART_STORAGE_KEY = 'gamenowgood_cart_v3';
let cart = loadCart();
let activeFilter = 'all';
const grid = document.getElementById('grid');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('search');
const suggestionsBox = document.getElementById('search-suggestions');

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(item => item && (products.some(product => product.name === item.name) || item.name === 'PS5 Console Bundle') && Number.isFinite(Number(item.price)) && Number.isFinite(Number(item.qty)) && Number(item.qty) > 0)
      .map(item => ({ name: item.name, price: Number(item.price), qty: Math.min(99, Math.floor(Number(item.qty))), img: item.img || '' }));
  } catch (_) { return []; }
}
function saveCart() { try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch (_) {} }
function money(value) { return `€${Number(value).toFixed(2).replace(/\.00$/, '')}`; }
function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function categoryLabel(cat) { return cat === 'spil' ? 'PS5 GAME' : cat === 'konsol' ? 'CONSOLE' : 'PS5 ACCESSORY'; }
function render() {
  const query = searchInput.value.trim().toLowerCase();
  const list = products.filter(product => (activeFilter === 'all' || product.cat === activeFilter) && `${product.name} ${product.description}`.toLowerCase().includes(query));
  grid.innerHTML = '';
  if (!list.length) { grid.innerHTML = '<div class="empty-results">No products found. Try another search.</div>'; return; }
  list.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<div class="product-image-wrap"><img src="${safeText(product.img)}" alt="${safeText(product.name)}" loading="lazy"><span class="product-category">${categoryLabel(product.cat)}</span></div><div class="product-info"><h3>${safeText(product.name)}</h3><p class="product-description">${safeText(product.description)}</p><div class="product-bottom"><strong class="price">${money(product.price)}</strong><button class="add-button" type="button" aria-label="Add ${safeText(product.name)} to basket">＋</button></div><button class="buy-button" type="button">Add to basket</button></div>`;
    const image = card.querySelector('img');
    image.addEventListener('error', () => { image.style.visibility = 'hidden'; image.parentElement.classList.add('image-unavailable'); }, { once: true });
    card.querySelector('.add-button').addEventListener('click', () => addDeal(product.name, product.price, 1, product.img));
    card.querySelector('.buy-button').addEventListener('click', () => addDeal(product.name, product.price, 1, product.img));
    grid.appendChild(card);
  });
}
function showSuggestions(query) {
  if (!query.trim()) { suggestionsBox.classList.remove('show'); suggestionsBox.innerHTML = ''; return; }
  const matches = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  suggestionsBox.innerHTML = matches.length ? matches.map(product => `<button class="suggestion-item" type="button" data-name="${safeText(product.name)}"><img src="${safeText(product.img)}" alt=""><span>${safeText(product.name)}<small>${money(product.price)}</small></span></button>`).join('') : '<div class="suggestion-empty">No matching products</div>';
  suggestionsBox.classList.add('show');
  suggestionsBox.querySelectorAll('[data-name]').forEach(button => button.addEventListener('click', () => {
    searchInput.value = button.dataset.name; activeFilter = 'all';
    document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item.dataset.filter === 'all'));
    render(); suggestionsBox.classList.remove('show'); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  }));
}
searchInput.addEventListener('input', () => { render(); showSuggestions(searchInput.value); });
searchInput.addEventListener('focus', () => { if (searchInput.value) showSuggestions(searchInput.value); });
document.addEventListener('click', event => { if (!event.target.closest('.shop-toolbar')) suggestionsBox.classList.remove('show'); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  render();
}));

function addDeal(name, price, qty = 1, img = '') {
  if (!products.some(product => product.name === name) && name !== 'PS5 Console Bundle') { alert('This item is not currently available in the catalogue.'); return; }
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
  itemsDiv.innerHTML = cart.map((item, index) => `<div class="cart-item">${item.img ? `<img src="${safeText(item.img)}" alt="">` : ''}<div class="cart-item-name"><b>${safeText(item.name)}</b><small>${money(item.price)} each</small></div><div class="qty-control"><button type="button" aria-label="Decrease quantity" onclick="changeQty(${index},-1)">−</button><span>${item.qty}</span><button type="button" aria-label="Increase quantity" onclick="changeQty(${index},1)">＋</button></div><strong>${money(item.price * item.qty)}</strong></div>`).join('') || '<p class="empty-cart">Your basket is empty. Explore the store to add a product.</p>';
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cart-total').textContent = `Total: ${money(total)}`;
  document.getElementById('show-checkout').disabled = cart.length === 0;
  saveCart();
}
function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart(); if (!cart.length) resetCheckout();
}
function resetCheckout() { document.getElementById('checkout-form').hidden = true; document.getElementById('show-checkout').style.display = 'block'; }
function openCart() { document.getElementById('cart-modal').style.display = 'block'; document.body.classList.add('modal-open'); }
function closeCart() { document.getElementById('cart-modal').style.display = 'none'; document.body.classList.remove('modal-open'); }
function clearCart() { cart = []; updateCart(); resetCheckout(); }
function showCheckoutForm() {
  if (!cart.length) { alert('Your basket is empty.'); return; }
  document.getElementById('checkout-form').hidden = false;
  document.getElementById('show-checkout').style.display = 'none';
}
function emailConfigured() {
  return window.emailjs && EMAILJS_PUBLIC_KEY !== 'ADD_EMAILJS_PUBLIC_KEY' && EMAILJS_SERVICE_ID !== 'ADD_EMAILJS_SERVICE_ID';
}
async function sendOrderEmails(order) {
  if (!emailConfigured()) return { sent: false, reason: 'EmailJS is not configured yet.' };
  const itemsText = order.items.map(item => `${item.quantity} × ${item.name} — ${money(item.price * item.quantity)}`).join('\n');
  const common = {
    order_number: order.orderNumber,
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone || 'Not provided',
    shipping_address: order.customer.address,
    order_items: itemsText,
    order_total: money(order.total),
    order_status: 'Order request received — payment not yet verified',
    reply_to: order.customer.email
  };
  const jobs = [];
  if (EMAILJS_STORE_TEMPLATE_ID !== 'ADD_STORE_TEMPLATE_ID') jobs.push(window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_STORE_TEMPLATE_ID, common));
  if (EMAILJS_CUSTOMER_TEMPLATE_ID !== 'ADD_CUSTOMER_TEMPLATE_ID') jobs.push(window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE_ID, common));
  if (!jobs.length) return { sent: false, reason: 'Email templates are not configured yet.' };
  const results = await Promise.allSettled(jobs);
  return { sent: results.some(result => result.status === 'fulfilled'), failed: results.some(result => result.status === 'rejected') };
}
async function confirmOrder() {
  const ids = ['fname', 'lname', 'email', 'address', 'city', 'postal', 'country'];
  const values = Object.fromEntries(ids.map(id => [id, document.getElementById(id).value.trim()]));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  if (ids.some(id => !values[id]) || !emailValid) { alert('Please complete all required fields and enter a valid email address.'); return; }
  if (!document.getElementById('terms-consent').checked) { alert('Please confirm that you have reviewed the order information.'); return; }
  if (!cart.length) { alert('Your basket is empty.'); return; }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderNumber = `GGN-${Date.now().toString().slice(-8)}`;
  const order = {
    orderNumber,
    customer: { name: `${values.fname} ${values.lname}`, email: values.email, phone: document.getElementById('phone').value.trim(), address: `${values.address}, ${values.postal} ${values.city}, ${values.country}` },
    items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.qty })),
    total, currency: 'EUR', createdAt: new Date().toISOString()
  };
  try { localStorage.setItem('lastOrder', JSON.stringify(order)); } catch (_) {}
  const button = document.querySelector('.checkout-btn');
  button.disabled = true; button.textContent = 'Preparing your order…';
  const emailResult = await sendOrderEmails(order);
  // This fixed Revolut payment link does not receive basket totals and does not report payment status back to this static site.
  closeCart();
  alert(`Order request ${orderNumber} prepared. You will now continue to Revolut. Please pay only after confirming the final amount and availability with the store. This is not a payment confirmation.`);
  window.location.href = REVOLUT_CHECKOUT_URL;
  if (emailResult.failed) console.warn('One or more order emails could not be sent.');
}

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('cart-modal').addEventListener('click', event => { if (event.target.id === 'cart-modal') closeCart(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
render();
updateCart();
