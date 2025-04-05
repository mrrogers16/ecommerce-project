document.addEventListener("DOMContentLoaded", async () => {
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

    // ✅ At this point, user is confirmed admin — safe to load data
    try {
        const response = await fetch("/api/shoes", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const shoes = data.results; // because your API returns { page, limit, results }

        if (!Array.isArray(shoes)) {
            throw new Error("Unexpected response format");
        }

        const table = document.createElement("table");
        table.classList.add("admin-shoe-table");

        table.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Brand</th>
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
                            <td>$${shoe.price.toFixed(2)}</td>
                            <td>${shoe.stock}</td>
                            <td>${shoe.sizes.join(", ")}</td>
                            <td><img src="${shoe.image_url}" width="60" alt="${shoe.name}"/></td>
                        </tr>
                    `).join("")}
                </tbody>
            `;

        container.appendChild(table);
    }
    catch (err) {
        console.error("Error loading shoes:", err);
        container.innerHTML = "<p>Error loading shoes</p>";
    }
});
