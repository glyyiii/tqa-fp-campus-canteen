const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('role', data.role);
                localStorage.setItem('username', username);
                
                // Redirect based on role
                if (data.role === 'staff') {
                    window.location.href = 'staff.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                // Show the red error message if login fails
                errorMsg.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to connect to backend. Is Uvicorn running?");
        }
    });
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}