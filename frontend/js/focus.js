document.addEventListener("DOMContentLoaded", () => {
    const words = document.querySelectorAll(".focus-word");
    const focusFrame = document.querySelector(".focus-frame");
    let currentIndex = 0;

    // Manual adjustment values - change these to adjust positioning
    const adjustments = {
        // For the "Fly" word (index 0)
        0: {
            offsetX: -70,  // Negative values move left, positive values move right
            offsetY: 0,    // Negative values move up, positive values move down
            extraWidth: 10, // Make frame wider
            extraHeight: 10 // Make frame taller
        },
        // For the "Feet!" word (index 1)
        1: {
            offsetX: 168,
            offsetY: 0,
            extraWidth: 10,
            extraHeight: 10
        }
    };

    function focusNextWord() {
        // Reset all words to blurred state
        words.forEach(word => {
            word.style.filter = "blur(5px)";
        });

        // Focus current word
        const currentWord = words[currentIndex];
        currentWord.style.filter = "blur(0)";
        
        // Get the adjustments for the current word
        const adj = adjustments[currentIndex] || { offsetX: 0, offsetY: 0, extraWidth: 0, extraHeight: 0 };
        
        // Position the focus frame
        const rect = currentWord.getBoundingClientRect();
        focusFrame.style.left = (currentWord.offsetLeft + adj.offsetX) + 'px';
        focusFrame.style.top = (currentWord.offsetTop + adj.offsetY) + 'px';
        focusFrame.style.width = (rect.width + adj.extraWidth) + 'px';
        focusFrame.style.height = (rect.height + adj.extraHeight) + 'px';
        
        // Move to next word (loop)
        currentIndex = (currentIndex + 1) % words.length;
    }
    
    // Initial positioning with a delay
    setTimeout(focusNextWord, 500);
    
    // Animation interval
    setInterval(focusNextWord, 1500);
});