document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'garimas-mood-tracker';
    const moodButtons = document.querySelectorAll('.emoji-btn');
    const moodResponseEl = document.getElementById('mood-response');
    
    // Initialize the mood tracker
    function initMoodTracker() {
        // Load saved mood for today if it exists
        const today = getTodayString();
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        
        // Check if mood was already selected today
        if (savedData.lastUpdated === today && savedData.mood) {
            highlightSelectedMood(savedData.mood);
            showSavedMoodMessage(savedData.mood);
            return true; // Mood already selected today
        }
        
        // Add hover effects to buttons
        addButtonEffects();
        
        return false; // No mood selected today
    }
    
    // Add hover and focus effects to buttons
    function addButtonEffects() {
        moodButtons.forEach(button => {
            // Add hover sound effect
            button.addEventListener('mouseenter', function() {
                button.classList.add('hover-effect');
            });
            
            button.addEventListener('mouseleave', function() {
                button.classList.remove('hover-effect');
            });
            
            // Add focus effect for accessibility
            button.addEventListener('focus', function() {
                button.classList.add('focus-effect');
            });
            
            button.addEventListener('blur', function() {
                button.classList.remove('focus-effect');
            });
        });
    }
    
    // Add click event listeners to mood buttons
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 300);
            
            saveMood(mood);
            highlightSelectedMood(mood);
            showMoodConfirmation(mood);
            
            // Save to backend if user is logged in
            const token = localStorage.getItem('token');
            if (token) {
                saveMoodToBackend(mood, token);
            }
        });
    });
    
    // Show message for already saved mood
    function showSavedMoodMessage(mood) {
        const messages = {
            'happy': "You're feeling happy today! 😄",
            'sad': "You're feeling sad today. Remember it's okay to feel this way. 😔",
            'neutral': "You're feeling neutral today. 😐",
            'angry': "You're feeling angry today. Take deep breaths. 😤",
            'tired': "You're feeling tired today. Rest is important. 😴",
            'anxious': "You're feeling anxious today. You're not alone. 🥺"
        };
        
        const message = messages[mood] || "You've already logged your mood today.";
        
        if (moodResponseEl) {
            moodResponseEl.innerHTML = `
                <div class="mood-message saved-mood">
                    <p>${message}</p>
                    <button class="change-mood-btn">Change my mood</button>
                </div>
            `;
            
            // Add event listener to change mood button
            const changeMoodBtn = moodResponseEl.querySelector('.change-mood-btn');
            if (changeMoodBtn) {
                changeMoodBtn.addEventListener('click', function() {
                    moodResponseEl.innerHTML = '';
                    moodButtons.forEach(btn => btn.classList.remove('selected'));
                });
            }
        }
    }
    
    // Save mood to backend API
    function saveMoodToBackend(mood, token) {
        // Map frontend mood names to emoji for backend
        const moodToEmoji = {
            'happy': '😄',
            'sad': '😔',
            'neutral': '😐',
            'angry': '😤',
            'tired': '😴',
            'anxious': '🥺'
        };
        
        fetch('/api/mood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                moodEmoji: moodToEmoji[mood] || '😐'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save mood to server');
            }
            return response.json();
        })
        .then(data => {
            console.log('Mood saved to server:', data);
        })
        .catch(error => {
            console.error('Error saving mood:', error);
        });
    }
    
    // Save mood to localStorage
    function saveMood(mood) {
        const today = getTodayString();
        const moodData = {
            lastUpdated: today,
            mood: mood,
            history: []
        };
        
        // Get existing data
        const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        
        // Add to history if it's a new day
        if (existingData.lastUpdated && existingData.lastUpdated !== today) {
            if (existingData.mood) {
                moodData.history = [...(existingData.history || []), {
                    date: existingData.lastUpdated,
                    mood: existingData.mood
                }];
                
                // Keep only the last 30 days of history
                if (moodData.history.length > 30) {
                    moodData.history = moodData.history.slice(-30);
                }
            }
        } else if (existingData.history) {
            moodData.history = existingData.history;
        }
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(moodData));
    }
    
    // Highlight the selected mood
    function highlightSelectedMood(selectedMood) {
        moodButtons.forEach(button => {
            if (button.getAttribute('data-mood') === selectedMood) {
                button.classList.add('selected');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('selected');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    // Show confirmation message
    function showMoodConfirmation(mood) {
        // Customize messages, suggestions and actions based on mood
        const moodData = {
            'happy': {
                message: "Yay! Happiness looks good on you! 😊",
                suggestion: "Why not share your joy with someone today?",
                color: "#98ff98", // Light green
                action: "Journal about what made you happy",
                actionLink: "journal.html?mood=happy"
            },
            'sad': {
                message: "It's okay to feel this way. I'm here for you. 💙",
                suggestion: "Consider journaling about your feelings or talking to someone you trust.",
                color: "#ffd1dc", // Light pink
                action: "Write in your journal",
                actionLink: "journal.html?mood=sad"
            },
            'neutral': {
                message: "Thanks for checking in. Every day is a new opportunity. 🌟",
                suggestion: "How about trying something new today?",
                color: "#b3c6e6", // Light blue
                action: "See your mood insights",
                actionLink: "insight.html"
            },
            'angry': {
                message: "Your feelings are valid. Take a deep breath. 💨",
                suggestion: "Try counting to 10 slowly or go for a short walk.",
                color: "#ffdab9", // Peach
                action: "Journal about your feelings",
                actionLink: "journal.html?mood=angry"
            },
            'tired': {
                message: "Rest is important. Be kind to yourself today. 🌙",
                suggestion: "Can you find a moment for a short break or power nap?",
                color: "#e6e6fa", // Lavender
                action: "Read an inspirational quote",
                actionLink: "#refresh-quote"
            },
            'anxious': {
                message: "This feeling will pass. You're stronger than you think. 💪",
                suggestion: "Try some deep breathing or grounding exercises.",
                color: "#b3c6e6", // Light blue
                action: "Write in your journal",
                actionLink: "journal.html?mood=anxious"
            }
        };
        
        const data = moodData[mood] || {
            message: "Thank you for sharing how you feel.",
            suggestion: "Remember to take care of yourself today.",
            color: "#f0f0f0",
            action: "Explore your dashboard",
            actionLink: "#"
        };
        
        // Create confetti effect for happy mood
        if (mood === 'happy') {
            createConfetti();
        }
        
        // Display in mood-response element if it exists
        if (moodResponseEl) {
            moodResponseEl.innerHTML = `
                <div class="mood-message" style="border-left-color: ${data.color}">
                    <p class="mood-confirmation">${data.message}</p>
                    <p class="mood-suggestion">${data.suggestion}</p>
                    <div class="mood-actions">
                        <a href="${data.actionLink}" class="mood-action-btn">${data.action}</a>
                    </div>
                </div>
            `;
            
            // Add animation class
            const messageEl = moodResponseEl.querySelector('.mood-message');
            if (messageEl) {
                // Force a reflow to restart animation if already shown
                messageEl.style.animation = 'none';
                messageEl.offsetHeight; // Trigger reflow
                messageEl.style.animation = 'fade-in 0.5s ease-out';
                
                // Handle special action for refresh quote
                if (data.actionLink === '#refresh-quote') {
                    const actionBtn = messageEl.querySelector('.mood-action-btn');
                    if (actionBtn) {
                        actionBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            const refreshQuoteBtn = document.getElementById('refresh-quote');
                            if (refreshQuoteBtn) {
                                refreshQuoteBtn.click();
                            }
                        });
                    }
                }
            }
        } else {
            // Fallback to notification if mood-response doesn't exist
            let notification = document.querySelector('.mood-notification');
            if (!notification) {
                notification = document.createElement('div');
                notification.className = 'mood-notification';
                document.querySelector('.mood-tracker').appendChild(notification);
            }
            
            notification.textContent = data.message;
            notification.style.opacity = '1';
            notification.style.borderLeft = `4px solid ${data.color}`;
            
            // Hide after 5 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }
    }
    
    // Create confetti effect for happy mood
    function createConfetti() {
        const confettiCount = 50;
        const colors = ['#98ff98', '#ffd1dc', '#b3c6e6', '#ffdab9', '#e6e6fa'];
        const container = document.querySelector('.mood-tracker');
        
        if (!container) return;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 2) + 's';
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Helper function to get today's date as YYYY-MM-DD
    function getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }
    
    // Initialize the mood tracker when the page loads
    initMoodTracker();
    
    // Add styles for the notification
    const style = document.createElement('style');
    style.textContent = `
        .mood-notification {
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            font-size: 0.9rem;
            transition: opacity 0.3s ease-in-out;
            opacity: 0;
            position: absolute;
            bottom: -50px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .emoji-btn[aria-pressed="true"] {
            transform: scale(1.15);
            box-shadow: 0 0 0 3px var(--baby-blue);
        }
    `;
    document.head.appendChild(style);
});