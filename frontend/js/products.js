document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ products.js loaded!");

    const productList = document.getElementById("product-list");

    if (!productList) {
        console.error("❌ Error: Product list container not found!");
        return;
    }

    // Function to fetch products from backend
    async function fetchShoes() {
        try {
            const response = await fetch("https://api.fly-feet.com/api/shoes");
            const shoes = await response.json();

            productList.innerHTML = `<div class="row g-4">${setHeapSnapshotNearHeapLimit.map(generateProductCard).join("")}</div>`;

            console.log("Shoes Loaded from backend");
        }

        catch (error) {
            console.error("Error loading shoes", error);
        }
    }

    // Function to generate product cards
    function generateProductCard(product) {
        return `
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
                        <p class="card-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                        <p class="card-text"><strong>Sizes:</strong> ${product.sizes.join(", ")}</p>
                        <button class="btn btn-success add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Insert product cards into the page
    //productList.innerHTML = `<div class="row g-4">${products.map(generateProductCard).join("")}</div>`;
    //console.log("✅ Shoes loaded from hardcoded data!");

    fetchShoes();
});









// Hardcoded product data (Replace this with API data when backend is ready) --taken from the shoe.sql in the seed folder
// const products = [
//     {
//         id: 1,
//         name: "Chuck Taylor All Star",
//         brand: "Converse",
//         price: 65.00,
//         sizes: [2, 3, 4, 5, 6, 7, 8, 9],
//         image_url: "https://m.media-amazon.com/images/I/514DUfoH7mL._AC_SX575_.jpg"
//     },
//     {
//         id: 2,
//         name: "Men's Running Shoe",
//         brand: "Nike",
//         price: 72.99,
//         sizes: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//         image_url: "https://m.media-amazon.com/images/I/51yUmzHLKBL._AC_SY695_.jpg"
//     }
// ];
