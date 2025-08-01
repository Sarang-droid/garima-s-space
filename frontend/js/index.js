document.addEventListener('DOMContentLoaded', function() {
    // This file will initialize all the components for the homepage
    // All the heavy lifting is done in the individual component files
    
    // Add a subtle animation to the welcome message
    const welcomeMessage = document.querySelector('.welcome-message p');
    if (welcomeMessage) {
        welcomeMessage.style.animation = 'fadeIn 1s ease-out forwards';
    }
    
    // Add hover effects to navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Add a subtle pulse animation to the hug counter
    const hugCounter = document.querySelector('.hug-counter');
    if (hugCounter) {
        setInterval(() => {
            hugCounter.style.transform = 'scale(1.03)';
            setTimeout(() => {
                hugCounter.style.transform = 'scale(1)';
            }, 1000);
        }, 5000);
    }
    
    // Add a subtle background animation
    const backgroundAnimation = document.createElement('div');
    backgroundAnimation.className = 'background-animation';
    document.body.insertBefore(backgroundAnimation, document.body.firstChild);
    
    // Add styles for the background animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .background-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
            opacity: 0.1;
        }
        
        .background-animation::before,
        .background-animation::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--lavender), var(--baby-blue));
            opacity: 0.5;
            animation: float 15s infinite ease-in-out;
        }
        
        .background-animation::before {
            width: 300px;
            height: 300px;
            top: 10%;
            left: 10%;
            animation-delay: 0s;
        }
        
        .background-animation::after {
            width: 200px;
            height: 200px;
            bottom: 15%;
            right: 10%;
            animation-delay: 5s;
            animation-direction: reverse;
        }
    `;
    document.head.appendChild(style);
    
    // Add a simple console greeting
    console.log("%c💖 Welcome to Garima's Space! 💖", "color: #8a6fa8; font-size: 16px; font-weight: bold;");
    console.log("%cYou're doing amazing, sweetie! 🌟", "color: #89cff0; font-style: italic;");
});