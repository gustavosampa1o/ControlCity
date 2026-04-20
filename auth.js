async function autenticar(email, password) {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
}

// só roda no navegador
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        const loginForm = document.getElementById('loginForm');

        if (!loginForm) return;

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const result = await autenticar(email, password);

            if (result.sucesso) {
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Credenciais inválidas');
            }
        });
    });
}

export { autenticar };