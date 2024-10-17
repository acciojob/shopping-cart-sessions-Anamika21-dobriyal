// This is the boilerplate code given for you
// You can modify this code
// Product data
// const products = [
//   { id: 1, name: "Product 1", price: 10 },
//   { id: 2, name: "Product 2", price: 20 },
//   { id: 3, name: "Product 3", price: 30 },
//   { id: 4, name: "Product 4", price: 40 },
//   { id: 5, name: "Product 5", price: 50 },
// ];

// // DOM elements
// const productList = document.getElementById("product-list");

// // Render product list
// function renderProducts() {
//   products.forEach((product) => {
//     const li = document.createElement("li");
//     li.innerHTML = `${product.name} - $${product.price} <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`;
//     productList.appendChild(li);
//   });
// }

// // Render cart list
// function renderCart() {}

// // Add item to cart
// function addToCart(productId) {}

// // Remove item from cart
// function removeFromCart(productId) {}

// // Clear cart
// function clearCart() {}

// // Initial render
// renderProducts();
// renderCart();


// Product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM elements
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

// Render product list
function renderProducts() {
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `${product.name} - $${product.price} <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`;
    productList.appendChild(li);
  });
}

// Get cart from session storage or initialize an empty cart
function getCart() {
  return JSON.parse(sessionStorage.getItem("cart")) || [];
}

// Save cart to session storage
function saveCart(cart) {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

// Render cart list
function renderCart() {
  cartList.innerHTML = ''; // Clear current cart list display
  const cart = getCart();
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - $${item.price} <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>`;
    cartList.appendChild(li);
  });
}

// Add item to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === parseInt(productId));
  if (product) {
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
    renderCart();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== parseInt(productId));
  saveCart(cart);
  renderCart();
}

// Clear cart
function clearCart() {
  sessionStorage.removeItem("cart");
  renderCart();
}

// Event listeners
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = e.target.getAttribute("data-id");
    addToCart(productId);
  }
});

cartList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-from-cart-btn")) {
    const productId = e.target.getAttribute("data-id");
    removeFromCart(productId);
  }
});

clearCartBtn.addEventListener("click", clearCart);

// Initial render
renderProducts();
renderCart();

// Click the "Add to Cart" button for Product 1 (the first product)
cy.get("ul#product-list").children("li").first().children("button").click();

// Click the "Add to Cart" button for Product 5 (the fifth product)
cy.get("ul#product-list").children("li").eq(4).children("button").click();

// Click the "Add to Cart" button for Product 1 again (the first product)
cy.get("ul#product-list").children("li").first().children("button").click();

// Now assert that sessionStorage has three items in the cart: 
// Product 1, Product 5, and Product 1 (again)
cy.window()
  .its("sessionStorage")
  .invoke("getItem", "cart")
  .should("eq", JSON.stringify([
    { id: 1, name: "Product 1", price: 10 },
    { id: 5, name: "Product 5", price: 50 },
    { id: 1, name: "Product 1", price: 10 }
  ]));

