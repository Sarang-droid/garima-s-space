document.addEventListener('DOMContentLoaded', function() {
    // Get today's date as a seed for consistent daily quotes
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Simple pseudo-random number generator using the date as seed
    function seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    
    // Get a quote based on the day of the year
    function getTodaysQuote() {
        const index = Math.floor(seededRandom(seed) * quotes.length);
        return quotes[index];
    }
    
    // Display the quote
    function displayQuote() {
        const quoteElement = document.getElementById('daily-quote');
        const authorElement = document.getElementById('quote-author');
        
        if (quoteElement && authorElement) {
            const quote = getTodaysQuote();
            
            // Fade out
            quoteElement.style.opacity = 0;
            authorElement.style.opacity = 0;
            
            // Update text after fade out
            setTimeout(() => {
                quoteElement.textContent = `"${quote.text}"`;
                authorElement.textContent = `— ${quote.author}`;
                
                // Fade in
                quoteElement.style.transition = 'opacity 0.5s ease-in-out';
                authorElement.style.transition = 'opacity 0.5s ease-in-out';
                
                setTimeout(() => {
                    quoteElement.style.opacity = 1;
                    authorElement.style.opacity = 0.8;
                }, 50);
                
            }, 500);
        }
    }
    
    // Initialize the quote display
    displayQuote();
    
    // Update the quote at midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - now;
    
    // Set timeout for the next midnight
    setTimeout(() => {
        displayQuote();
        // Then update every 24 hours
        setInterval(displayQuote, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
});