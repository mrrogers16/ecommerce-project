document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("shoe-table-container");
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    let payload;
    try {
        payload = JSON.parse(atob(token.split('.')[1]));
    }
    catch (err) {
        console.error("Invalid token payload:", err);
        window.location.href = "index.html";
        return;
    }

    if (payload.role !== "admin") {
        window.location.href = "index.html";
        return;
    }

    let currentPage = 1;
    let totalPages = 1;

    // Create filter UI
    const filters = document.createElement("div");
    filters.classList.add("filter-controls");
    filters.style.marginBottom = "20px";
    filters.innerHTML = `
        <label>Brand: <input type="text" id="filter-brand" placeholder="e.g., Nike" /></label>
        <label>Category: 
            <select id="filter-category">
                <option value="">All</option>
                <option value="mens">Men's</option>
                <option value="womens">Women's</option>
                <option value="kids">Kids'</option>
            </select>
        </label>
        <label>Size: <input type="number" id="filter-size" placeholder="e.g., 9" /></label>
        <label>Price Min: <input type="number" id="filter-price-min" placeholder="Min $" /></label>
        <label>Price Max: <input type="number" id="filter-price-max" placeholder="Max $" /></label>
        <label>Name: <input type="text" id="filter-name" placeholder="Shoe name" /></label>
        <button id="apply-filters">Apply Filters</button>
        <button id="clear-filters">Clear Filters</button>
    `;
    container.appendChild(filters);

    const tableWrapper = document.createElement("div");
    container.appendChild(tableWrapper);

    async function fetchShoes(page = 1) {
        tableWrapper.innerHTML = "<p>Loading shoes...</p>";

        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", 10);

        // Filters
        const brand = document.getElementById("filter-brand").value.trim();
        const category = document.getElementById("filter-category").value;
        const size = document.getElementById("filter-size").value;
        const priceMin = document.getElementById("filter-price-min").value;
        const priceMax = document.getElementById("filter-price-max").value;
        const name = document.getElementById("filter-name").value.trim();

        if (brand) params.set("brand", brand);
        if (category) params.set("category", category);
        if (size) params.set("size", size);
        if (priceMin) params.set("priceMin", priceMin);
        if (priceMax) params.set("priceMax", priceMax);
        if (name) params.set("name", name);

        try {
            const response = await fetch(`/api/shoes?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const shoes = data.results;

            currentPage = data.page;
            totalPages = data.totalPages;

            renderTable(shoes);
            renderPagination();
        }
        catch (err) {
            console.error("Error loading shoes:", err);
            tableWrapper.innerHTML = "<p>Error loading shoes</p>";
        }
    }

    function renderTable(shoes) {
        if (!shoes.length) {
            tableWrapper.innerHTML = "<p>No shoes found.</p>";
            return;
        }

        const table = document.createElement("table");
        table.classList.add("admin-shoe-table");

        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sizes</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                ${shoes.map(shoe => `
                    <tr>
                        <td>${shoe.id}</td>
                        <td>${shoe.name}</td>
                        <td>${shoe.brand}</td>
                        <td>${shoe.category || "N/A"}</td>
                        <td>$${Number(shoe.price).toFixed(2)}</td>
                        <td>${shoe.stock}</td>
                        <td>${shoe.sizes.join(", ")}</td>
                        <td><img src="${shoe.image_url}" width="60" alt="${shoe.name}"/></td>
                    </tr>
                `).join("")}
            </tbody>
        `;

        tableWrapper.innerHTML = "";
        tableWrapper.appendChild(table);
    }

    function renderPagination() {
        const existing = document.querySelector(".admin-pagination");
        if (existing) {
            existing.remove();
        }

        const pagination = document.createElement("div");
        pagination.classList.add("admin-pagination");
        pagination.style.marginTop = "20px";
        pagination.style.display = "flex";
        pagination.style.justifyContent = "center";
        pagination.style.alignItems = "center";
        pagination.style.gap = "10px";

        const firstButton = createPaginationButton("First", () => fetchShoes(1), currentPage === 1);
        const prevButton = createPaginationButton("Previous", () => fetchShoes(currentPage - 1), currentPage === 1);
        const nextButton = createPaginationButton("Next", () => fetchShoes(currentPage + 1), currentPage === totalPages);
        const lastButton = createPaginationButton("Last", () => fetchShoes(totalPages), currentPage === totalPages);

        const pageInfo = document.createElement("span");
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        const jumpInput = document.createElement("input");
        jumpInput.type = "number";
        jumpInput.min = 1;
        jumpInput.max = totalPages;
        jumpInput.placeholder = "Page #";
        jumpInput.style.width = "70px";
        jumpInput.onchange = () => {
            const targetPage = Math.max(1, Math.min(totalPages, parseInt(jumpInput.value)));
            if (targetPage && targetPage !== currentPage) {
                fetchShoes(targetPage);
            }
        };

        pagination.append(firstButton, prevButton, pageInfo, nextButton, lastButton, jumpInput);
        container.appendChild(pagination);
    }

    function createPaginationButton(text, onClick, disabled) {
        const button = document.createElement("button");
        button.textContent = text;
        button.disabled = disabled;
        button.onclick = onClick;
        return button;
    }

    document.getElementById("apply-filters").addEventListener("click", () => {
        currentPage = 1;
        fetchShoes(currentPage);
    });

    document.getElementById("clear-filters").addEventListener("click", () => {
        document.getElementById("filter-brand").value = "";
        document.getElementById("filter-category").value = "";
        document.getElementById("filter-size").value = "";
        document.getElementById("filter-price-min").value = "";
        document.getElementById("filter-price-max").value = "";
        document.getElementById("filter-name").value = "";
        currentPage = 1;
        fetchShoes(currentPage);
    });

    // Initial load
    fetchShoes(currentPage);
});
