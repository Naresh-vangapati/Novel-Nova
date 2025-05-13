const container = document.getElementById("container");
const searchInput = document.getElementById("search-input");
const cartLink = document.getElementById("cart-link");
const cartCount = document.getElementById("cart-count");

let allBooks = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  updateCartCount();

  cartLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "cart.html";
  });

  searchInput.addEventListener("input", handleSearch);
});

const fetchData = async () => {
  try {
    const response = await fetch("https://deeply-accurate-may.glitch.me/books");
    const data = await response.json();
    allBooks = data;
    displayBooks(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    container.innerHTML = "<p class='text-danger'>Failed to load books.</p>";
  }
};

function displayBooks(books) {
  container.innerHTML = '<div class="row">';
  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100 shadow">
        <img src="${book.bookimage}" class="card-img-top" alt="${book.name}">
        <div class="card-body">
          <h5 class="card-title"><strong>Book Name:</strong> ${book.name}</h5>
          <p class="card-text"><strong>Author:</strong> ${book.author}</p>
          <p class="card-text"><strong>Genre:</strong> ${book.genre}</p>
          <p class="card-text"><strong>Price:</strong> ${book.price}</p>
          <button class="btn btn-primary view-btn" data-id="${book.id}">View More</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bookId = e.target.getAttribute("data-id");
      localStorage.setItem("bookId", bookId);
      window.location.href = "book-details.html";
    });
  });
}

function handleSearch() {
  const query = searchInput.value.toLowerCase();
  const filteredBooks = allBooks.filter(book =>
    book.name.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.genre.toLowerCase().includes(query)
  );
  displayBooks(filteredBooks);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}
