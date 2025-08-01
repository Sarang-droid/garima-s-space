document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }

    // DOM elements
    const userNameElement = document.getElementById('user-name');
    const profileImageElement = document.getElementById('profile-image');
    const profileDisplayNameElement = document.getElementById('profile-display-name');
    const profileUsernameElement = document.getElementById('profile-username');
    const profileJoinedDateElement = document.getElementById('profile-joined-date');
    const journalCountElement = document.getElementById('journal-count');
    const streakCountElement = document.getElementById('streak-count');
    const moodCountElement = document.getElementById('mood-count');
    const moodChartElement = document.getElementById('mood-chart');
    const tagCloudElement = document.getElementById('tag-cloud');
    const activityTimelineElement = document.getElementById('activity-timeline');
    const recentJournalsElement = document.getElementById('recent-journals');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const editProfileForm = document.getElementById('edit-profile-form');
    const displayNameInput = document.getElementById('display-name');
    const avatarUrlInput = document.getElementById('avatar-url');
    const logoutBtn = document.getElementById('logout-btn');

    // Fetch profile data
    fetchProfileData();

    // Event listeners
    editProfileBtn.addEventListener('click', openEditProfileModal);
    closeModalBtn.addEventListener('click', closeEditProfileModal);
    editProfileForm.addEventListener('submit', handleProfileUpdate);
    logoutBtn.addEventListener('click', handleLogout);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editProfileModal) {
            closeEditProfileModal();
        }
    });

    // Functions
    function fetchProfileData() {
        fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            return response.json();
        })
        .then(data => {
            updateProfileUI(data);
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
            showErrorMessage('Failed to load profile data. Please try again later.');
        });
    }

    function updateProfileUI(data) {
        const { user, insights } = data;
        
        // Update profile info
        userNameElement.textContent = user.profile.displayName || user.username;
        profileDisplayNameElement.textContent = user.profile.displayName || user.username;
        profileUsernameElement.textContent = `@${user.username}`;
        
        if (user.profile.avatarUrl) {
            profileImageElement.src = user.profile.avatarUrl;
        }
        
        // Format joined date
        const joinedDate = new Date(user.createdAt);
        profileJoinedDateElement.textContent = `Joined: ${joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
        
        // Update stats
        journalCountElement.textContent = insights.journalCount;
        streakCountElement.textContent = insights.streak;
        
        // Calculate total mood entries
        const totalMoodEntries = insights.moodStats.reduce((total, stat) => total + stat.count, 0);
        moodCountElement.textContent = totalMoodEntries;
        
        // Render mood chart
        renderMoodChart(insights.moodStats);
        
        // Render tag cloud
        renderTagCloud(insights.tagStats);
        
        // Render recent journals
        renderRecentJournals(insights.recentJournals);
        
        // Fetch and render activity timeline
        fetchActivityData();
    }

    function renderMoodChart(moodStats) {
        // Clear loading placeholder
        moodChartElement.innerHTML = '';
        
        if (moodStats.length === 0) {
            moodChartElement.innerHTML = '<p class="no-data">No mood data available yet.</p>';
            return;
        }
        
        // Create canvas for Chart.js
        const canvas = document.createElement('canvas');
        moodChartElement.appendChild(canvas);
        
        // Prepare data for chart
        const labels = moodStats.map(stat => stat._id);
        const data = moodStats.map(stat => stat.count);
        
        // Define colors for different moods
        const colorMap = {
            'happy': '#48BB78',
            'sad': '#4299E1',
            'neutral': '#A0AEC0',
            'angry': '#F56565',
            'tired': '#9F7AEA',
            'anxious': '#ED8936'
        };
        
        const colors = labels.map(label => colorMap[label] || '#6C63FF');
        
        // Create chart
        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }

    function renderTagCloud(tagStats) {
        // Clear loading placeholder
        tagCloudElement.innerHTML = '';
        
        if (tagStats.length === 0) {
            tagCloudElement.innerHTML = '<p class="no-data">No tags available yet.</p>';
            return;
        }
        
        // Find max count for scaling
        const maxCount = Math.max(...tagStats.map(tag => tag.count));
        
        // Create tag cloud
        tagStats.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag._id;
            
            // Scale font size based on count (between 0.8em and 1.8em)
            const fontSize = 0.8 + (tag.count / maxCount) * 1;
            tagElement.style.fontSize = `${fontSize}em`;
            
            tagCloudElement.appendChild(tagElement);
        });
    }

    function renderRecentJournals(journals) {
        // Clear loading placeholder
        recentJournalsElement.innerHTML = '';
        
        if (journals.length === 0) {
            recentJournalsElement.innerHTML = '<p class="no-data">No journal entries yet.</p>';
            return;
        }
        
        // Create journal entries
        journals.forEach(journal => {
            const journalElement = document.createElement('div');
            journalElement.className = 'journal-item';
            
            const date = new Date(journal.createdAt);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
            
            journalElement.innerHTML = `
                <div class="journal-header">
                    <h3>${journal.title}</h3>
                    <span class="journal-date">${formattedDate}</span>
                </div>
                <p class="journal-preview">${journal.content.substring(0, 100)}${journal.content.length > 100 ? '...' : ''}</p>
                ${journal.tags.length > 0 ? `
                    <div class="journal-tags">
                        ${journal.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <a href="journal.html?id=${journal._id}" class="btn-link">Read more</a>
            `;
            
            recentJournalsElement.appendChild(journalElement);
        });
    }

    function fetchActivityData() {
        fetch('/api/profile/activity', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch activity data');
            }
            return response.json();
        })
        .then(data => {
            renderActivityTimeline(data);
        })
        .catch(error => {
            console.error('Error fetching activity data:', error);
            activityTimelineElement.innerHTML = '<p class="error-message">Failed to load activity data.</p>';
        });
    }

    function renderActivityTimeline(activityData) {
        // Clear loading placeholder
        activityTimelineElement.innerHTML = '';
        
        const { journalByDay, moodByDay } = activityData;
        
        if (journalByDay.length === 0 && moodByDay.length === 0) {
            activityTimelineElement.innerHTML = '<p class="no-data">No activity data available yet.</p>';
            return;
        }
        
        // Combine and sort all activities by date
        const allDates = new Set();
        
        journalByDay.forEach(item => allDates.add(item._id));
        moodByDay.forEach(item => allDates.add(item._id.date));
        
        const sortedDates = Array.from(allDates).sort((a, b) => new Date(b) - new Date(a));
        
        // Create timeline
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        
        sortedDates.slice(0, 10).forEach(date => {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric'
            });
            
            const journalEntry = journalByDay.find(item => item._id === date);
            const moodEntries = moodByDay.filter(item => item._id.date === date);
            
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-date">${formattedDate}</div>
                <div class="timeline-content">
                    ${journalEntry ? `<div class="timeline-event">
                        <i class="fas fa-book"></i> ${journalEntry.count} journal ${journalEntry.count === 1 ? 'entry' : 'entries'}
                    </div>` : ''}
                    ${moodEntries.length > 0 ? `<div class="timeline-event">
                        <i class="fas fa-smile"></i> ${moodEntries.length} mood ${moodEntries.length === 1 ? 'entry' : 'entries'}
                    </div>` : ''}
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
        
        activityTimelineElement.appendChild(timeline);
    }

    function openEditProfileModal() {
        // Populate form with current values
        displayNameInput.value = profileDisplayNameElement.textContent;
        avatarUrlInput.value = profileImageElement.src;
        
        // Show modal
        editProfileModal.style.display = 'block';
    }

    function closeEditProfileModal() {
        editProfileModal.style.display = 'none';
    }

    function handleProfileUpdate(event) {
        event.preventDefault();
        
        const displayName = displayNameInput.value.trim();
        const avatarUrl = avatarUrlInput.value.trim();
        
        fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                displayName,
                avatarUrl
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            return response.json();
        })
        .then(data => {
            // Update UI with new profile data
            userNameElement.textContent = data.user.profile.displayName;
            profileDisplayNameElement.textContent = data.user.profile.displayName;
            profileImageElement.src = data.user.profile.avatarUrl;
            
            // Close modal
            closeEditProfileModal();
            
            // Show success message
            showSuccessMessage('Profile updated successfully!');
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            showErrorMessage('Failed to update profile. Please try again.');
        });
    }

    function handleLogout() {
        // Clear token and redirect to login page
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }

    function showSuccessMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message success';
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    function showErrorMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message error';
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
});