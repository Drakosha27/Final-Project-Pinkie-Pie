const API_BASE = "https://final-project-pinkie-pie.onrender.com/api";

const flash = document.getElementById("flash");

function showFlash(message, type = "info") {
  if (!flash) return;
  flash.textContent = message;
  flash.style.background = type === "error" ? "#b91c1c" : "#111";
  flash.classList.add("show");
  setTimeout(() => flash.classList.remove("show"), 2800);
}

function getToken() {
  return localStorage.getItem("token");
}

function getRole() {
  return localStorage.getItem("role");
}

function getEmail() {
  return localStorage.getItem("email");
}

function setAuthUI() {
  const token = getToken();
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const menuLink = document.getElementById("menuLink");
  const ordersLink = document.getElementById("ordersLink");
  const adminLink = document.getElementById("adminLink");
  const authPill = document.getElementById("authPill");
  const authEmail = document.getElementById("authEmail");
  const authRole = document.getElementById("authRole");

  if (token) {
    if (loginLink) loginLink.classList.add("hidden");
    if (registerLink) registerLink.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (menuLink) menuLink.classList.remove("hidden");
    if (ordersLink) ordersLink.classList.remove("hidden");
    if (adminLink) {
      if (getRole() === "admin") adminLink.classList.remove("hidden");
      else adminLink.classList.add("hidden");
    }
    if (authPill) authPill.classList.remove("hidden");
    if (authEmail) authEmail.textContent = getEmail() || "user";
    if (authRole) authRole.textContent = (getRole() || "user").toUpperCase();
  } else {
    if (loginLink) loginLink.classList.remove("hidden");
    if (registerLink) registerLink.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (menuLink) menuLink.classList.add("hidden");
    if (ordersLink) ordersLink.classList.add("hidden");
    if (adminLink) adminLink.classList.add("hidden");
    if (authPill) authPill.classList.add("hidden");
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      showFlash("Logged out");
      setAuthUI();
    };
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }
  return data;
}

async function handleLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);
      showFlash("Login successful");
      window.location.href = "menu.html";
    } catch (err) {
      showFlash(err.message, "error");
    }
  });
}

async function handleRegister() {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);
      showFlash("Registration successful");
      window.location.href = "index.html";
    } catch (err) {
      showFlash(err.message, "error");
    }
  });
}

function buildProductCard(product) {
  const price = Number(product.price || 0);
  const isAdmin = getRole() === "admin";
  const isFavorite = isProductFavorite(product._id);
  const div = document.createElement("div");
  div.className = "product-card";
  const adminControls = isAdmin
    ? `
      <button class="btn ghost" data-edit-product="${product._id}">Edit</button>
      <div class="edit-form hidden" data-edit-form="${product._id}">
        <input type="text" data-edit-name value="${escapeHtml(product.name)}" placeholder="Product name">
        <textarea data-edit-description rows="3" placeholder="Description">${escapeHtml(product.description || "")}</textarea>
        <input type="number" data-edit-price value="${price}" min="0" step="0.01" placeholder="Price">
        <button class="btn" data-save-product="${product._id}">Save changes</button>
      </div>
    `
    : "";
  div.innerHTML = `
    <button class="fav-btn ${isFavorite ? "active" : ""}" data-favorite-id="${product._id}" title="Toggle favorite">♡</button>
    <h3>${escapeHtml(product.name)}</h3>
    <p class="desc">${escapeHtml(product.description || "Freshly baked")}</p>
    <div class="meta">
      <span class="price" data-price="${price}">$${price.toFixed(2)}</span>
    </div>
    <div class="card-actions">
      <button class="btn" data-product-id="${product._id}" data-price="${price}">Order now</button>
      ${adminControls}
    </div>
  `;
  return div;
}

function buildAdminProductCard(product) {
  const price = Number(product.price || 0);
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <h3>${escapeHtml(product.name)}</h3>
    <p class="desc">${escapeHtml(product.description || "Freshly baked")}</p>
    <div class="meta">
      <span class="price" data-price="${price}">$${price.toFixed(2)}</span>
    </div>
    <div class="card-actions">
      <button class="btn ghost" data-edit-product="${product._id}">Edit</button>
      <div class="edit-form hidden" data-edit-form="${product._id}">
        <input type="text" data-edit-name value="${escapeHtml(product.name)}" placeholder="Product name">
        <textarea data-edit-description rows="3" placeholder="Description">${escapeHtml(product.description || "")}</textarea>
        <input type="number" data-edit-price value="${price}" min="0" step="0.01" placeholder="Price">
        <button class="btn" data-save-product="${product._id}">Save changes</button>
      </div>
    </div>
  `;
  return div;
}

async function loadProducts() {
  const menuContainer = document.getElementById("menuContainer");
  if (!menuContainer) return;

  try {
    const products = await apiRequest("/products");
    menuContainer.innerHTML = "";
    products.forEach((product) => menuContainer.appendChild(buildProductCard(product)));
    renderDailySpecial(products);
  } catch (err) {
    showFlash(err.message, "error");
  }
}

function setupProductActions() {
  const menuContainer = document.getElementById("menuContainer");
  if (!menuContainer) return;

  menuContainer.addEventListener("click", async (event) => {
    const orderButton = event.target.closest("button[data-product-id]");
    const editButton = event.target.closest("button[data-edit-product]");
    const saveButton = event.target.closest("button[data-save-product]");
    const favButton = event.target.closest("button[data-favorite-id]");
    if (!orderButton && !editButton && !saveButton && !favButton) return;

    if (favButton) {
      const productId = favButton.dataset.favoriteId;
      toggleFavorite(productId);
      favButton.classList.toggle("active");
      return;
    }

    const token = getToken();
    if (!token) {
      showFlash("Please login first", "error");
      window.location.href = "login.html";
      return;
    }

    if (orderButton) {
      const productId = orderButton.dataset.productId;
      const price = Number(orderButton.dataset.price || 0);

      try {
        await apiRequest("/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ products: [productId], totalPrice: price })
        });
        showFlash("Order placed successfully");
      } catch (err) {
        showFlash(err.message, "error");
      }
    }

    if (editButton && getRole() === "admin") {
      const productId = editButton.dataset.editProduct;
      const form = menuContainer.querySelector(`[data-edit-form="${productId}"]`);
      if (form) form.classList.toggle("hidden");
    }

    if (saveButton && getRole() === "admin") {
      const productId = saveButton.dataset.saveProduct;
      const form = menuContainer.querySelector(`[data-edit-form="${productId}"]`);
      if (!form) return;

      const nameInput = form.querySelector("[data-edit-name]");
      const descInput = form.querySelector("[data-edit-description]");
      const priceInput = form.querySelector("[data-edit-price]");
      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      const price = Number(priceInput.value);

      if (!name || !Number.isFinite(price)) {
        showFlash("Please provide valid data", "error");
        return;
      }

      try {
        await apiRequest(`/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name, description, price })
        });
        showFlash("Product updated");
        form.classList.add("hidden");
        loadProducts();
      } catch (err) {
        showFlash(err.message, "error");
      }
    }
  });
}

function setupAdminProductActions(container) {
  if (!container) return;
  if (getRole() !== "admin") return;

  container.addEventListener("click", async (event) => {
    const editButton = event.target.closest("button[data-edit-product]");
    const saveButton = event.target.closest("button[data-save-product]");
    if (!editButton && !saveButton) return;

    const token = getToken();
    if (!token) {
      showFlash("Please login first", "error");
      return;
    }

    if (editButton) {
      const productId = editButton.dataset.editProduct;
      const form = container.querySelector(`[data-edit-form="${productId}"]`);
      if (form) form.classList.toggle("hidden");
      return;
    }

    if (saveButton) {
      const productId = saveButton.dataset.saveProduct;
      const form = container.querySelector(`[data-edit-form="${productId}"]`);
      if (!form) return;

      const nameInput = form.querySelector("[data-edit-name]");
      const descInput = form.querySelector("[data-edit-description]");
      const priceInput = form.querySelector("[data-edit-price]");
      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      const price = Number(priceInput.value);

      if (!name || !Number.isFinite(price)) {
        showFlash("Please provide valid data", "error");
        return;
      }

      try {
        await apiRequest(`/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name, description, price })
        });
        showFlash("Product updated");
        form.classList.add("hidden");
        loadAdminProducts();
      } catch (err) {
        showFlash(err.message, "error");
      }
    }
  });
}

function setupFilters() {
  const searchInput = document.getElementById("search");
  const priceInput = document.getElementById("price");
  if (!searchInput || !priceInput) return;

  function filterProducts() {
    const term = searchInput.value.trim().toLowerCase();
    const maxPrice = Number(priceInput.value);

    document.querySelectorAll(".product-card").forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const price = Number(card.querySelector(".price").dataset.price || 0);
      const matches = title.includes(term) && (!maxPrice || price <= maxPrice);
      card.style.display = matches ? "flex" : "none";
    });
  }

  searchInput.addEventListener("input", filterProducts);
  priceInput.addEventListener("input", filterProducts);
}

async function loadOrders() {
  const ordersContainer = document.getElementById("ordersContainer");
  if (!ordersContainer) return;

  const token = getToken();
  if (!token) {
    ordersContainer.innerHTML = "<div class=\"order-card\">Please login to view your orders.</div>";
    return;
  }

  try {
    const isAdmin = getRole() === "admin";
    const orders = await apiRequest(isAdmin ? "/orders/all" : "/orders", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!orders.length) {
      ordersContainer.innerHTML = "<div class=\"order-card\">No orders yet.</div>";
      return;
    }

    ordersContainer.innerHTML = orders.map((order) => {
      const items = (order.products || []).map((p) => p.name).join(", ") || "-";
      const userLine = isAdmin && order.user ? `<div><strong>User:</strong> ${escapeHtml(order.user.email)}</div>` : "";
      const statusControl = isAdmin
        ? `<label class="status-row">
            <span>Status:</span>
            <select data-order-status="${order._id}">
              <option value="pending" ${order.status === "pending" ? "selected" : ""}>pending</option>
              <option value="completed" ${order.status === "completed" ? "selected" : ""}>completed</option>
            </select>
          </label>`
        : `<div><strong>Status:</strong> ${order.status}</div>`;
      return `
        <div class="order-card">
          <div><strong>Order:</strong> ${order._id}</div>
          ${userLine}
          ${statusControl}
          <div><strong>Total:</strong> $${Number(order.totalPrice || 0).toFixed(2)}</div>
          <div><strong>Items:</strong> ${escapeHtml(items)}</div>
        </div>
      `;
    }).join("");
  } catch (err) {
    showFlash(err.message, "error");
  }
}

function setupAdminPanel() {
  const panel = document.getElementById("adminPanel");
  const form = document.getElementById("adminProductForm");
  if (!panel || !form) return;

  if (getRole() === "admin") {
    panel.classList.add("show");
  } else {
    panel.classList.remove("show");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      showFlash("Please login first", "error");
      return;
    }

    const name = document.getElementById("productName").value.trim();
    const description = document.getElementById("productDescription").value.trim();
    const price = Number(document.getElementById("productPrice").value);

    try {
      await apiRequest("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, price })
      });
      showFlash("Product created");
      form.reset();
      loadProducts();
    } catch (err) {
      showFlash(err.message, "error");
    }
  });
}

function setupAdminOrderActions() {
  const ordersContainer = document.getElementById("ordersContainer");
  if (!ordersContainer) return;
  if (getRole() !== "admin") return;

  ordersContainer.addEventListener("change", async (event) => {
    const select = event.target.closest("select[data-order-status]");
    if (!select) return;

    const token = getToken();
    if (!token) return;

    const orderId = select.dataset.orderStatus;
    const status = select.value;

    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      showFlash("Order status updated");
    } catch (err) {
      showFlash(err.message, "error");
    }
  });
}

function renderDailySpecial(products) {
  const dailySpecial = document.getElementById("dailySpecial");
  if (!dailySpecial) return;
  if (!products || !products.length) {
    dailySpecial.textContent = "Fresh batches all day.";
    return;
  }
  const pick = products[Math.floor(Math.random() * products.length)];
  dailySpecial.textContent = `${pick.name} · $${Number(pick.price || 0).toFixed(2)}`;
}

async function loadDailySpecial() {
  const dailySpecial = document.getElementById("dailySpecial");
  if (!dailySpecial) return;

  try {
    const products = await apiRequest("/products");
    renderDailySpecial(products);
  } catch {
    dailySpecial.textContent = "Fresh batches all day.";
  }
}

async function loadAdminProducts() {
  const container = document.getElementById("adminProductsContainer");
  if (!container) return;
  if (getRole() !== "admin") {
    container.innerHTML = "<div class=\"order-card\">Admin access required.</div>";
    return;
  }

  try {
    const products = await apiRequest("/products");
    container.innerHTML = "";
    products.forEach((product) => container.appendChild(buildAdminProductCard(product)));
  } catch (err) {
    showFlash(err.message, "error");
  }
}

function setupAdminAccessGate() {
  const isAdminPage = window.location.pathname.toLowerCase().endsWith("/admin.html");
  if (!isAdminPage) return;
  if (getRole() !== "admin") {
    showFlash("Admin access required", "error");
    window.location.href = "index.html";
  }
}

function setupHeaderActions() {
  const themeToggle = document.getElementById("themeToggle");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") document.body.classList.add("theme-dark");

  if (themeToggle) {
    themeToggle.classList.add("icon-btn");
    themeToggle.setAttribute("aria-label", "Toggle theme");
    themeToggle.textContent = document.body.classList.contains("theme-dark") ? "🌙" : "☀️";
  }

  if (themeToggle) {
    themeToggle.onclick = () => {
      document.body.classList.toggle("theme-dark");
      localStorage.setItem("theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
      themeToggle.textContent = document.body.classList.contains("theme-dark") ? "🌙" : "☀️";
    };
  }

  if (scrollTopBtn) {
    scrollTopBtn.onclick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function isProductFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index >= 0) favorites.splice(index, 1);
  else favorites.push(id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

async function loadFavorites() {
  const container = document.getElementById("favoritesContainer");
  if (!container) return;
  const favoriteIds = getFavorites();
  if (!favoriteIds.length) {
    container.innerHTML = "<div class=\"order-card\">No favorites yet. Add some from the menu.</div>";
    return;
  }

  try {
    const products = await apiRequest("/products");
    const favorites = products.filter((p) => favoriteIds.includes(p._id));
    container.innerHTML = "";
    favorites.forEach((product) => container.appendChild(buildProductCard(product)));
  } catch (err) {
    showFlash(err.message, "error");
  }
}

function setupFaq() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;
  items.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;
    button.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });
}

function setupProfile() {
  const emailEl = document.getElementById("profileEmail");
  const roleEl = document.getElementById("profileRole");
  if (emailEl) emailEl.textContent = getEmail() || "-";
  if (roleEl) roleEl.textContent = (getRole() || "user").toUpperCase();

  const ordersBtn = document.getElementById("goToOrders");
  const menuBtn = document.getElementById("goToMenu");
  if (ordersBtn) ordersBtn.onclick = () => window.location.href = "orders.html";
  if (menuBtn) menuBtn.onclick = () => window.location.href = "menu.html";
}

function setupContact() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();
    if (!name || !email || !message) {
      showFlash("Please fill in all fields", "error");
      return;
    }
    showFlash("Message sent! We'll reply soon.");
    form.reset();
  });
}

setAuthUI();
setupAdminAccessGate();
setupHeaderActions();
handleLogin();
handleRegister();
loadProducts();
loadDailySpecial();
setupProductActions();
setupFilters();
loadOrders();
setupAdminPanel();
setupAdminOrderActions();
loadAdminProducts();
setupAdminProductActions(document.getElementById("adminProductsContainer"));
loadFavorites();
setupFaq();
setupProfile();
setupContact();

