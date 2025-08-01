document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const featuredDiv = document.getElementById('featured-message');
    const messageCounter = document.getElementById('message-counter');
    
    // Hide navigation elements since we only show one message per day
    const messageNav = document.querySelector('.message-navigation');
    if (messageNav) {
        messageNav.style.display = 'none';
    }
    
    // Add white text style to the message container
    if (featuredDiv) {
        featuredDiv.style.color = 'white';
    }

    // Array of messages
    const messages = [
        "Garima, every time you open those heavy books, remember—you're not just studying medicine, you're preparing to heal lives. And while you heal the world, I'll be here to care for the healer. 🌸",
        "I know some days in MBBS feel never-ending, but trust me, the world is waiting for a doctor with your heart, your mind, and your soul. I'm your biggest believer, always.",
        "You don't just memorize medical terms—you carry compassion in your veins. That's what makes you different, that's what will make you unforgettable as a doctor. Keep going, my love.",
        "Late-night studying, early morning rounds, endless lectures—yet you still manage to smile. That strength in you inspires me more than you know. I'm so proud of you, Garima.",
        "If your hands ever tremble, let them remember this: you were born for this. Every challenge in MBBS is shaping the kind, fierce, extraordinary doctor you are becoming.",
        "Even on days you doubt yourself, I see the brilliance in your eyes and the fire in your heart. I'll hold your hand through every tired evening and celebrate every little win.",
        "You've chosen a path that demands everything—and still, you carry it with grace. Never forget, you are not alone in this. I'm walking this journey right beside you.",
        "There are thousands of doctors out there, but only one Garima who's doing this with such heart. Your dedication doesn't go unnoticed—by your patients, your future, and by me.",
        "Some people become doctors. But you, my love, are becoming hope. You are going to change lives, and I feel so lucky to witness this transformation.",
        "Whenever you feel overwhelmed, just close your eyes and remember: I believe in you. Your dreams are safe with me, and I'll keep reminding you of them when you forget."
    ];
    
    // Function to format date
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }
    
    // Function to get day of year (1-366)
    function getDayOfYear() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
    
    // Display message
    function displayDailyMessage() {
        // Get day of year (1-366) and use modulo to cycle through messages
        const dayOfYear = getDayOfYear();
        const messageIndex = dayOfYear % messages.length;
        const currentMessage = messages[messageIndex];
        const today = new Date();
        
        if (featuredDiv) {
            featuredDiv.style.opacity = 0;
            
            // Wait for fade out before updating content
            setTimeout(() => {
                featuredDiv.innerHTML = `
                    <div class="featured-card" style="color: white;">
                        <div class="featured-text">${currentMessage}</div>
                        <div class="featured-date">${formatDate(today)}</div>
                        <div class="message-actions">
                            <button class="hug-btn" title="Send a hug">🤗 Hug</button>
                            <button class="heart-btn" title="Send a heart">❤️</button>
                        </div>
                    </div>
                `;
                
                // Fade in and animate new message
                setTimeout(() => {
                    featuredDiv.style.opacity = 1;
                    featuredDiv.classList.add('pop-in');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        featuredDiv.classList.remove('pop-in');
                    }, 1000);
                }, 50);
            }, 300);
        }
        
        // Update counter to show current date
        if (messageCounter) {
            messageCounter.textContent = formatDate(today);
        }
    }
    
    // Initialize
    displayDailyMessage();
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes popIn {
            0% { transform: scale(0.95); opacity: 0; }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .message-card, .featured-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 2rem;
            margin: 2rem auto;
            max-width: 600px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            color: white;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .featured-text {
            font-size: 1.8rem;
            line-height: 1.6;
            margin: 1.5rem 0;
            font-weight: 500;
            font-family: 'Dancing Script', cursive;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .featured-date {
            font-size: 1rem;
            opacity: 0.9;
            margin-top: 1.5rem;
            font-style: italic;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .loading-message {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            padding: 3rem 2rem;
            font-style: italic;
            font-size: 1.1rem;
        }
        
        .message-actions {
            margin-top: 2rem;
            display: flex;
            justify-content: center;
            gap: 1.5rem;
        }
        
        .hug-btn, .heart-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 25px;
            padding: 0.6rem 1.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.1rem;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        
        .hug-btn:hover, .heart-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .featured-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: fadeIn 0.6s ease-out;
            font-size: 1.3rem;
            margin: 2rem auto;
            min-height: 200px;
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            transform: translateZ(0);
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .star {
            font-size: 2rem;
            position: absolute;
            top: -20px;
            left: 20px;
        }
        .featured-text { 
            font-size: 1.5rem; 
            line-height: 1.5;
            text-align: center;
            margin: 1.5rem 0;
            color: #333333;
            font-weight: 500;
        }
        .featured-date, .msg-date { 
            font-size: 0.9rem; 
            color: #8a6fa8; 
            margin-top: 0.5rem; 
            text-align: right;
        }
        .message-actions {
            display: flex;
            justify-content: center;
            margin-top: 1.5rem;
        }
        .hug-btn, .heart-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            margin: 0 0.8rem;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .hug-btn:hover, .heart-btn:hover {
            transform: scale(1.2) rotate(-5deg);
        }
        .pop-in {
            animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        /* Add a subtle shine effect on the card */
        .featured-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.1) 50%,
                rgba(255, 255, 255, 0) 100%
            );
            transition: all 0.8s;
            z-index: 0;
        }
        
        .featured-card:hover::before {
            left: 100%;
        }
        
        /* Ensure text stays above the shine effect */
        .featured-card > * {
            position: relative;
            z-index: 1;
        }
        @keyframes popIn {
            0% { opacity: 0; transform: scale(0.7); }
            80% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
        }
        .message-navigation {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;
        }
        .nav-arrow {
            background: white;
            border: 2px solid #ffd1dc;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #8a6fa8;
            transition: all 0.3s ease;
        }
        .nav-arrow:hover {
            background: #ffd1dc;
            color: white;
        }
        .nav-arrow:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .message-counter {
            margin: 0 1rem;
            font-size: 1rem;
            color: #8a6fa8;
            font-family: 'Montserrat', sans-serif;
        }
        .message-container {
            max-width: 600px;
            margin: 0 auto;
        }
    `;
    document.head.appendChild(style);
});