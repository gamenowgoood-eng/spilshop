const products = [
  { name: "Baldur's Gate 3", price: 54, img: "IMG_9089.jpg", cat: "spil" },
  { name: "GTA V (PS5)", price: 40, img: "IMG_9087.jpg", cat: "spil" },
  { name: "EA Sports FC 27", price: 67, img: "IMG_9088.jpg", cat: "spil" },
  { name: "Elden Ring Collector's", price: 87, img: "IMG_9090.jpg", cat: "spil" },
  { name: "UFC 6", price: 60, img: "IMG_9091.jpg", cat: "spil" },
  { name: "EA Sports FC 26", price: 60, img: "IMG_9092.jpg", cat: "spil" },
  { name: "The Last of Us Part I", price: 47, img: "IMG_9093.jpg", cat: "spil" },
  { name: "Uncharted Legacy of Thieves", price: 40, img: "IMG_9094.jpg", cat: "spil" },
  { name: "Red Dead Redemption", price: 44, img: "IMG_9095.jpg", cat: "spil" },
  { name: "007 First Light", price: 67, img: "IMG_9096.jpg", cat: "spil" },
  { name: "Mafia: The Old Country", price: 60, img: "IMG_9097.jpg", cat: "spil" },
  { name: "Far Cry 6", price: 33, img: "IMG_9098.jpg", cat: "spil" },
  { name: "Battlefield 6", price: 67, img: "IMG_9099.jpg", cat: "spil" },
  { name: "God of War Ragnarök", price: 54, img: "IMG_9100.jpg", cat: "spil" },
  { name: "PlayStation 5", price: 539, img: "IMG_9116.jpg", cat: "konsol" },
  { name: "Xbox Series X", price: 579, img: "IMG_9117.jpg", cat: "konsol" },
  { name: "Nintendo Switch OLED", price: 335, img: "IMG_9116.jpg", cat: "konsol" },
  { name: "DualSense Controller", price: 74, img: "dualsense.jpg", cat: "tilbehor" },
  { name: "Xbox Wireless Controller", price: 67, img: "xbox-controller.jpg", cat: "tilbehor" },
  { name: "Nintendo Switch Pro Controller", price: 80, img: "switch-pro.jpg", cat: "tilbehor" },
  { name: "Gaming Headset", price: 54, img: "headset.jpg", cat: "tilbehor" },
  { name: "Controller Charging Station", price: 35, img: "charging-dock.jpg", cat: "tilbehor" },
  { name: "HDMI Cable 2m", price: 15, img: "hdmi.jpg", cat: "tilbehor" },
  { name: "USB-C Charging Cable", price: 12, img: "usbc.jpg", cat: "tilbehor" },
  { name: "Memory Card 1TB", price: 89, img: "memory.jpg", cat: "tilbehor" },
  { name: "Gaming Mouse", price: 39, img: "mouse.jpg", cat: "tilbehor" }
];

let cart = 0;
const grid = document.getElementById("grid");
const cartCount = document.getElementById("cart-count");

const PAYMENT_LINK = "https://revolut.me/yourlink";

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
        <div class="price">€${p.price}</div>
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
