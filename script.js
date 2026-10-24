const products = [
  { name: "Baldur's Gate 3", price: 399, img: "images/IMG_9089.jpg", cat: "spil" },
  { name: "GTA V (PS5)", price: 299, img: "images/IMG_9087.jpg", cat: "spil" },
  { name: "EA Sports FC 27", price: 449, img: "images/IMG_9088.jpg", cat: "spil" },
  { name: "Elden Ring Collector's", price: 599, img: "images/IMG_9090.jpg", cat: "spil" },
  { name: "UFC 6", price: 349, img: "images/IMG_9091.jpg", cat: "spil" },
  { name: "EA Sports FC 26", price: 399, img: "images/IMG_9092.jpg", cat: "spil" },
  { name: "The Last of Us Part I", price: 299, img: "images/IMG_9093.jpg", cat: "spil" },
  { name: "Uncharted Legacy of Thieves", price: 249, img: "images/IMG_9094.jpg", cat: "spil" },
  { name: "Red Dead Redemption", price: 279, img: "images/IMG_9095.jpg", cat: "spil" },
  { name: "007 First Light", price: 429, img: "images/IMG_9096.jpg", cat: "spil" },
  { name: "Mafia: The Old Country", price: 379, img: "images/IMG_9097.jpg", cat: "spil" },
  { name: "Far Cry 6", price: 199, img: "images/IMG_9098.jpg", cat: "spil" },
  { name: "Battlefield 6", price: 449, img: "images/IMG_9099.jpg", cat: "spil" },
  { name: "God of War Ragnarök", price: 349, img: "images/IMG_9100.jpg", cat: "spil" },
  { name: "PlayStation 5", price: 4499, img: "images/IMG_9116.jpg", cat: "konsol" },
  { name: "Xbox Series X", price: 4299, img: "images/IMG_9117.jpg", cat: "konsol" }
];

let cart = 0;
const grid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');

function renderProducts(filter = 'all') {
  grid.innerHTML = '';
  const filtered = filter === 'all' ? products : products.filter(p => p.cat === filter);
  
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="price">${p.price} kr</div>
        <button class="add-btn">Læg i kurv</button>
      </div>
    `;
    card.querySelector('.add-btn').onclick = () => {
      cart++;
      cartCount.textContent = cart;
    };
    grid.appendChild(card);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  };
});

renderProducts();
