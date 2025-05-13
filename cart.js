let cart = [];

// Load cart from localStorage and render it
const fetchCartItems = async () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItemsContainer = document.getElementById("cart-items");
  const proceedButton = document.getElementById("proceed-button");
  const clearButton = document.getElementById("clear-button");
  const totalAmount = document.getElementById("total-amount");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    proceedButton.style.display = "none";
    clearButton.style.display = "none";
    totalAmount.style.display = "none";
    return;
  }

  try {
    const response = await fetch("https://deeply-accurate-may.glitch.me/books");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const books = await response.json();
    renderCartItems(books);
  } catch (err) {
    console.error("Error fetching cart items:", err);
    cartItemsContainer.innerHTML = "<p>Failed to load cart items.</p>";
  }
};

// Render cart with quantity, image, etc.
function renderCartItems(books) {
  let totalAmount = 0;

  const itemsHTML = books.map(book => {
    const cartItem = cart.find(item => item.id === book.id);
    if (!cartItem) return '';

    const itemTotal = cartItem.quantity * Number(book.price);
    totalAmount += itemTotal;

    return `
      <div class="cart-item">
        <img src="${book.bookimage}" alt="${book.name}" onerror="this.src='images/placeholder.png'" />
        <div class="cart-item-details">
          <h3>${book.name}</h3>
          <p>Price: $${book.price}</p>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${book.id}, 'decrease')">-</button>
            <span>${cartItem.quantity}</span>
            <button onclick="updateQuantity(${book.id}, 'increase')">+</button>
          </div>
          <p><strong>Item Total:</strong> $${itemTotal.toFixed(2)}</p>
          <button class="remove-button" onclick="removeFromCart(${book.id})">Remove from Cart</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("cart-items").innerHTML = itemsHTML;
  updateTotalAmount(totalAmount);
}

// Display total and toggle buttons
function updateTotalAmount(totalAmount) {
  document.getElementById("total-amount").textContent = `Total: $${totalAmount.toFixed(2)}`;

  const hasItems = cart.length > 0;
  document.getElementById("proceed-button").style.display = hasItems ? "block" : "none";
  document.getElementById("clear-button").style.display = hasItems ? "block" : "none";
  document.getElementById("total-amount").style.display = hasItems ? "block" : "none";
}

// Quantity increase/decrease
function updateQuantity(bookId, action) {

  const cartItem = cart.find(item => item.id == bookId);
  if (!cartItem) return;

  if (action === "increase") {
    cartItem.quantity++;
  } else if (action === "decrease") {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    } else {
      removeFromCart(bookId);
      return;
    }
  }

  saveCart();
  fetchCartItems();
}

// Remove item
function removeFromCart(bookId) {
  cart = cart.filter(item => item.id != bookId);
  saveCart();
  fetchCartItems();
}

// Save to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Clear entire cart
document.getElementById("clear-button").addEventListener("click",()=>{
  cart = [];
  saveCart();
  fetchCartItems();
})

// Go to payment
document.getElementById("proceed-button").addEventListener("click",()=>{
if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  window.location.href = "./payment.html";
});

// Start
fetchCartItems();
