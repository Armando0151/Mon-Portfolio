/**
 * Cinematic Titles Animation Logic
 * Splits titles into individual words and characters for advanced hover effects.
 */

export function initCinematicTitles() {
    const titles = document.querySelectorAll('.hero-title, .section-title');

    titles.forEach(title => {
        // Save original text for accessibility or reset if needed
        const originalText = title.textContent.trim();
        const words = originalText.split(' ');

        // Clear title content
        title.innerHTML = '';

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'cinematic-word';

            const chars = word.split('');
            chars.forEach((char, charIndex) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'cinematic-char';
                charSpan.textContent = char;
                // Optional: add stagger delay for entry animation if desired
                charSpan.style.setProperty('--char-index', charIndex);
                wordSpan.appendChild(charSpan);
            });

            title.appendChild(wordSpan);

            // Add a space between words, but not after the last word
            if (wordIndex < words.length - 1) {
                title.appendChild(document.createTextNode(' '));
            }
        });
    });
}

// Auto-init if this script is loaded directly or via module
document.addEventListener('DOMContentLoaded', initCinematicTitles);
