document.addEventListener("DOMContentLoaded", () => {
  const orderItems = document.getElementById("order-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  const totalEl = orderItems.querySelector(".summary-total strong:last-child");

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "summary-item";
    li.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
    `;
    orderItems.insertBefore(li, orderItems.querySelector(".summary-total"));
    total += item.price * item.qty;
  });

  if (totalEl) {
    totalEl.textContent = `₹${total}`;
  }
});
