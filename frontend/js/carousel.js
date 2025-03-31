document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Fetching carousel images...");

    // Get the container where carousel images will be added
    const shoeCarousel = document.querySelector('.shoe-track');
    
    if (!shoeCarousel) {
        console.error("❌ Error: Carousel container not found!");
        return;
    }

    // Fetch carousel images from the API
    fetch("https://fly-feet.com/api/shoes") // Replace this URL with your actual API
        .then(response => response.json())
        .then(data => {
            console.log("✅ Carousel images data:", data);

            // Insert dynamically generated carousel images, each wrapped in a link
            shoeCarousel.innerHTML = data.results.map(product => `
                <a href="shop.html?productId=${product.id}" class="carousel-link">
                    <img src="${product.image_url}" alt="${product.name}" class="carousel-image">
                </a>
            `).join('');
        })
        .catch(error => {
            console.error("❌ Error fetching carousel images:", error);
            shoeCarousel.innerHTML = `<p class="text-center text-danger">Failed to load carousel images. Please try again later.</p>`;
        });
});