
const foodItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    description: "Juicy beef patty, cheddar cheese, fresh lettuce and special sauce.",
    price: 199,
    category: "Burgers",
    rating: 4.9,
    time: "20 min",
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=85"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, basil and rich tomato sauce on a crispy crust.",
    price: 299,
    category: "Pizza",
    rating: 4.8,
    time: "25 min",
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=85"
  },
  {
    id: 3,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice, tender chicken and traditional spices.",
    price: 249,
    category: "Indian",
    rating: 4.9,
    time: "30 min",
    tag: "Chef's Pick",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=600&auto=format&fit=crop&q=85"
  },
  {
    id: 4,
    name: "Crispy Chicken Burger",
    description: "Crispy fried chicken, fresh veggies and creamy mayonnaise.",
    price: 229,
    category: "Burgers",
    rating: 4.7,
    time: "20 min",
    tag: "New",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=85"
  },
  {
    id: 5,
    name: "Pepperoni Pizza",
    description: "Loaded with pepperoni, mozzarella and flavorful pizza sauce.",
    price: 349,
    category: "Pizza",
    rating: 4.8,
    time: "25 min",
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=85"
  },
  {
    id: 6,
    name: "Masala Dosa",
    description: "Golden crispy dosa served with potato masala and chutneys.",
    price: 129,
    category: "Indian",
    rating: 4.7,
    time: "15 min",
    tag: "Favorite",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=85"
  },
  {
    id: 7,
    name: "Cold Coffee",
    description: "Chilled creamy coffee with milk and a delicious foam topping.",
    price: 99,
    category: "Drinks",
    rating: 4.6,
    time: "10 min",
    tag: "Refreshing",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=85"
  },
  {
    id: 8,
    name: "Chocolate Cake",
    description: "Rich, soft chocolate cake with smooth chocolate frosting.",
    price: 159,
    category: "Desserts",
    rating: 4.9,
    time: "10 min",
    tag: "Sweet",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=85"
  }
];

let cart = [];
let activeCategory = "All";
let searchTerm = "";
let sortValue = "default";
let discountApplied = false;

const foodGrid = document.getElementById("foodGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtitle = document.getElementById("cartSubtitle");
const toast = document.getElementById("toast");
const checkoutModal = document.getElementById("checkoutModal");
const storyModal = document.getElementById("storyModal");

function money(value) {
  return "₹" + value.toLocaleString("en-IN");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function renderFood() {
  let items = foodItems.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const searchMatch = (item.name + " " + item.description)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (sortValue === "low") items.sort((a, b) => a.price - b.price);
  if (sortValue === "high") items.sort((a, b) => b.price - a.price);
  if (sortValue === "rating") items.sort((a, b) => b.rating - a.rating);

  foodGrid.innerHTML = items.map(item => `
    <article class="food-card">
      <div class="food-image-wrap">
        <img class="food-image" src="${item.image}" alt="${item.name}" loading="lazy">
        <span class="food-tag">${item.tag}</span>
      </div>
      <div class="food-info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="food-meta">
          <span class="rating">★ ${item.rating}</span>
          <span>•</span>
          <span>⏱ ${item.time}</span>
        </div>
        <div class="food-bottom">
          <strong class="food-price">${money(item.price)}</strong>
          <button class="add-btn" data-add="${item.id}" aria-label="Add ${item.name} to cart">+</button>
        </div>
      </div>
    </article>
  `).join("");

  document.getElementById("emptyMessage").hidden = items.length > 0;
}

function addToCart(id) {
  const item = foodItems.find(food => food.id === id);
  const existing = cart.find(food => food.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCart();
  showToast(`${item.name} added to your cart! 🛒`);
}

function changeQuantity(id, change) {
  const item = cart.find(food => food.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(food => food.id !== id);
  }

  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(food => food.id !== id);
  updateCart();
}

function updateCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40;
  const discount = discountApplied ? Math.round(subtotal * .2) : 0;
  const total = subtotal + deliveryFee - discount;

  cartCount.textContent = itemCount;
  cartSubtitle.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`;
  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("delivery").textContent = money(deliveryFee);
  document.getElementById("discount").textContent = "-" + money(discount);
  document.getElementById("total").textContent = money(total);
  document.getElementById("checkoutBtn").disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>🛒</span>
        <h3>Your cart is empty</h3>
        <p>Add something delicious to get started!</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <strong>${money(item.price * item.qty)}</strong>
        <div class="qty-controls">
          <button data-minus="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button data-plus="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${item.id}" aria-label="Remove item">✕</button>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}

function openModal(modal) {
  modal.classList.add("show");
}

function closeModal(modal) {
  modal.classList.remove("show");
}

document.getElementById("categoryList").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  document.querySelectorAll(".category").forEach(btn => {
    btn.classList.toggle("active", btn === button);
  });
  renderFood();
});

foodGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

document.getElementById("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value;
  renderFood();
});

document.getElementById("sortSelect").addEventListener("change", event => {
  sortValue = event.target.value;
  renderFood();
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("offerBtn").addEventListener("click", () => {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  document.getElementById("themeBtn").textContent = isDark ? "☀️" : "🌙";
});

document.getElementById("couponBtn").addEventListener("click", () => {
  const input = document.getElementById("couponInput");
  const message = document.getElementById("couponMessage");
  const code = input.value.trim().toUpperCase();

  if (code === "FOODIE20") {
    if (discountApplied) {
      message.textContent = "Coupon is already applied.";
      return;
    }
    discountApplied = true;
    message.textContent = "20% discount applied successfully!";
    updateCart();
  } else {
    message.textContent = "Invalid coupon. Try FOODIE20.";
  }
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return;
  openModal(checkoutModal);
});

document.getElementById("closeModal").addEventListener("click", () => closeModal(checkoutModal));
document.getElementById("closeStory").addEventListener("click", () => closeModal(storyModal));

document.getElementById("storyBtn").addEventListener("click", () => openModal(storyModal));
document.getElementById("storyMenuBtn").addEventListener("click", () => {
  closeModal(storyModal);
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

[checkoutModal, storyModal].forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal(modal);
  });
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  if (!name) return;

  const orderId = "FD" + Math.floor(10000 + Math.random() * 90000);
  const total = document.getElementById("total").textContent;

  closeModal(checkoutModal);
  closeCart();

  alert(`🎉 Order Placed Successfully!\n\nOrder ID: ${orderId}\nCustomer: ${name}\nTotal: ${total}\n\nThank you for ordering from Foodie!`);

  cart = [];
  discountApplied = false;
  document.getElementById("couponInput").value = "";
  document.getElementById("couponMessage").textContent = "";
  document.getElementById("checkoutForm").reset();
  updateCart();
});

renderFood();
updateCart();