document.addEventListener('DOMContentLoaded', function() {
    // --- Journal Tag Frequency Chart ---
    const tagCanvas = document.getElementById('tag-bar-chart');
    const tagMessagesDiv = document.getElementById('tag-messages');
    const JOURNAL_KEY = 'garimas-journal-entries';
    const MESSAGE_BANK = {
        'Family': "You thought about family a lot. It’s okay to feel heavy—just remember you’re not alone.",
        'Boyfriend': "Love and relationships are important. Be gentle with your heart.",
        'Dreams': "Your dreams matter. Keep nurturing them.",
        'Self-doubt': "It’s okay to question yourself. Growth comes from reflection.",
        'Friends': "Friendships shape us. Cherish the connections you have.",
        'Work': "Work can be stressful. Remember to breathe.",
        'Other': "Every thought is valid."
    };
    // Get journal entries from last 7 days
    function getWeeklyEntries() {
        const entries = JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]');
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6);
        return entries.filter(e => {
            const d = new Date(e.date);
            return d >= weekAgo && d <= today;
        });
    }
    function getTagFrequencies(entries) {
        const freq = {};
        entries.forEach(e => {
            freq[e.tag] = (freq[e.tag] || 0) + 1;
        });
        return freq;
    }
    function renderTagChart() {
        const entries = getWeeklyEntries();
        const freq = getTagFrequencies(entries);
        const tags = Object.keys(MESSAGE_BANK);
        const data = tags.map(tag => freq[tag] || 0);
        // Bar chart
        new Chart(tagCanvas, {
            type: 'bar',
            data: {
                labels: tags,
                datasets: [{
                    label: 'Entries',
                    data: data,
                    backgroundColor: [
                        '#e6e6fa', '#ffd1dc', '#89cff0', '#98ff98', '#ffdab9', '#f5f5f5', '#b3c6e6'
                    ],
                    borderRadius: 10
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                scales: {
                    y: { beginAtZero: true, grace: '10%' }
                }
            }
        });
        // Messages
        tagMessagesDiv.innerHTML = '';
        tags.forEach(tag => {
            if (freq[tag]) {
                const msg = document.createElement('div');
                msg.textContent = MESSAGE_BANK[tag];
                msg.className = 'tag-message';
                tagMessagesDiv.appendChild(msg);
            }
        });
    }
    renderTagChart();

    // --- Mood Trends Line Chart ---
    const moodCanvas = document.getElementById('mood-line-chart');
    const MOOD_KEY = 'garimas-mood-tracker';
    function getMoodHistory() {
        const data = JSON.parse(localStorage.getItem(MOOD_KEY) || '{}');
        return data.history || [];
    }
    function renderMoodChart() {
        const history = getMoodHistory();
        if (!history.length) return;
        const labels = history.map(h => h.date);
        const moods = history.map(h => h.mood);
        const moodMap = {
            happy: 5, sad: 1, neutral: 3, angry: 2, tired: 2, anxious: 1
        };
        const moodLabels = ['sad','anxious','angry','tired','neutral','happy'];
        const moodColors = {
            happy: '#98ff98', sad: '#ffd1dc', neutral: '#b3c6e6', angry: '#ffdab9', tired: '#e6e6fa', anxious: '#b3c6e6'
        };
        new Chart(moodCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mood',
                    data: moods.map(m => moodMap[m] || 3),
                    fill: false,
                    borderColor: '#8a6fa8',
                    backgroundColor: moods.map(m => moodColors[m] || '#b3c6e6'),
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 10
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        min: 0, max: 5,
                        ticks: {
                            callback: function(value) {
                                return moodLabels[value-1] || '';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    renderMoodChart();
});