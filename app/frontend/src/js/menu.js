const menuContainer = document.getElementById('menu-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartBadge = document.getElementById('cart-badge');
const searchInput = document.getElementById('search-input');
const priceRange = document.getElementById('price-range');
const priceLabel = document.getElementById('price-label');
const sortSelect = document.getElementById('sort-select');
const categoryFilters = document.querySelectorAll('.category-filter');

let allMenuItems = [];
let filteredItems = [];
let cart = [];

if (!localStorage.getItem('user_id')) { window.location.href = 'login.html'; }

// Mapped exactly to the images you provided!
const foodImages = {
    "Pancit Canton": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP9tdz6D7h654AGnuk8e6TAail2a6mQFU3pusfIYXYAClgwmt7o3qYM0Dh&s=10",
    "Fried Chicken": "https://www.butterbeready.com/wp-content/uploads/2023/06/DK6A2529.jpg",
    "Fried Rice": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHBPBb_6sJTmoGm1MMImvM1JZqdIMilngnKCaCvd4SOi4RSBilCRElIUod&s=10",
    "Siopao": "https://www.kawalingpinoy.com/wp-content/uploads/2020/07/siopao-asado-4.jpg",
    "Lumpia": "https://hermanathome.com/wp-content/uploads/2025/09/Banana-Lumpia-Turon-Featured.jpg",
    "Coke Mismo": "https://ph-test-11.slatic.net/p/a6890dbf5b4c0e6357fcaf5ffacb82fe.jpg",
    "C2 Green Tea": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGYJEGDkzUxM-JCnuH_2zGcg8omdilruiDRSMckfprbt6xm5Y0dQ6qBxs&s=80",
    "Iced Coffee": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80",
    "Puto": "https://thumbs.dreamstime.com/b/basket-philippine-rice-cakes-puto-filipino-steamed-rice-cakes-traditionally-made-slightly-fermented-rice-dough-194855057.jpg",
    "Spaghetti": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLlaGc0gYlhQB1HKe_n23n48EgS8VqGHTpUgN9X6PjIw&s=10",
    "Pinaypay Banana": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqvL28BtAX1CPhhu6q0Emt0lgCtXbQToAdDZFH6oFrvQ&s=10"
};
const defaultImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";

// Helper to categorize items properly
function getCategory(name) {
    if (["Coke Mismo", "C2 Green Tea", "Iced Coffee"].includes(name)) return "Drinks";
    if (["Puto", "Siopao", "Lumpia", "Pinaypay Banana"].includes(name)) return "Snacks";
    return "Meals"; // Pancit, Chicken, Rice, Spaghetti, Fried Rice
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const bg = type === 'success' ? 'bg-dark' : 'bg-red-600';
    toast.className = `${bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transform transition-all duration-300 -translate-y-5 opacity-0 font-medium`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle text-green-400' : 'fa-circle-exclamation'} text-lg"></i> ${message}`;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.classList.remove('-translate-y-5', 'opacity-0'), 10);
    setTimeout(() => { toast.classList.add('opacity-0', '-translate-y-5'); setTimeout(() => toast.remove(), 300); }, 3000);
}

async function loadMenu() {
    try {
        const response = await fetch('http://localhost:8000/api/menu');
        allMenuItems = await response.json();
        applyFilters();
    } catch (error) { console.error(error); }
}

function applyFilters() {
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCategories = Array.from(categoryFilters).filter(cb => cb.checked).map(cb => cb.value);
    const maxPrice = parseFloat(priceRange.value);

    filteredItems = allMenuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(term);
        const category = getCategory(item.name);
        const matchesCategory = selectedCategories.includes(category);
        const matchesPrice = item.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const sortValue = sortSelect.value;
    if (sortValue === 'price-asc') {
        filteredItems.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        filteredItems.sort((a, b) => b.price - a.price);
    } else {
        filteredItems.sort((a, b) => a.id - b.id);
    }

    renderMenu(filteredItems);
}

function renderMenu(items) {
    menuContainer.innerHTML = '';
    if(items.length === 0) {
        menuContainer.innerHTML = `<div class="col-span-full text-center py-10 text-gray-400"><i class="fa-solid fa-box-open text-4xl mb-3"></i><p>No items match your filters.</p></div>`;
        return;
    }
    items.forEach(item => {
        const isOutOfStock = item.stock <= 0;
        const imgUrl = foodImages[item.name] || defaultImg;
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col';
        card.innerHTML = `
            <div class="relative h-56 overflow-hidden bg-gray-100">
                <img src="${imgUrl}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <button class="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-500 hover:text-red-500 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition"><i class="fa-regular fa-heart"></i></button>
                ${isOutOfStock ? `<div class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center"><span class="bg-red-500 text-white font-bold px-5 py-2 rounded-full text-sm shadow-lg">Sold Out</span></div>` : ''}
            </div>
            <div class="p-6 flex flex-col flex-1">
                <div class="flex justify-between items-start mb-2"><h3 class="font-bold text-xl text-dark">${item.name}</h3></div>
                <p class="text-sm text-gray-500 mb-5 flex-1">Freshly prepared daily.</p>
                <div class="flex items-center justify-between mt-auto">
                    <span class="text-2xl font-bold text-dark">₱${item.price.toFixed(2)}</span>
                    <button onclick="addToCart(${item.id})" ${isOutOfStock ? 'disabled' : ''} class="w-11 h-11 rounded-full flex items-center justify-center transition-all ${isOutOfStock ? 'bg-gray-100 text-gray-400' : 'bg-brand text-white hover:bg-brand-dark shadow-md hover:shadow-lg hover:scale-105'}"><i class="fa-solid fa-plus text-lg"></i></button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

if (searchInput) searchInput.addEventListener('input', applyFilters);
if (priceRange) {
    priceRange.addEventListener('input', (e) => {
        priceLabel.textContent = `₱${e.target.value}`;
        applyFilters();
    });
}
if (sortSelect) sortSelect.addEventListener('change', applyFilters);
categoryFilters.forEach(cb => cb.addEventListener('change', applyFilters));

function resetFilters() {
    if(searchInput) searchInput.value = '';
    priceRange.value = 100;
    priceLabel.textContent = '₱100+';
    sortSelect.value = 'popular';
    categoryFilters.forEach(cb => cb.checked = true);
    applyFilters();
}

function addToCart(itemId) {
    const item = allMenuItems.find(i => i.id === itemId);
    const existing = cart.find(c => c.id === itemId);
    if (existing) { if (existing.qty >= item.stock) return showToast('Max stock reached!', 'error'); existing.qty++; } else { cart.push({ ...item, qty: 1 }); }
    updateCartUI(); showToast(`${item.name} added to cart`);
}

function updateCartUI() {
    cartItemsContainer.innerHTML = ''; let total = 0; let count = 0;
    cart.forEach((item, index) => {
        total += item.price * item.qty; count += item.qty;
        cartItemsContainer.innerHTML += `
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-sm"><img src="${foodImages[item.name] || defaultImg}" class="w-full h-full object-cover"></div>
                    <div><p class="font-bold text-dark">${item.name}</p><p class="text-sm text-brand font-semibold">₱${item.price.toFixed(2)}</p></div>
                </div>
                <div class="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                    <button onclick="updateQty(${index}, -1)" class="text-gray-400 hover:text-red-500 px-1"><i class="fa-solid fa-minus text-xs"></i></button>
                    <span class="text-sm font-bold w-4 text-center text-dark">${item.qty}</span>
                    <button onclick="updateQty(${index}, 1)" class="text-gray-400 hover:text-brand px-1"><i class="fa-solid fa-plus text-xs"></i></button>
                </div>
            </div>
        `;
    });
    if (cart.length === 0) cartItemsContainer.innerHTML = '<div class="text-center text-gray-400 mt-20"><i class="fa-solid fa-bag-shopping text-6xl mb-4 text-gray-200"></i><p class="text-lg">Your cart is empty.</p></div>';
    cartTotalEl.textContent = `₱${total.toFixed(2)}`; cartBadge.textContent = count; cartBadge.classList.toggle('hidden', count === 0);
}

function updateQty(index, change) { cart[index].qty += change; if (cart[index].qty <= 0) cart.splice(index, 1); updateCartUI(); }
function toggleCart() { const p = document.getElementById('cart-panel'); const o = document.getElementById('cart-overlay'); if (p.classList.contains('translate-x-full')) { p.classList.remove('translate-x-full'); o.classList.remove('hidden'); } else { p.classList.add('translate-x-full'); o.classList.add('hidden'); } }

async function checkout() {
    if (cart.length === 0) return showToast('Cart is empty', 'error');
    const userId = localStorage.getItem('user_id');
    try {
        for (const item of cart) await fetch('http://localhost:8000/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ student_id: parseInt(userId), item_id: item.id, quantity: item.qty }) });
        cart = []; updateCartUI(); toggleCart(); showToast('Pre-order placed!'); loadMenu();
    } catch (error) { showToast('Checkout failed', 'error'); }
}
loadMenu();