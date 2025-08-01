// Simple keyword-based tag extractor
const KEYWORDS = {
    Family: ['mom', 'dad', 'parents', 'family', 'home', 'sister', 'brother'],
    Dreams: ['dream', 'nightmare', 'sleep', 'imagine', 'vision'],
    Anxiety: ['anxiety', 'anxious', 'worry', 'stress', 'panic'],
    Work: ['work', 'office', 'job', 'project', 'boss'],
    Friends: ['friend', 'buddy', 'pal', 'hangout', 'party'],
    Boyfriend: ['boyfriend', 'love', 'relationship', 'partner', 'date'],
    'Self-doubt': ['doubt', 'insecure', 'confidence', 'question myself'],
    Other: []
};

function extractTags(text) {
    const tags = new Set();
    const lower = text.toLowerCase();
    for (const [tag, words] of Object.entries(KEYWORDS)) {
        for (const word of words) {
            if (lower.includes(word)) {
                tags.add(tag);
                break;
            }
        }
    }
    if (tags.size === 0) tags.add('Other');
    return Array.from(tags);
}

module.exports = { extractTags };
