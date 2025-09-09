// Handles authentication logic (login, signup, logout)
// Portfolio-ready: AJAX login/signup, error handling, redirect

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginMsg = document.getElementById('login-message');
    const signupMsg = document.getElementById('signup-message');

    if (loginForm) {
        loginForm.onsubmit = e => {
            e.preventDefault();
            loginMsg.textContent = '';
            const fd = new FormData(loginForm);
            fd.append('action', 'login');
            fetch('api.php', {method:'POST', body:fd})
                .then(r=>r.json()).then(data => {
                    if (data.status === 'success') {
                        window.location = 'dashboard.php';
                    } else {
                        loginMsg.textContent = data.message;
                    }
                });
        };
    }
    if (signupForm) {
        signupForm.onsubmit = e => {
            e.preventDefault();
            signupMsg.textContent = '';
            const fd = new FormData(signupForm);
            fd.append('action', 'signup');
            fetch('api.php', {method:'POST', body:fd})
                .then(r=>r.json()).then(data => {
                    if (data.status === 'success') {
                        window.location = 'dashboard.php';
                    } else {
                        signupMsg.textContent = data.message;
                    }
                });
        };
    }
});
