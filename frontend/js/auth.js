document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Redirect to dashboard if already logged in
        window.location.href = 'index.html';
        return;
    }

    // DOM elements
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            const tabName = this.getAttribute('data-tab');
            this.classList.add('active');
            document.getElementById(`${tabName}-form`).classList.add('active');
            
            // Clear error messages
            loginError.textContent = '';
            registerError.textContent = '';
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        // Validate inputs
        if (!username || !password) {
            loginError.textContent = 'Please enter both username and password';
            return;
        }
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        // Send login request
        const loginUrl = `${window.API_BASE_URL || '/api'}/users/login`;
        console.log('Login URL:', loginUrl);
        
        fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            mode: 'cors',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        })
        .catch(error => {
            loginError.textContent = error.message;
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    });

    // Register form submission
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const displayName = document.getElementById('register-display-name').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm-password').value.trim();
        
        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            registerError.textContent = 'Please fill in all required fields';
            return;
        }
        
        if (password !== confirmPassword) {
            registerError.textContent = 'Passwords do not match';
            return;
        }
        
        if (password.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters long';
            return;
        }
        
        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        
        // Send register request
        const registerUrl = `${window.API_BASE_URL || '/api'}/users/register`;
        console.log('Register URL:', registerUrl);
        
        fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                displayName: displayName || username
            }),
            mode: 'cors',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Registration failed');
                });
            }
            return response.json();
        })
        .then(data => {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        })
        .catch(error => {
            registerError.textContent = error.message;
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    });

    // Add password visibility toggle
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
        
        input.parentNode.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });

    // Add form animations
    authForms.forEach(form => {
        form.querySelectorAll('.form-group').forEach((group, index) => {
            group.style.animation = `fadeInUp 0.4s ease-out forwards ${index * 0.1}s`;
            group.style.opacity = '0';
        });
    });

    // Add keypress event for Enter key
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const activeForm = document.querySelector('.auth-form.active');
            if (activeForm) {
                const submitBtn = activeForm.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        }
    });
});