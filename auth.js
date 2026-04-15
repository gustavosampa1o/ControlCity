function autenticar(email, password, userType) {
    if (email === 'admin@controlcity.com' && password === 'demo123') {
        return {
            sucesso: true,
            user: {
                email,
                userType,
                loginTime: new Date().toISOString()
            }
        };
    }

    return { sucesso: false };
}

// só roda no navegador
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        const loginForm = document.getElementById('loginForm');

        if (!loginForm) return;

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userType = document.getElementById('userType').value;

            const result = autenticar(email, password, userType);

            if (result.sucesso) {
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Credenciais inválidas');
            }
        });
    });
}

module.exports = { autenticar };