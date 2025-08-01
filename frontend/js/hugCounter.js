document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'garimas-hug-counter';
    const hugCountElement = document.getElementById('hug-count');
    const hugButton = document.getElementById('increment-hug');
    
    if (!hugCountElement) return;
    
    // Initialize the hug counter
    function initHugCounter() {
        const today = getTodayString();
        let counterData = {
            lastUpdated: today,
            count: 0,
            canIncrementToday: true
        };
        
        // Load existing data
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            counterData = JSON.parse(savedData);
            
            // Add canIncrementToday property if it doesn't exist (for backward compatibility)
            if (counterData.canIncrementToday === undefined) {
                counterData.canIncrementToday = !isSameDay(new Date(counterData.lastUpdated), new Date());
            }
            
            // Check if the last update was yesterday
            const lastUpdated = new Date(counterData.lastUpdated);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (isSameDay(lastUpdated, new Date())) {
                // Already updated today, do nothing
                updateButtonState(false);
            } else if (isSameDay(lastUpdated, yesterday)) {
                // Last update was yesterday, increment counter
                counterData.count++;
                counterData.lastUpdated = today;
                counterData.canIncrementToday = false;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(counterData));
                updateButtonState(false);
            } else {
                // It's been more than one day, reset counter
                counterData.count = 1;
                counterData.lastUpdated = today;
                counterData.canIncrementToday = false;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(counterData));
                updateButtonState(false);
            }
        } else {
            // First time, set to 1
            counterData.count = 1;
            counterData.canIncrementToday = false;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(counterData));
            updateButtonState(false);
        }
        
        // Update the display
        updateHugDisplay(counterData.count);
        
        return counterData.count;
    }
    
    // Update the hug counter display with animation
    function updateHugDisplay(count) {
        if (!hugCountElement) return;
        
        // Animate the counter
        const duration = 1000; // Animation duration in ms
        const start = parseInt(hugCountElement.textContent) || 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out function for smooth animation
            const easeOut = function(t) { 
                return 1 - Math.pow(1 - t, 3); 
            };
            
            const currentCount = Math.floor(start + (count - start) * easeOut(progress));
            hugCountElement.textContent = currentCount;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                hugCountElement.textContent = count;
                // Add a pulse animation to the counter when it reaches the final value
                hugCountElement.classList.add('pulse-animation');
                setTimeout(() => {
                    hugCountElement.classList.remove('pulse-animation');
                }, 1000);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Update the button state based on whether the user can increment today
    function updateButtonState(canIncrement) {
        if (!hugButton) return;
        
        if (canIncrement) {
            hugButton.classList.remove('disabled');
            hugButton.disabled = false;
            hugButton.innerHTML = '<i class="fas fa-heart"></i> Give yourself a hug';
            hugButton.setAttribute('aria-disabled', 'false');
        } else {
            hugButton.classList.add('disabled');
            hugButton.disabled = true;
            hugButton.innerHTML = '<i class="fas fa-check"></i> Hug received today';
            hugButton.setAttribute('aria-disabled', 'true');
        }
    }
    
    // Helper function to check if two dates are the same day
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    // Helper function to get today's date as YYYY-MM-DD
    function getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }
    
    // Add confetti effect for milestones
    function celebrateMilestone(count) {
        if (count > 0 && count % 7 === 0) {
            // Add confetti effect for every 7 days
            showCelebration(`Amazing! ${count} days in a row! 🎉`);
            createConfetti(50); // Create 50 confetti particles
        } else if (count > 0) {
            // Show a smaller celebration for each day
            const messages = [
                "Great job taking care of yourself today! 💖",
                "Self-care streak continues! 🌟",
                "You're doing amazing! 🌈",
                "Keep the positive energy flowing! ✨",
                "One day at a time! 🌱"
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showCelebration(randomMessage);
        }
    }
    
    // Create confetti effect
    function createConfetti(particleCount) {
        const colors = ['#ff577f', '#ff884b', '#ffd384', '#fff9b0', '#a6f6ff', '#d9acff', '#ffaee5'];
        const container = document.querySelector('.hug-counter');
        
        if (!container) return;
        
        for (let i = 0; i < particleCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            
            container.appendChild(confetti);
            
            // Remove confetti after animation completes
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Show celebration message
    function showCelebration(message) {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-message';
        celebration.innerHTML = message;
        
        // Style the celebration message
        celebration.style.position = 'fixed';
        celebration.style.top = '20px';
        celebration.style.left = '50%';
        celebration.style.transform = 'translateX(-50%)';
        celebration.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        celebration.style.padding = '15px 25px';
        celebration.style.borderRadius = '25px';
        celebration.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        celebration.style.zIndex = '1000';
        celebration.style.animation = 'slideDown 0.5s ease-out';
        
        // Add to the page
        document.body.appendChild(celebration);
        
        // Add a close button
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '10px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '1.2rem';
        closeBtn.style.color = '#999';
        closeBtn.style.transition = 'color 0.2s ease';
        
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.color = '#333';
        });
        
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.color = '#999';
        });
        
        closeBtn.addEventListener('click', () => {
            celebration.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                celebration.remove();
            }, 300);
        });
        
        celebration.appendChild(closeBtn);
        celebration.style.position = 'relative';
        
        // Remove after animation
        setTimeout(() => {
            celebration.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                celebration.remove();
            }, 500);
        }, 5000); // Increased from 3000 to 5000 for better visibility
    }
    
    // Add celebration styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translate(-50%, -100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .celebration-message {
            font-family: 'Dancing Script', cursive;
            font-size: 1.5rem;
            color: #8a6fa8;
            text-align: center;
        }
        
        @keyframes pulse-animation {
            0% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse-animation {
            animation: pulse-animation 1s ease-in-out;
        }
        
        .disabled {
            opacity: 0.7;
            cursor: not-allowed;
            background: rgba(255, 255, 255, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the counter
    const currentCount = initHugCounter();
    celebrateMilestone(currentCount);
    
    // Add event listener for the hug button
    if (hugButton) {
        hugButton.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Get current data
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (!savedData) return;
            
            const counterData = JSON.parse(savedData);
            
            // Check if we can increment today
            if (counterData.canIncrementToday === false && isSameDay(new Date(counterData.lastUpdated), new Date())) {
                // Already incremented today
                showCelebration("You've already given yourself a hug today! 💖<br>Come back tomorrow to continue your streak!");
                return;
            }
            
            // Increment the counter manually
            counterData.count++;
            counterData.lastUpdated = getTodayString();
            counterData.canIncrementToday = false;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(counterData));
            
            // Update the display
            updateHugDisplay(counterData.count);
            updateButtonState(false);
            
            // Add visual feedback
            const counterContainer = document.querySelector('.hug-counter');
            if (counterContainer) {
                counterContainer.classList.add('pulse-animation');
                setTimeout(() => {
                    counterContainer.classList.remove('pulse-animation');
                }, 1000);
            }
            
            // Create heart animation
            createHeartAnimation();
            
            // Celebrate the milestone
            celebrateMilestone(counterData.count);
        });
    }
    
    // Create heart animation when hug button is clicked
    function createHeartAnimation() {
        const container = document.querySelector('.hug-counter');
        if (!container) return;
        
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = '2rem';
        heart.style.left = '50%';
        heart.style.bottom = '50%';
        heart.style.transform = 'translateX(-50%)';
        heart.style.opacity = '1';
        heart.style.zIndex = '10';
        heart.style.pointerEvents = 'none';
        heart.style.transition = 'all 1s ease-out';
        
        container.appendChild(heart);
        
        // Animate the heart
        setTimeout(() => {
            heart.style.bottom = '80%';
            heart.style.opacity = '0';
            heart.style.transform = 'translateX(-50%) scale(1.5)';
        }, 50);
        
        // Remove the heart after animation
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
});