/**
 * Cinematic Titles Animation Logic - v2 (Motion One Edition)
 * Splits titles and applies staggered orchestration using Motion One.
 */

export function initCinematicTitles() {
    const titles = document.querySelectorAll('.hero-title, .section-title');

    titles.forEach(title => {
        const hasTypedText = !!title.querySelector('.typed-text');
        const targetElement = hasTypedText ? title.querySelector('.title-name') : title;

        if (!targetElement) {
            return;
        }

        const originalText = targetElement.textContent.trim();
        const words = originalText.split(' ');
        targetElement.innerHTML = '';

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'cinematic-word';
            wordSpan.style.display = 'inline-block';

            const chars = word.split('');
            chars.forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'cinematic-char';
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                wordSpan.appendChild(charSpan);
            });

            targetElement.appendChild(wordSpan);
            if (wordIndex < words.length - 1) {
                targetElement.appendChild(document.createTextNode(' '));
            }
        });

        // Orchestrate entrance with Motion One
        if (typeof window.motion !== 'undefined') {
            const { animate, stagger, inView } = window.motion;

            // Animate when the title enters the viewport
            inView(title, () => {
                animate(
                    title.querySelectorAll('.cinematic-char'),
                    {
                        opacity: [0, 1],
                        y: [20, 0],
                        rotateX: [-90, 0],
                        filter: ['blur(10px)', 'blur(0px)']
                    },
                    {
                        delay: stagger(0.04),
                        duration: 0.8,
                        easing: [0.2, 0.8, 0.2, 1]
                    }
                );
            });
        }
    });
}

// Global initialization
window.addEventListener('load', initCinematicTitles);
