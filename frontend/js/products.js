document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Using mock data instead of API!");

    const productList = document.getElementById("product-list");

    if (!productList) {
        console.error("❌ Error: Product list container not found!");
        return;
    }

    // Mock shoe data for testing
    const shoes = [
        {
            id: 1,
            name: "Chuck Taylor All Star",
            brand: "Converse",
            price: 65,
            sizes: [6, 7, 8, 9, 10],
            image_url: "https://m.media-amazon.com/images/I/514DUfoH7mL._AC_SX575_.jpg"
        },
        {
            id: 2,
            name: "Men's Running Shoe",
            brand: "Nike",
            price: 72.99,
            sizes: [6, 7, 8, 9, 10, 11],
            image_url: "https://m.media-amazon.com/images/I/51yUmzHLKBL._AC_SY695_.jpg"
        }
    ];

    // EXAMPLE on how to fetch data from api
    // fetch("https://fly-feet.com/api/shoes")
    //     .then(response => response.json())
    //     .then(shoes => {
    //         // render product cards here
    //     });

    productList.innerHTML = `<div class="row g-4">${shoes.map(generateProductCard).join("")}</div>`;

    console.log("✅ Mock Shoes Loaded");

    function generateProductCard(product) {
        return `
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
                        <p class="card-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                        <p class="card-text"><strong>Sizes:</strong> ${product.sizes.join(", ")}</p>
                        <button class="btn btn-success add-to-cart" data-id="${product.id}" 
                            data-name="${product.name}" 
                            data-brand="${product.brand}" 
                            data-price="${product.price}" 
                            data-image="${product.image}" 
                            data-sizes='${JSON.stringify(product.sizes)}'>Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }

    let selectedProduct = null;

    // Handle Add to Cart Click
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const button = event.target;
            selectedProduct = {
                id: button.getAttribute("data-id"),
                name: button.getAttribute("data-name"),
                brand: button.getAttribute("data-brand"),
                price: parseFloat(button.getAttribute("data-price")),
                image: button.getAttribute("data-image"),
                sizes: JSON.parse(button.getAttribute("data-sizes")),
                selectedSize: null,
            };

            showSizeModal();
        }
    });

    function showSizeModal() {
        const sizeModal = document.getElementById("sizeModal");
        const sizeOptions = document.getElementById("sizeOptions");
        const confirmSizeButton = document.getElementById("confirmSize");

        if (!selectedProduct) return; // Prevent modal from showing on page load

        sizeOptions.innerHTML = selectedProduct.sizes.map(size => `
            <button class="size-btn" data-size="${size}">${size}</button>
        `).join("");

        sizeModal.style.display = "flex";

        document.querySelectorAll(".size-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedProduct.selectedSize = btn.getAttribute("data-size");
            });
        });

        confirmSizeButton.onclick = () => {
            if (!selectedProduct.selectedSize) {
                alert("Please select a size.");
                return;
            }

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(selectedProduct);
            localStorage.setItem("cart", JSON.stringify(cart));

            alert(`${selectedProduct.name} (Size ${selectedProduct.selectedSize}) added to cart!`);
            sizeModal.style.display = "none";
        };
    }

    // Close modal
    document.querySelector(".close").addEventListener("click", () => {
        document.getElementById("sizeModal").style.display = "none";
        selectedProduct = null; // Reset selectedProduct so it doesn't show on refresh
    });

    // Ensure modal is hidden on page load
    window.onload = () => {
        document.getElementById("sizeModal").style.display = "none";
    };
});
