const PAYMENT_LINK = "https://revolut.me/yourlink";

const products = [
  { name: "Baldur's Gate 3", price: 399, img: "IMG_9089.jpg", cat: "spil" },
  { name: "GTA V (PS5)", price: 299, img: "IMG_9087.jpg", cat: "spil" },
  { name: "EA Sports FC 27", price: 499, img: "IMG_9088.jpg", cat: "spil" },
  { name: "Elden Ring Collector's", price: 649, img: "IMG_9090.jpg", cat: "spil" },
  { name: "UFC 6", price: 449, img: "IMG_9091.jpg", cat: "spil" },
  { name: "EA Sports FC 26", price: 449, img: "IMG_9092.jpg", cat: "spil" },
  { name: "The Last of Us Part I", price: 349, img: "IMG_9093.jpg", cat: "spil" },
  { name: "Uncharted Legacy of Thieves", price: 299, img: "IMG_9094.jpg", cat: "spil" },
  { name: "Red Dead Redemption", price: 329, img: "IMG_9095.jpg", cat: "spil" },
  { name: "007 First Light", price: 499, img: "IMG_9096.jpg", cat: "spil" },
  { name: "Mafia: The Old Country", price: 449, img: "IMG_9097.jpg", cat: "spil" },
  { name: "Far Cry 6", price: 249, img: "IMG_9098.jpg", cat: "spil" },
  { name: "Battlefield 6", price: 499, img: "IMG_9099.jpg", cat: "spil" },
  { name: "God of War Ragnarök", price: 399, img: "IMG_9100.jpg", cat: "spil" },
  { name: "PlayStation 5", price: 3999, img: "IMG_9116.jpg", cat: "konsol" },
  { name: "Xbox Series X", price: 4299, img: "IMG_9117.jpg", cat: "konsol" },
  { name: "Nintendo Switch OLED", price: 2499, img: "IMG_9116.jpg", cat: "konsol" },
  { name: "DualSense Controller", price: 549, img: "IMG_9116.jpg", cat: "tilbehor" },
  { name: "Xbox Controller", price: 499, img: "IMG_9117.jpg", cat: "tilbehor" },
  { name: "Gaming Headset", price: 399, img: "IMG_9116.jpg", cat: "tilbehor" }
];

let cart = 0;
const grid = document.getElementById("grid");
const cartCount = document.getElementById("cart-count");

function buy() {
  window.open(PAYMENT_LINK, "_blank");
}

function render(filter = "all") {
  grid.innerHTML = "";
  const list = filter === "all" ? products : products.filter(p => p.cat === filter);

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <div class="price">${p.price} kr</div>
        <button class="add">Add to cart</button>
        <button class="buy">Buy now</button>
      </div>
    `;
    card.querySelector(".add").onclick = () => {
      cart++;
      cartCount.textContent = cart;
    };
    card.querySelector(".buy").onclick = buy;
    grid.appendChild(card);
  });
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.filter);
  };
});

render();
