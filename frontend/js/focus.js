document.addEventListener("DOMContentLoaded", () => {
    const words = document.querySelectorAll(".focus-word");
    let currentIndex = 0;

    function focusNextWord() {
        // Reset all words to blurred state
        words.forEach(word => word.style.filter = "blur(5px)");

        // Move focus frame to the next word
        words[currentIndex].style.filter = "blur(0)";

        // Add focus-frame to current word
        document.querySelector(".focus-frame").style.left = words[currentIndex].offsetLeft + "px";
        document.querySelector(".focus-frame").style.width = words[currentIndex].offsetWidth + "px";

        // Move to the next word (looping)
        currentIndex = (currentIndex + 1) % words.length;
    }

    // Start the effect and repeat every 1.5s
    setInterval(focusNextWord, 1500);

    // Initial call to start effect
    focusNextWord();
});
