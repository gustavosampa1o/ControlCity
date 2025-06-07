// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userType = document.getElementById('userType').value;
            
            // Simple demo authentication
            if (email === 'admin@controlcity.com' && password === 'demo123') {
                // Store user session
                localStorage.setItem('controlcity_user', JSON.stringify({
                    email: email,
                    userType: userType,
                    loginTime: new Date().toISOString()
                }));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Credenciais inválidas. Use: admin@controlcity.com / demo123');
            }
        });
    }
    
    // Check if user is already logged in
    checkAuth();
});

function checkAuth() {
    const user = localStorage.getItem('controlcity_user');
    const currentPage = window.location.pathname;
    
    if (!user && !currentPage.includes('index.html') && currentPage !== '/') {
        window.location.href = 'index.html';
    } else if (user && (currentPage.includes('index.html') || currentPage === '/')) {
        window.location.href = 'dashboard.html';
    }
}

function logout() {
    localStorage.removeItem('controlcity_user');
    window.location.href = 'index.html';
}

// Export for use in other files
window.logout = logout;
window.checkAuth = checkAuth;