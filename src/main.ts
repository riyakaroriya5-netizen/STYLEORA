import './style.css';

// PRODUCT INTERFACES

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductResponse {
  products: Product[];
}

// GLOBAL VARIABLES

let allProducts: Product[] = [];
let cart: CartItem[] = [];
let selectedCategory = 'all';
let selectedSort = 'default';

const conversionRate = 85;

// CURRENCY FORMAT

function formatINR(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.round(price * conversionRate));
}

// LOAD CART

function loadCart(): void {
  try {
    const savedCart = localStorage.getItem('styleora-cart');

    if (savedCart) {
      const parsed: unknown = JSON.parse(savedCart);

      if (Array.isArray(parsed)) {
        cart = parsed as CartItem[];
      }
    }
  } catch (error) {
    console.error('Cart loading error:', error);
    cart = [];
  }
}

// SAVE CART

function saveCart(): void {
  localStorage.setItem('styleora-cart', JSON.stringify(cart));
}

// WEBSITE HTML

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

<header class="navbar">

  <h1 class="logo">STYLEORA</h1>

  <nav>
    <a href="#">Home</a>
    <a href="#categories">Categories</a>
    <a href="#women">Women</a>
    <a href="#men">Men</a>
    <a href="#kids">Kids</a>
    <a href="#collection">New Arrivals</a>
    <a href="#contact">Contact</a>
  </nav>

  <button class="cart-btn" id="cart-button">
    🛒 Cart (<span id="cart-count">0</span>)
  </button>

</header>

<main>

<section class="hero">

  <div class="hero-content">

    <p class="tagline">NEW COLLECTION 2026</p>

    <h2>Wear Your<br>Confidence.</h2>

    <p>
      Discover beautiful styles for every occasion.
      Find your perfect fashion with STYLEORA.
    </p>

    <button class="shop-btn" id="shop-now">
      Shop Now
    </button>

  </div>

  <img
    src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700"
    alt="Fashion Collection"
  >

</section>

<section id="categories" class="categories">

  <h2>Shop By Category</h2>

  <div class="category-list">

    <div class="category" id="women"
      data-category="womens-dresses">

      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400"
        alt="Women Wear"
      >

      <h3>Women Wear</h3>

    </div>

    <div class="category" id="men"
      data-category="mens-shirts">

      <img
        src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400"
        alt="Men Wear"
      >

      <h3>Men Wear</h3>

    </div>

    <div class="category" id="kids"
      data-category="all">

      <img
        src="https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=400"
        alt="Kids Wear"
      >

      <h3>Kids Wear</h3>

    </div>

    <div class="category" data-category="tops">

      <img
        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400"
        alt="Ethnic Wear"
      >

      <h3>Ethnic Wear</h3>

    </div>

  </div>

</section>

<section id="collection" class="collection">

  <h2>Our Popular Collection</h2>

  <p>Explore the latest fashion trends at STYLEORA.</p>

  <input
    type="text"
    id="search-input"
    placeholder="Search your favourite products..."
  >

  <div class="filter-buttons">

    <button class="filter-btn active" data-category="all">
      All Products
    </button>

    <button class="filter-btn" data-category="womens-dresses">
      Women
    </button>

    <button class="filter-btn" data-category="mens-shirts">
      Men
    </button>

    <button class="filter-btn" data-category="tops">
      Tops
    </button>

  </div>

  <select id="sort-select">

    <option value="default">Sort By Price</option>

    <option value="low">Price: Low to High</option>

    <option value="high">Price: High to Low</option>

  </select>

  <div class="product-list" id="product-container">
    <p>Loading products...</p>
  </div>

</section>

<section id="contact" class="contact">

  <h2>STYLEORA</h2>

  <p>Wear Your Confidence.</p>

  <p>Thank you for shopping with us!</p>

</section>

</main>

<!-- PRODUCT DETAILS -->

<div id="product-modal" class="product-modal">

  <div class="modal-content">

    <button id="close-modal" class="close-modal">×</button>

    <div id="modal-details"></div>

  </div>

</div>

<!-- CART -->

<div id="cart-modal" class="product-modal">

  <div class="modal-content cart-content">

    <button id="close-cart" class="close-modal">×</button>

    <h2>My Shopping Cart 🛒</h2>

    <div id="cart-items"></div>

    <h3 id="cart-total">Total: ₹0</h3>

    <button id="checkout-button" class="shop-btn">
      Proceed to Checkout
    </button>

  </div>

</div>

<!-- CHECKOUT -->

<div id="checkout-modal" class="product-modal">

  <div class="modal-content checkout-content">

    <button id="close-checkout" class="close-modal">×</button>

    <h2>Checkout Details</h2>

    <p>Please enter your delivery information.</p>

    <form id="checkout-form">

      <label>Full Name</label>

      <input
        type="text"
        id="customer-name"
        placeholder="Enter your name"
        minlength="3"
        required
      >

      <label>Email Address</label>

      <input
        type="email"
        id="customer-email"
        placeholder="Enter your email"
        required
      >

      <label>Mobile Number</label>

      <input
        type="tel"
        id="customer-phone"
        placeholder="10 digit mobile number"
        pattern="[6-9][0-9]{9}"
        maxlength="10"
        required
      >

      <label>Delivery Address</label>

      <textarea
        id="customer-address"
        placeholder="Enter your full address"
        required
      ></textarea>

      <label>City</label>

      <input
        type="text"
        id="customer-city"
        placeholder="Enter your city"
        required
      >

      <label>PIN Code</label>

      <input
        type="text"
        id="customer-pincode"
        placeholder="6 digit PIN code"
        pattern="[0-9]{6}"
        maxlength="6"
        required
      >

      <label>Payment Method</label>

      <select id="payment-method" required>

        <option value="">Select Payment Method</option>

        <option value="Cash on Delivery">
          Cash on Delivery
        </option>

        <option value="UPI Payment">
          UPI Payment
        </option>

        <option value="Pay at Delivery">
          Pay at Delivery
        </option>

      </select>

      <h3 id="checkout-total">Total: ₹0</h3>

      <button type="submit" class="shop-btn">
        Place Order
      </button>

    </form>

  </div>

</div>

<!-- ORDER CONFIRMATION -->

<div id="confirmation-modal" class="product-modal">

  <div class="modal-content confirmation-content">

    <h1>🎉</h1>

    <h2>Order Placed Successfully!</h2>

    <p>Thank you for shopping with STYLEORA.</p>

    <h3 id="order-number"></h3>

    <p>Your order has been confirmed.</p>

    <button id="continue-shopping" class="shop-btn">
      Continue Shopping
    </button>

  </div>

</div>

`;

// FETCH PRODUCTS

async function fetchProducts(): Promise<void> {

  const container =
    document.querySelector<HTMLDivElement>('#product-container');

  if (!container) return;

  try {

    const categories = [
      'mens-shirts',
      'womens-dresses',
      'tops'
    ];

    const responses = await Promise.all(
      categories.map(category =>
        fetch(`https://dummyjson.com/products/category/${category}`)
      )
    );

    if (responses.some(response => !response.ok)) {
      throw new Error('Products could not be loaded');
    }

    const results: ProductResponse[] = await Promise.all(
      responses.map(response => response.json())
    );

    allProducts = results.flatMap(result => result.products);

    applyFilters();

  } catch (error) {

    console.error('API Error:', error);

    container.innerHTML =
      '<p>Products could not be loaded. Please try again.</p>';

  }

}

// DISPLAY PRODUCTS

function displayProducts(products: Product[]): void {

  const container =
    document.querySelector<HTMLDivElement>('#product-container');

  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  container.innerHTML = products.map(product => `

    <div class="product-card">

      <img src="${product.thumbnail}" alt="${product.title}">

      <h3>${product.title}</h3>

      <p>${formatINR(product.price)}</p>

      <button
        class="shop-btn details-btn"
        data-id="${product.id}"
      >
        View Details
      </button>

      <button
        class="shop-btn add-cart-btn"
        data-id="${product.id}"
      >
        Add to Cart
      </button>

    </div>

  `).join('');

}

// FILTER, SEARCH AND SORT

function applyFilters(): void {

  const searchText =
    document.querySelector<HTMLInputElement>('#search-input')
      ?.value.toLowerCase().trim() || '';

  let filteredProducts = allProducts.filter(product => {

    const matchesCategory =
      selectedCategory === 'all' ||
      product.category === selectedCategory;

    const matchesSearch =
      product.title.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;

  });

  if (selectedSort === 'low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (selectedSort === 'high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  displayProducts(filteredProducts);

}

// CATEGORY FILTER

document.querySelectorAll<HTMLButtonElement>('.filter-btn')
  .forEach(button => {

    button.addEventListener('click', () => {

      selectedCategory = button.dataset.category || 'all';

      document.querySelectorAll('.filter-btn')
        .forEach(btn => btn.classList.remove('active'));

      button.classList.add('active');

      applyFilters();

    });

  });

// CATEGORY IMAGE CLICK

document.querySelectorAll<HTMLElement>('.category')
  .forEach(category => {

    category.addEventListener('click', () => {

      selectedCategory = category.dataset.category || 'all';

      document.querySelectorAll('.filter-btn')
        .forEach(button => {

          button.classList.toggle(
            'active',
            button.dataset.category === selectedCategory
          );

        });

      applyFilters();

      document.querySelector('#collection')?.scrollIntoView({
        behavior: 'smooth'
      });

    });

  });

// SEARCH

document.querySelector<HTMLInputElement>('#search-input')
  ?.addEventListener('input', applyFilters);

// SORT

document.querySelector<HTMLSelectElement>('#sort-select')
  ?.addEventListener('change', event => {

    selectedSort =
      (event.target as HTMLSelectElement).value;

    applyFilters();

  });

// SHOP NOW

document.querySelector('#shop-now')
  ?.addEventListener('click', () => {

    document.querySelector('#collection')?.scrollIntoView({
      behavior: 'smooth'
    });

  });

// PRODUCT DETAILS AND ADD TO CART

document.querySelector('#product-container')
  ?.addEventListener('click', event => {

    const target = event.target as HTMLElement;

    const button = target.closest<HTMLButtonElement>('button');

    if (!button) return;

    const productId = Number(button.dataset.id);

    const product = allProducts.find(
      item => item.id === productId
    );

    if (!product) return;

    if (button.classList.contains('add-cart-btn')) {
      addToCart(product);
    }

    if (button.classList.contains('details-btn')) {

      const modal = document.querySelector('#product-modal');

      const details = document.querySelector('#modal-details');

      if (!modal || !details) return;

      details.innerHTML = `

        <img src="${product.thumbnail}" alt="${product.title}">

        <h2>${product.title}</h2>

        <h3>Price: ${formatINR(product.price)}</h3>

        <p>Category: ${product.category}</p>

        <p>${product.description}</p>

        <button class="shop-btn" id="modal-add-cart">
          Add to Cart
        </button>

      `;

      modal.classList.add('show');

      document.querySelector('#modal-add-cart')
        ?.addEventListener('click', () => {

          addToCart(product);

          modal.classList.remove('show');

        });

    }

  });

// ADD TO CART

function addToCart(product: Product): void {

  const existingItem = cart.find(
    item => item.product.id === product.id
  );

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      product,
      quantity: 1
    });
  }

  saveCart();

  updateCartCount();

  alert('Product added to cart successfully! ❤️');

}

// UPDATE CART COUNT

function updateCartCount(): void {

  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const countElement = document.querySelector('#cart-count');

  if (countElement) {
    countElement.textContent = String(count);
  }

}

// DISPLAY CART

function displayCart(): void {

  const cartItems =
    document.querySelector<HTMLDivElement>('#cart-items');

  const cartTotal =
    document.querySelector<HTMLHeadingElement>('#cart-total');

  const checkoutButton =
    document.querySelector<HTMLButtonElement>('#checkout-button');

  if (!cartItems || !cartTotal || !checkoutButton) return;

  checkoutButton.disabled = cart.length === 0;

  if (cart.length === 0) {

    cartItems.innerHTML = '<p>Your cart is empty!</p>';

    cartTotal.textContent = 'Total: ₹0';

    return;

  }

  cartItems.innerHTML = cart.map(item => `

    <div class="cart-item">

      <img
        src="${item.product.thumbnail}"
        alt="${item.product.title}"
      >

      <div>

        <h3>${item.product.title}</h3>

        <p>${formatINR(item.product.price)}</p>

        <button
          class="quantity-btn"
          data-id="${item.product.id}"
          data-action="decrease"
        >−</button>

        <span>${item.quantity}</span>

        <button
          class="quantity-btn"
          data-id="${item.product.id}"
          data-action="increase"
        >+</button>

        <button
          class="remove-btn"
          data-id="${item.product.id}"
        >
          Remove
        </button>

      </div>

    </div>

  `).join('');

  const total = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  cartTotal.textContent = 'Total: ' + formatINR(total);

}

// CART BUTTON

document.querySelector('#cart-button')
  ?.addEventListener('click', () => {

    displayCart();

    document.querySelector('#cart-modal')
      ?.classList.add('show');

  });

// CART QUANTITY AND REMOVE

document.querySelector('#cart-items')
  ?.addEventListener('click', event => {

    const target = event.target as HTMLElement;

    const button = target.closest<HTMLButtonElement>('button');

    if (!button) return;

    const id = Number(button.dataset.id);

    const item = cart.find(
      product => product.product.id === id
    );

    if (!item) return;

    if (button.dataset.action === 'increase') {
      item.quantity++;
    }

    if (button.dataset.action === 'decrease') {

      item.quantity--;

      if (item.quantity <= 0) {
        cart = cart.filter(
          product => product.product.id !== id
        );
      }

    }

    if (button.classList.contains('remove-btn')) {
      cart = cart.filter(
        product => product.product.id !== id
      );
    }

    saveCart();

    updateCartCount();

    displayCart();

  });

// CHECKOUT BUTTON

document.querySelector('#checkout-button')
  ?.addEventListener('click', () => {

    if (cart.length === 0) return;

    const total = cart.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );

    const checkoutTotal =
      document.querySelector('#checkout-total');

    if (checkoutTotal) {
      checkoutTotal.textContent = 'Total: ' + formatINR(total);
    }

    document.querySelector('#cart-modal')
      ?.classList.remove('show');

    document.querySelector('#checkout-modal')
      ?.classList.add('show');

  });

// PLACE ORDER

document.querySelector<HTMLFormElement>('#checkout-form')
  ?.addEventListener('submit', event => {

    event.preventDefault();

    if (cart.length === 0) return;

    const paymentMethod =
      document.querySelector<HTMLSelectElement>(
        '#payment-method'
      )?.value;

    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    const orderNumber = 'STY' + Date.now();

    const orderElement =
      document.querySelector('#order-number');

    if (orderElement) {
      orderElement.textContent = 'Order ID: ' + orderNumber;
    }

    cart = [];

    saveCart();

    updateCartCount();

    displayCart();

    document.querySelector('#checkout-modal')
      ?.classList.remove('show');

    document.querySelector('#confirmation-modal')
      ?.classList.add('show');

    document.querySelector<HTMLFormElement>('#checkout-form')
      ?.reset();

  });

// CLOSE PRODUCT MODAL

document.querySelector('#close-modal')
  ?.addEventListener('click', () => {

    document.querySelector('#product-modal')
      ?.classList.remove('show');

  });

// CLOSE CART

document.querySelector('#close-cart')
  ?.addEventListener('click', () => {

    document.querySelector('#cart-modal')
      ?.classList.remove('show');

  });

// CLOSE CHECKOUT

document.querySelector('#close-checkout')
  ?.addEventListener('click', () => {

    document.querySelector('#checkout-modal')
      ?.classList.remove('show');

  });

// CONTINUE SHOPPING

document.querySelector('#continue-shopping')
  ?.addEventListener('click', () => {

    document.querySelector('#confirmation-modal')
      ?.classList.remove('show');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

// BACKGROUND CLICK

document.querySelectorAll('.product-modal')
  .forEach(modal => {

    modal.addEventListener('click', event => {

      if (event.target === modal) {
        modal.classList.remove('show');
      }

    });

  });

// START WEBSITE

loadCart();

updateCartCount();

fetchProducts();