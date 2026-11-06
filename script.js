'use strict';

// Existing Revolut payment destination retained exactly as supplied in the original project.
const REVOLUT_CHECKOUT_URL = 'https://checkout.revolut.com/pay/34bd909a-12e7-49f8-a393-540bd03d9c2f';

const products = [
  { name: 'GTA VI (pre-release listing)', price: 59.99, img: 'gta6-listing.webp', cat: 'spil' },
  { name: "Baldur's Gate 3", price: 49.99, img: 'IMG_9089.webp', cat: 'spil' },
  { name: 'GTA V (PS5)', price: 24.99, img: 'IMG_9087.webp', cat: 'spil' },
  { name: 'EA Sports FC 27', price: 69.99, img: 'IMG_9088.webp', cat: 'spil' },
  { name: "Elden Ring Collector's", price: 119.99, img: 'IMG_9090.webp', cat: 'spil' },
  { name: 'UFC 6', price: 69.99, img: 'IMG_9091.webp', cat: 'spil' },
  { name: 'EA Sports FC 26', price: 29.99, img: 'IMG_9092.webp', cat: 'spil' },
  { name: 'The Last of Us Part I', price: 39.99, img: 'IMG_9093.webp', cat: 'spil' },
  { name: 'Uncharted Legacy of Thieves', price: 29.99, img: 'IMG_9094.webp', cat: 'spil' },
  { name: 'Red Dead Redemption', price: 39.99, img: 'IMG_9095.webp', cat: 'spil' },
  { name: '007 First Light', price: 59.99, img: 'IMG_9096.webp', cat: 'spil' },
  { name: 'Mafia: The Old Country', price: 49.99, img: 'IMG_9097.webp', cat: 'spil' },
  { name: 'Far Cry 6', price: 19.99, img: 'IMG_9098.webp', cat: 'spil' },
  { name: 'Battlefield 6', price: 39.99, img: 'IMG_9099.webp', cat: 'spil' },
  { name: 'God of War Ragnarök', price: 39.99, img: 'IMG_9100.webp', cat: 'spil' },
  { name: 'PlayStation 5', price: 499.99, img: 'IMG_9116.webp', cat: 'konsol' },
  { name: 'Xbox Series X', price: 499.99, img: 'IMG_9117.webp', cat: 'konsol' },
  { name: 'Nintendo Switch OLED', price: 279.99, img: 'switch-oled.webp', cat: 'konsol' },
  { name: 'DualSense Controller', price: 64.99, img: 'dualsense.webp', cat: 'tilbehor' },
  { name: 'Xbox Wireless Controller', price: 59.99, img: 'xbox-controller.webp', cat: 'tilbehor' },
  { name: 'Nintendo Switch Pro Controller', price: 69.99, img: 'switch-pro.webp', cat: 'tilbehor' },
  { name: 'Gaming Headset', price: 39.99, img: 'headset.webp', cat: 'tilbehor' },
  { name: 'Controller Charging Station', price: 24.99, img: 'charging-dock.webp', cat: 'tilbehor' },
  { name: 'HDMI Cable 2m', price: 9.99, img: 'hdmi.webp', cat: 'tilbehor' },
  { name: 'USB-C Charging Cable', price: 7.99, img: 'usbc.webp', cat: 'tilbehor' },
  { name: 'Memory Card 1TB', price: 49.99, img: 'memory.webp', cat: 'tilbehor' },
  { name: 'Gaming Mouse', price: 24.99, img: 'mouse.webp', cat: 'tilbehor' }
];

const productNotes = {"Baldur's Gate 3": "Genre: fantasy role-playing. A story-led adventure with party-based combat and exploration. Confirm platform and edition before purchase.", "GTA V (PS5)": "Platform: PlayStation 5. Genre: open-world action adventure. Explore Los Santos in the enhanced PS5 edition.", "EA Sports FC 27": "Genre: football simulation. Please confirm official release status, platform and edition before ordering.", "Elden Ring Collector's": "Genre: action role-playing. Collector edition listing; contact us to verify the exact contents, platform and availability.", "UFC 6": "Genre: mixed martial arts. Contact us to confirm the platform, official release status and edition.", "EA Sports FC 26": "Platform shown: PlayStation 5. Genre: football simulation. Confirm edition and language before ordering.", "The Last of Us Part I": "Platform shown: PlayStation 5. Genre: story-driven action adventure. Single-player experience.", "Uncharted Legacy of Thieves": "Platform shown: PlayStation 5. Genre: action adventure. Collection listing; confirm included titles and edition.", "Red Dead Redemption": "Platform shown: PlayStation 5 case artwork. Genre: western action adventure. Confirm exact edition and compatibility.", "007 First Light": "Spy-action adventure listing. Confirm official release date, platform and edition before ordering.", "Mafia: The Old Country": "Platform shown: PlayStation 5. Genre: cinematic crime action adventure. Confirm edition and language.", "Far Cry 6": "Platform shown: PlayStation 5. Genre: open-world action. Confirm edition and platform compatibility.", "Battlefield 6": "Platform shown: PlayStation 5. Genre: large-scale military action. Confirm edition and online-service requirements.", "God of War Ragnarök": "Platform shown: PlayStation 5. Genre: action adventure inspired by Norse mythology.", "PlayStation 5": "Console listing. Please confirm exact model, disc/digital version, storage capacity, condition, warranty and included accessories before purchase.", "Xbox Series X": "Console listing. Please confirm exact model, storage, condition, warranty and included accessories before purchase.", "Nintendo Switch OLED": "Console listing. Confirm colour, condition, included Joy-Con/controllers, dock, charger and warranty.", "DualSense Controller": "PlayStation 5 wireless controller. Confirm colour, condition and whether the original box/cable is included.", "Xbox Wireless Controller": "Xbox wireless controller listing. Confirm model generation, colour, battery inclusion and device compatibility.", "Nintendo Switch Pro Controller": "Nintendo Switch Pro-style controller listing. Confirm exact model, condition and included cable.", "Gaming Headset": "Gaming headset listing. Confirm wired/wireless connection, connector type, microphone and supported devices.", "Controller Charging Station": "Charging dock listing. Confirm which controller model it fits and whether the power cable is included.", "HDMI Cable 2m": "2-metre HDMI cable listing. Confirm connector type and HDMI version/specification for your setup.", "USB-C Charging Cable": "USB-C cable listing. Confirm cable length, charging wattage and data-transfer support before purchase.", "Memory Card 1TB": "1TB microSD storage listing. Check device compatibility and the exact speed class before purchase.", "Gaming Mouse": "RGB gaming mouse listing. Confirm wired/wireless connection, DPI range, buttons and system compatibility."};

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
    card.innerHTML = `<div class="product-image-wrap"><img src="${safeText(product.img)}" alt="${safeText(product.name)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='IMG_9087.webp';this.classList.add('image-fallback')"><span class="product-category">${product.cat === 'spil' ? 'GAME' : product.cat === 'konsol' ? 'CONSOLE' : 'ACCESSORY'}</span></div><div class="product-info"><h3>${safeText(product.name)}</h3><p class="product-description">${safeText(productNotes[product.name] || 'Contact us to confirm exact product details.')}</p><div class="product-meta"><span>${product.cat === 'spil' ? 'Video game' : product.cat === 'konsol' ? 'Gaming hardware' : 'Gaming accessory'}</span><span>EUR pricing</span></div><div class="product-bottom"><strong class="price">${money(product.price)}</strong><button class="add-button" type="button" aria-label="Add ${safeText(product.name)} to basket">＋</button></div><button class="buy-button" type="button">Add to basket</button><p class="stock-note">Availability and delivery confirmed before order acceptance</p></div>`;
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
  const ids = ['fname', 'lname', 'address', 'city', 'postal', 'country'];
  const values = Object.fromEntries(ids.map(id => [id, document.getElementById(id).value.trim()]));
  if (ids.some(id => !values[id])) {
    alert('Please complete all required delivery details.');
    const firstInvalid = ids.map(id => document.getElementById(id)).find(input => !input.value.trim());
    if (firstInvalid) firstInvalid.focus();
    return;
  }
  if (!cart.length) { alert('Your basket is empty.'); return; }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const order = {
    customer: { name: `${values.fname} ${values.lname}`, phone: document.getElementById('phone').value.trim(), address: `${values.address}, ${values.postal} ${values.city}, ${values.country}` },
    items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.qty })),
    total, currency: 'EUR', createdAt: new Date().toISOString()
  };
  try { localStorage.setItem('lastOrder', JSON.stringify(order)); } catch (_) { /* no local storage available */ }
  // Preserve the original payment flow and exact Revolut checkout URL.
  const paymentWindow = window.open(REVOLUT_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  if (!paymentWindow) window.location.href = REVOLUT_CHECKOUT_URL;
  alert(`Opening Revolut's hosted payment page. Your basket total is ${money(total)}. The payment amount is not automatically linked to this basket; contact support to confirm the correct amount before paying.`);
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
