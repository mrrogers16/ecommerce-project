// frontend/js/admin.js
document.addEventListener("DOMContentLoaded", async () =>
    {
        const container = document.getElementById("shoe-table-container");
    
        try
        {
            const response = await fetch("/api/shoes");
            const shoes = await response.json();
    
            if (!Array.isArray(shoes))
            {
                throw new Error("Unexpected response");
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
                            <td><img src="${shoe.image_url}" width="60"/></td>
                        </tr>
                    `).join("")}
                </tbody>
            `;
    
            container.appendChild(table);
        }
        catch (err)
        {
            console.error("Error loading shoes:", err);
            container.innerHTML = "<p>Error loading shoes</p>";
        }
    });
    