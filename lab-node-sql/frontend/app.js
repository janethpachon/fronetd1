// app.js - DevMarket Frontend Logic
const API_URL = 'http://localhost:3000/api';

let currentUser = null;
let cart = [];
let allProducts = [];

// =============== HU-01: AUTENTICACIÓN ===============

// Elementos del DOM
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleRegister = document.getElementById('toggleRegister');
const toggleLogin = document.getElementById('toggleLogin');
const btnLogout = document.getElementById('btnLogout');
const userEmail = document.getElementById('userEmail');

// Toggle entre login y registro
toggleRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  document.getElementById('authTitle').textContent = 'Crear Cuenta';
});

toggleLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
  document.getElementById('authTitle').textContent = 'Iniciar Sesión';
});

// Registro de usuario
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const Email = document.getElementById('registerEmail').value;
  const FullName = document.getElementById('registerName').value;
  const Password = document.getElementById('registerPassword').value;
  const PasswordConfirm = document.getElementById('registerPasswordConfirm').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email, FullName, Password, PasswordConfirm })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`Error: ${data.error}`);
      return;
    }

    alert('Registro exitoso. Ahora inicia sesión.');
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    registerForm.reset();
    document.getElementById('authTitle').textContent = 'Iniciar Sesión';
  } catch (error) {
    console.error('Error en registro:', error);
    alert('Error al registrar');
  }
});

// Inicio de sesión
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const Email = document.getElementById('loginEmail').value;
  const Password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email, Password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`Error: ${data.error}`);
      return;
    }

    // Guardar usuario actual
    currentUser = data.user;
    localStorage.setItem('user', JSON.stringify(currentUser));

    // Actualizar interfaz
    showApp();
  } catch (error) {
    console.error('Error en login:', error);
    alert('Error al iniciar sesión');
  }
});

// Cerrar sesión
btnLogout.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('user');
  cart = [];
  localStorage.removeItem('cart');
  showAuth();
});

// Mostrar sección de autenticación
function showAuth() {
  authSection.style.display = 'flex';
  appSection.style.display = 'none';
  btnLogout.style.display = 'none';
  userEmail.style.display = 'none';
  document.getElementById('btnCart').style.display = 'none';
  loginForm.reset();
  registerForm.reset();
}

// Mostrar sección de aplicación
function showApp() {
  authSection.style.display = 'none';
  appSection.style.display = 'block';
  btnLogout.style.display = 'inline-block';
  userEmail.style.display = 'inline-block';
  userEmail.textContent = `👤 ${currentUser.FullName}`;
  document.getElementById('btnCart').style.display = 'inline-block';
  loadProducts();
  loadFilters();
  loadCart();
}

// =============== HU-02: PRODUCTOS Y CARRITO ===============

const productsGrid = document.getElementById('productsGrid');
const noProducts = document.getElementById('noProducts');
const filterCategory = document.getElementById('filterCategory');
const filterTechnology = document.getElementById('filterTechnology');
const filterDifficulty = document.getElementById('filterDifficulty');
const btnFilter = document.getElementById('btnFilter');
const btnClearFilters = document.getElementById('btnClearFilters');
const btnCart = document.getElementById('btnCart');
const cartSidebar = document.getElementById('cartSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const overlay = document.getElementById('overlay');

// Cargar todos los productos
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    allProducts = data.products || [];
    displayProducts(allProducts);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    alert('Error al cargar productos');
  }
}

// Cargar filtros
async function loadFilters() {
  try {
    // Cargar categorías
    const catResponse = await fetch(`${API_URL}/products/categories/all`);
    const catData = await catResponse.json();
    const categories = catData.categories || [];

    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.CategoryID;
      option.textContent = cat.CategoryName;
      filterCategory.appendChild(option);
    });

    // Cargar tecnologías
    const techResponse = await fetch(`${API_URL}/products/technologies/all`);
    const techData = await techResponse.json();
    const technologies = techData.technologies || [];

    technologies.forEach(tech => {
      const option = document.createElement('option');
      option.value = tech;
      option.textContent = tech;
      filterTechnology.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar filtros:', error);
  }
}

// Mostrar productos
function displayProducts(products) {
  productsGrid.innerHTML = '';

  if (products.length === 0) {
    noProducts.style.display = 'block';
    return;
  }

  noProducts.style.display = 'none';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-header">
        <h3>${product.ProductName}</h3>
        <span class="product-category">${product.Category?.CategoryName || 'Sin categoría'}</span>
      </div>
      <div class="product-body">
        <p class="product-description">${product.Description || 'Sin descripción'}</p>
        <div class="product-tags">
          <span class="tag ${product.DifficultyLevel}">${product.DifficultyLevel || 'N/A'}</span>
          <span class="tag">${product.Technology || 'N/A'}</span>
        </div>
      </div>
      <div class="product-footer">
        <span class="price">$${parseFloat(product.Price).toFixed(2)}</span>
        <button class="btn btn-primary">Ver Detalles</button>
      </div>
    `;

    card.querySelector('.btn-primary').addEventListener('click', () => {
      showProductModal(product);
    });

    productsGrid.appendChild(card);
  });
}

// Mostrar modal de producto
function showProductModal(product) {
  document.getElementById('productModalTitle').textContent = product.ProductName;
  document.getElementById('productDescription').textContent = product.Description || 'Sin descripción';
  document.getElementById('productTechnology').textContent = product.Technology || 'N/A';
  document.getElementById('productLevel').textContent = product.DifficultyLevel || 'N/A';
  document.getElementById('productCategory').textContent = product.Category?.CategoryName || 'Sin categoría';
  document.getElementById('productPrice').textContent = `$${parseFloat(product.Price).toFixed(2)}`;

  document.getElementById('addToCartBtn').onclick = () => {
    addToCart(product.ProductID, product.ProductName, product.Price);
  };

  productModal.style.display = 'flex';
  overlay.style.display = 'block';
}

// Cerrar modal
closeModal.addEventListener('click', closeAllModals);
overlay.addEventListener('click', closeAllModals);

function closeAllModals() {
  productModal.style.display = 'none';
  overlay.style.display = 'none';
}

// Filtrar productos
btnFilter.addEventListener('click', () => {
  const categoryId = filterCategory.value;
  const technology = filterTechnology.value;
  const difficulty = filterDifficulty.value;

  let filtered = allProducts;

  if (categoryId) {
    filtered = filtered.filter(p => p.CategoryID == categoryId);
  }
  if (technology) {
    filtered = filtered.filter(p => p.Technology === technology);
  }
  if (difficulty) {
    filtered = filtered.filter(p => p.DifficultyLevel === difficulty);
  }

  displayProducts(filtered);
});

// Limpiar filtros
btnClearFilters.addEventListener('click', () => {
  filterCategory.value = '';
  filterTechnology.value = '';
  filterDifficulty.value = '';
  displayProducts(allProducts);
});

// =============== CARRITO ===============

// Agregar al carrito
function addToCart(productId, productName, price) {
  const item = cart.find(i => i.productId === productId);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      productId,
      productName,
      price,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  closeAllModals();
  alert(`${productName} agregado al carrito`);
}

// Actualizar interfaz del carrito
function updateCartUI() {
  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartItems.innerHTML = '';
  } else {
    emptyCart.style.display = 'none';
    cartItems.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-name">${item.productName}</div>
        <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} x ${item.quantity}</div>
        <div class="cart-item-actions">
          <button class="btn btn-secondary" onclick="decrementCart(${index})">-</button>
          <button class="btn btn-danger" onclick="removeFromCart(${index})">Eliminar</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
}

// Decrementar cantidad
function decrementCart(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    removeFromCart(index);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Eliminar del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Mostrar/ocultar carrito
btnCart.addEventListener('click', () => {
  cartSidebar.classList.toggle('open');
  overlay.style.display = cartSidebar.classList.contains('open') ? 'block' : 'none';
});

closeSidebar.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
  overlay.style.display = 'none';
});

// Procesar compra
document.getElementById('btnCheckout').addEventListener('click', async () => {
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ UserID: currentUser.UserID })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`Error: ${data.error}`);
      return;
    }

    alert('¡Compra realizada con éxito! Gracias por tu compra.');
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
    cartSidebar.classList.remove('open');
    overlay.style.display = 'none';
  } catch (error) {
    console.error('Error al procesar compra:', error);
    alert('Error al procesar compra');
  }
});

// Cargar carrito saved
function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    cart = JSON.parse(saved);
  }
  updateCartUI();
}

// =============== IA ASSISTANT (BÚSQUEDA Y RECOMENDACIONES) ===============

// Elementos del IA
const iaQuestion = document.getElementById('iaQuestion');
const btnAskIA = document.getElementById('btnAskIA');
const iaResponses = document.getElementById('iaResponses');
const recTechnology = document.getElementById('recTechnology');
const recDifficulty = document.getElementById('recDifficulty');
const btnGetRecommendations = document.getElementById('btnGetRecommendations');
const recommendationsResult = document.getElementById('recommendationsResult');
const recommendationsText = document.getElementById('recommendationsText');

// Enviar pregunta a la IA
btnAskIA.addEventListener('click', async () => {
  const question = iaQuestion.value.trim();
  
  if (!question) {
    alert('Por favor escribe una pregunta');
    return;
  }

  // Mostrar pregunta del usuario en el chat
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'ia-message user';
  userMsgDiv.innerHTML = `<p>${question}</p>`;
  iaResponses.appendChild(userMsgDiv);

  // Mostrar indicador de carga
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'ia-message bot';
  loadingDiv.innerHTML = '<div class="ia-loading"></div>';
  iaResponses.appendChild(loadingDiv);
  iaResponses.scrollTop = iaResponses.scrollHeight;

  iaQuestion.value = '';
  btnAskIA.disabled = true;
  btnAskIA.textContent = 'Enviando...';

  try {
    const response = await fetch(`${API_URL}/products/ia/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    // Remover indicador de carga
    iaResponses.removeChild(loadingDiv);

    if (!response.ok) {
      const botMsgDiv = document.createElement('div');
      botMsgDiv.className = 'ia-message bot';
      botMsgDiv.innerHTML = `<p style="color: #dc3545;">Error: ${data.error || 'No se pudo procesar tu pregunta'}</p>`;
      iaResponses.appendChild(botMsgDiv);
    } else {
      // Mostrar respuesta de la IA
      const botMsgDiv = document.createElement('div');
      botMsgDiv.className = 'ia-message bot';
      botMsgDiv.innerHTML = `<p>${data.answer}</p>`;
      iaResponses.appendChild(botMsgDiv);
    }

    iaResponses.scrollTop = iaResponses.scrollHeight;
  } catch (error) {
    console.error('Error:', error);
    iaResponses.removeChild(loadingDiv);
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'ia-message bot';
    botMsgDiv.innerHTML = `<p style="color: #dc3545;">Error de conexión. Por favor intenta de nuevo.</p>`;
    iaResponses.appendChild(botMsgDiv);
    iaResponses.scrollTop = iaResponses.scrollHeight;
  } finally {
    btnAskIA.disabled = false;
    btnAskIA.textContent = 'Enviar';
  }
});

// Permitir enviar con Enter
iaQuestion.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !btnAskIA.disabled) {
    btnAskIA.click();
  }
});

// Obtener recomendaciones de la IA
btnGetRecommendations.addEventListener('click', async () => {
  const technology = recTechnology.value;
  const difficulty = recDifficulty.value;

  if (!technology && !difficulty) {
    alert('Por favor selecciona al menos una tecnología o nivel de dificultad');
    return;
  }

  btnGetRecommendations.disabled = true;
  btnGetRecommendations.textContent = 'Cargando...';
  recommendationsResult.style.display = 'none';

  try {
    const params = new URLSearchParams();
    if (technology) params.append('technology', technology);
    if (difficulty) params.append('difficulty', difficulty);

    const response = await fetch(`${API_URL}/products/ia/recommendations?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (!response.ok) {
      recommendationsText.innerHTML = `<strong style="color: #dc3545;">Error: ${data.error || 'No se pudo obtener recomendaciones'}</strong>`;
    } else {
      recommendationsText.innerHTML = `<strong>Recomendación IA:</strong><br>${data.recommendation}`;
    }

    recommendationsResult.style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
    recommendationsText.innerHTML = '<strong style="color: #dc3545;">Error de conexión. Por favor intenta de nuevo.</strong>';
    recommendationsResult.style.display = 'block';
  } finally {
    btnGetRecommendations.disabled = false;
    btnGetRecommendations.textContent = 'Recomendar';
  }
});

// Cargar tecnologías en el selector de recomendaciones
async function loadRecommendationTechnologies() {
  try {
    const response = await fetch(`${API_URL}/products/technologies`);
    const technologies = await response.json();

    technologies.forEach(tech => {
      const option = document.createElement('option');
      option.value = tech;
      option.textContent = tech;
      recTechnology.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando tecnologías:', error);
  }
}

// Verificar si hay usuario logeado al cargar la página
window.addEventListener('load', () => {
  const saved = localStorage.getItem('user');
  if (saved) {
    currentUser = JSON.parse(saved);
    showApp();
    loadRecommendationTechnologies();
  }
});