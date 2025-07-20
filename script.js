const products = [
  { name: "Oud", image: "images/oud.jpg", price: 999, category: "unisex" },
  { name: "CEO Woman", image: "images/ceo-woman.jpg", price: 899, category: "women" },
  { name: "White Oud", image: "images/white-oud.jpg", price: 1099, category: "unisex" },
  { name: "CEO Man", image: "images/ceo-man.jpg", price: 1199, category: "men" },
  { name: "Rose Woman", image: "images/rose-woman.jpg", price: 899, category: "women" },
  { name: "Honey Oud", image: "images/honey-oud.jpg", price: 999, category: "unisex" },
  { name: "Senorita Woman", image: "images/senorita-woman.jpg", price: 899, category: "women" },
  { name: "Skai Aquatic", image: "images/skai.jpg", price: 999, category: "unisex" },
  { name: "Fresh", image: "images/fresh.jpg", price: 899, category: "unisex" },
  { name: "Glam", image: "images/glam.jpg", price: 999, category: "women" },
  { name: "Vanilla", image: "images/vanilla.jpg", price: 949, category: "unisex" },
  { name: "Night Fever", image: "images/night-fever.jpg", price: 1099, category: "unisex" },
  { name: "Devil", image: "images/devil.jpg", price: 999, category: "unisex" },
  { name: "Pure Musk", image: "images/pure-musk.jpg", price: 949, category: "unisex" },
  { name: "Narco", image: "images/narco.jpg", price: 999, category: "unisex" },
  { name: "Date Woman", image: "images/date-woman.jpg", price: 899, category: "women" },
];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeCart = document.getElementById("close-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts(filter = "all") {
  productList.innerHTML = "";
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    const inCart = cart.find(item => item.name === p.name);
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <div id="controls-${p.name.replace(/\s+/g, '-')}">
        ${inCart ? `
          <div class="qty-controls">
            <button onclick='changeQty("${p.name}", -1)'>−</button>
            <span>${inCart.qty}</span>
            <button onclick='changeQty("${p.name}", 1)'>+</button>
          </div>
        ` : `<button onclick='addToCart("${p.name}")'>Add to Cart</button>`}
      </div>
    `;
    productList.appendChild(div);
  });
}

function addToCart(name) {
  const product = products.find(p => p.name === name);
  const item = cart.find(p => p.name === name);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  renderProducts();
}

function changeQty(name, delta) {
  const item = cart.find(p => p.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(p => p.name !== name);
  }
  updateCart();
  renderProducts();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" class="cart-item-img" />
        <div class="cart-item-details">
          <h4>${p.name}</h4>
          <p>₹${p.price} × ${p.qty} = ₹${p.price * p.qty}</p>
          <div class="cart-controls">
            <button onclick='changeQty("${p.name}", -1)'>−</button>
            <span>${p.qty}</span>
            <button onclick='changeQty("${p.name}", 1)'>+</button>
            <button onclick='removeFromCart("${p.name}")'>Remove</button>
          </div>
        </div>
      </div>
    `;
    cartItems.appendChild(li);
    total += p.price * p.qty;
  });
  cartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
  cartTotal.textContent = total;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(name) {
  cart = cart.filter(p => p.name !== name);
  updateCart();
  renderProducts();
}

document.getElementById("view-cart").onclick = () => cartModal.classList.remove("hidden");
closeCart.onclick = () => cartModal.classList.add("hidden");
checkoutBtn.onclick = () => window.location.href = "checkout.html";

document.querySelectorAll("nav button[data-filter]").forEach(btn =>
  btn.addEventListener("click", () => renderProducts(btn.dataset.filter))
);

renderProducts();
updateCart();
