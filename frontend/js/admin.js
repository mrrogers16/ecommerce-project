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

    async function fetchShoes(page = 1) {
        container.innerHTML = "<p>Loading shoes...</p>";

        try {
            const response = await fetch(`/api/shoes?page=${page}&limit=10`, {
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
            container.innerHTML = "<p>Error loading shoes</p>";
        }
    }

    function renderTable(shoes) {
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

        container.innerHTML = "";
        container.appendChild(table);
    }

    function renderPagination() {
        const pagination = document.createElement("div");
        pagination.classList.add("admin-pagination");
        pagination.style.marginTop = "20px";
        pagination.style.display = "flex";
        pagination.style.justifyContent = "center";
        pagination.style.alignItems = "center";
        pagination.style.gap = "10px";

        const firstButton = createPaginationButton("First", () => {
            currentPage = 1;
            fetchShoes(currentPage);
        }, currentPage === 1);

        const prevButton = createPaginationButton("Previous", () => {
            if (currentPage > 1) {
                currentPage--;
                fetchShoes(currentPage);
            }
        }, currentPage === 1);

        const nextButton = createPaginationButton("Next", () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchShoes(currentPage);
            }
        }, currentPage === totalPages);

        const lastButton = createPaginationButton("Last", () => {
            currentPage = totalPages;
            fetchShoes(currentPage);
        }, currentPage === totalPages);

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
                currentPage = targetPage;
                fetchShoes(currentPage);
            }
        };

        pagination.append(
            firstButton,
            prevButton,
            pageInfo,
            nextButton,
            lastButton,
            jumpInput
        );

        container.appendChild(pagination);
    }

    function createPaginationButton(text, onClick, disabled) {
        const button = document.createElement("button");
        button.textContent = text;
        button.disabled = disabled;
        button.onclick = onClick;
        return button;
    }

    // Initial load
    fetchShoes(currentPage);
});
