const MESSAGE_BANK = {
    Family: "You’ve been thinking a lot about your family. It’s okay to feel this weight.",
    Dreams: "Your dreams are reflecting your emotional world. Trust them.",
    Anxiety: "It’s okay to feel anxious sometimes. You’re not alone.",
    Work: "Work has been on your mind. Remember to rest.",
    Friends: "Friendship is important. Cherish your connections.",
    Boyfriend: "Love and relationships are part of your journey.",
    'Self-doubt': "It’s okay to question yourself. Growth comes from reflection.",
    Other: "Every thought is valid."
};

function getTagFrequency(entries) {
    const freq = {};
    entries.forEach(entry => {
        (entry.tags || []).forEach(tag => {
            freq[tag] = (freq[tag] || 0) + 1;
        });
    });
    return freq;
}

function getMessages(freq) {
    const messages = {};
    Object.keys(freq).forEach(tag => {
        messages[tag] = MESSAGE_BANK[tag] || 'You’ve been thinking about this a lot.';
    });
    return messages;
}

function weeklySummary(entries) {
    const freq = getTagFrequency(entries);
    const messages = getMessages(freq);
    return { ...freq, Messages: messages };
}

module.exports = { getTagFrequency, getMessages, weeklySummary };
