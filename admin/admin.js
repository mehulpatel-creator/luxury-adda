// admin/admin.js
async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  renderAdminList(products);
}

function renderAdminList(products) {
  const container = document.getElementById("admin-product-list");
  container.innerHTML = "";
  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "admin-product";
    div.innerHTML = `
      <img src="../${p.image}" />
      <input value="${p.name}" data-idx="${i}" data-field="name" />
      <input value="${p.price}" data-idx="${i}" data-field="price" />
      <select data-idx="${i}" data-field="category">
        <option ${p.category === "men" ? "selected" : ""}>men</option>
        <option ${p.category === "women" ? "selected" : ""}>women</option>
        <option ${p.category === "unisex" ? "selected" : ""}>unisex</option>
      </select>
      <button onclick="deleteProduct(${i})">Delete</button>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll("input, select").forEach(input => {
    input.addEventListener("change", saveChanges);
  });
}

let productData = [];

async function saveChanges(e) {
  const idx = e.target.dataset.idx;
  const field = e.target.dataset.field;
  const value = e.target.value;

  const res = await fetch('/api/products');
  productData = await res.json();
  productData[idx][field] = field === "price" ? +value : value;

  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });

  loadProducts(); // Refresh
}

async function deleteProduct(i) {
  const res = await fetch('/api/products');
  const products = await res.json();
  products.splice(i, 1);

  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  });

  loadProducts();
}

loadProducts();
