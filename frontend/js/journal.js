document.addEventListener('DOMContentLoaded', function() {
    const tagSelection = document.getElementById('tag-selection');
    const tagButtons = document.querySelectorAll('.tag-btn');
    const entryArea = document.getElementById('journal-entry-area');
    const selectedTag = document.getElementById('selected-tag');
    const journalText = document.getElementById('journal-text');
    const saveBtn = document.getElementById('save-entry-btn');
    const successMsg = document.getElementById('journal-success');
    const STORAGE_KEY = 'garimas-journal-entries';
    
    // Add back button to return to tag selection
    const backToTagsBtn = document.createElement('button');
    backToTagsBtn.textContent = 'Choose Different Topic';
    backToTagsBtn.className = 'back-to-tags-btn';
    backToTagsBtn.addEventListener('click', function() {
        entryArea.style.display = 'none';
        tagSelection.style.display = 'block';
    });
    entryArea.insertBefore(backToTagsBtn, saveBtn);

    // Add search functionality for tags
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search topics...';
    searchInput.className = 'tag-search';
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        tagButtons.forEach(btn => {
            const tag = btn.getAttribute('data-tag').toLowerCase();
            if (tag.includes(searchTerm)) {
                btn.style.display = 'inline-block';
            } else {
                btn.style.display = 'none';
            }
        });
    });
    
    // Insert search input at the top of tag selection
    const tagSelectionHeading = tagSelection.querySelector('h2');
    tagSelection.insertBefore(searchInput, tagSelectionHeading.nextSibling);
    
    // Tag selection with animation and feedback
    tagButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add visual feedback on click
            this.classList.add('tag-btn-selected');
            
            // Get the tag and show the entry area
            const tag = this.getAttribute('data-tag');
            selectedTag.textContent = `Topic: ${tag}`;
            
            // Smooth transition
            tagSelection.style.opacity = '0';
            setTimeout(() => {
                tagSelection.style.display = 'none';
                entryArea.style.display = 'block';
                entryArea.style.opacity = '0';
                setTimeout(() => {
                    entryArea.style.opacity = '1';
                    // Check for draft after showing the entry area
                    checkForDraft(tag);
                }, 50);
            }, 300);
            
            journalText.value = '';
            successMsg.style.display = 'none';
            journalText.focus();
            entryArea.setAttribute('data-tag', tag);
            
            // Reset other buttons
            tagButtons.forEach(otherBtn => {
                if (otherBtn !== this) {
                    otherBtn.classList.remove('tag-btn-selected');
                }
            });
        });
    });

    // Add character counter and auto-save indicator
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.innerHTML = '0 characters';
    entryArea.insertBefore(charCounter, saveBtn);
    
    // Add auto-save indicator
    const autoSaveIndicator = document.createElement('div');
    autoSaveIndicator.className = 'auto-save-indicator';
    autoSaveIndicator.innerHTML = 'Draft saved';
    autoSaveIndicator.style.display = 'none';
    entryArea.insertBefore(autoSaveIndicator, saveBtn);
    
    // Add text formatting toolbar
    const textToolbar = document.createElement('div');
    textToolbar.className = 'text-toolbar';
    textToolbar.innerHTML = `
        <button type="button" class="format-btn" data-format="bold" title="Bold"><i class="fas fa-bold"></i></button>
        <button type="button" class="format-btn" data-format="italic" title="Italic"><i class="fas fa-italic"></i></button>
        <button type="button" class="format-btn" data-format="underline" title="Underline"><i class="fas fa-underline"></i></button>
        <button type="button" class="format-btn" data-format="list" title="Bullet List"><i class="fas fa-list-ul"></i></button>
    `;
    entryArea.insertBefore(textToolbar, journalText);
    
    // Character counter update
    journalText.addEventListener('input', function() {
        const count = this.value.length;
        charCounter.innerHTML = `${count} character${count !== 1 ? 's' : ''}`;
        
        // Auto-save draft to localStorage
        const tag = entryArea.getAttribute('data-tag');
        localStorage.setItem('journal_draft', JSON.stringify({
            text: this.value,
            tag: tag,
            timestamp: new Date().getTime()
        }));
        
        // Show auto-save indicator
        autoSaveIndicator.style.display = 'inline-block';
        autoSaveIndicator.innerHTML = 'Draft saved';
        setTimeout(() => {
            autoSaveIndicator.style.display = 'none';
        }, 2000);
    });
    
    // Check for saved draft when selecting a tag
    function checkForDraft(tag) {
        const draftData = localStorage.getItem('journal_draft');
        if (draftData) {
            const draft = JSON.parse(draftData);
            if (draft.tag === tag && draft.text.trim() !== '') {
                // Calculate how old the draft is
                const now = new Date().getTime();
                const draftAge = Math.floor((now - draft.timestamp) / 60000); // in minutes
                
                if (confirm(`You have a saved draft from ${draftAge} minute${draftAge !== 1 ? 's' : ''} ago. Would you like to restore it?`)) {
                    journalText.value = draft.text;
                    charCounter.innerHTML = `${draft.text.length} character${draft.text.length !== 1 ? 's' : ''}`;
                }
            }
        }
    }
    
    // Text formatting buttons
    const formatButtons = document.querySelectorAll('.format-btn');
    formatButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const textarea = journalText;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            let formattedText = '';
            
            switch(format) {
                case 'bold':
                    formattedText = `**${selectedText}**`;
                    break;
                case 'italic':
                    formattedText = `*${selectedText}*`;
                    break;
                case 'underline':
                    formattedText = `_${selectedText}_`;
                    break;
                case 'list':
                    // Split by new line and add bullet points
                    const lines = selectedText.split('\n');
                    formattedText = lines.map(line => `• ${line}`).join('\n');
                    break;
            }
            
            // Replace the selected text with the formatted text
            textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
            
            // Update character count
            const count = textarea.value.length;
            charCounter.innerHTML = `${count} character${count !== 1 ? 's' : ''}`;
            
            // Set focus back to textarea
            textarea.focus();
            textarea.selectionStart = start + formattedText.length;
            textarea.selectionEnd = start + formattedText.length;
        });
    });
    
    // Save entry
    saveBtn.addEventListener('click', function() {
        const tag = entryArea.getAttribute('data-tag');
        const text = journalText.value.trim();
        if (!text) {
            showSuccess('Please write something to save.', true);
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        entries.push({ date: today, tag, text });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        
        // Clear the draft from localStorage
        localStorage.removeItem('journal_draft');
        
        showSuccess("Entry saved. You've honored your emotions today.");
        journalText.value = '';
        charCounter.innerHTML = '0 characters';
        
        setTimeout(() => {
            entryArea.style.opacity = '0';
            setTimeout(() => {
                entryArea.style.display = 'none';
                tagSelection.style.display = 'block';
                tagSelection.style.opacity = '1';
            }, 300);
        }, 2000);
    });

    function showSuccess(msg, error) {
        successMsg.textContent = msg;
        successMsg.style.display = 'block';
        successMsg.style.color = error ? '#d9534f' : '#4bb543';
        successMsg.style.background = error ? '#fff0f0' : '#e6ffe6';
        successMsg.style.padding = '0.5rem 1rem';
        successMsg.style.borderRadius = '8px';
        successMsg.style.marginTop = '1rem';
        successMsg.style.transition = 'opacity 0.5s';
        successMsg.style.opacity = '1';
        setTimeout(() => { successMsg.style.opacity = '0.6'; }, 1500);
    }
});