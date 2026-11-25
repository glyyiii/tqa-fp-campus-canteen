const menuContainer = document.getElementById('menu-container');
const userDisplay = document.getElementById('user-display');

if (!localStorage.getItem('user_id')) {
    window.location.href = 'login.html';
} else {
    userDisplay.textContent = localStorage.getItem('username') + ' (' + localStorage.getItem('role') + ')';
}

async function loadMenu() {
    try {
        const response = await fetch('http://localhost:8000/api/menu');
        const menuItems = await response.json();

        menuContainer.innerHTML = '';
        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex justify-between items-center';
            card.innerHTML = `
                <div>
                    <h3 class="font-bold text-lg">${item.name}</h3>
                    <p class="text-gray-600">Stock: ${item.stock}</p>
                </div>
                <div class="text-right">
                    <p class="text-blue-600 font-bold mb-2">₱${item.price}</p>
                    <button onclick="orderItem(${item.id})" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Order</button>
                </div>
            `;
            menuContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

async function orderItem(itemId) {
    const userId = localStorage.getItem('user_id');
    try {
        const response = await fetch('http://localhost:8000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: parseInt(userId), item_id: itemId, quantity: 1 })
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Order placed! Total: ₱${data.total}`);
            loadMenu(); // Refresh the menu to show updated stock
        } else {
            alert(`Error: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error placing order:', error);
    }
}

loadMenu();