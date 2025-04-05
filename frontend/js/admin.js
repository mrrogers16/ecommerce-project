document.addEventListener("DOMContentLoaded", () =>
    {
        const container = document.getElementById("shoe-table-container");
    
        const token = localStorage.getItem("token");
    
        if (!token)
        {
            window.location.href = "index.html";
            return;
        }
    
        let payload;
        try
        {
            payload = JSON.parse(atob(token.split('.')[1]));
        }
        catch (err)
        {
            console.error("Invalid token payload:", err);
            window.location.href = "index.html";
            return;
        }
    
        if (payload.role !== "admin")
        {
            window.location.href = "index.html";
            return;
        }
    
        // Safe to proceed
        let currentPage = 1;
    
        async function fetchShoes(page = 1)
        {
            container.innerHTML = "<p>Loading shoes...</p>";
    
            try
            {
                const response = await fetch(`/api/shoes?page=${page}&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!response.ok)
                {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
                const shoes = data.results;
    
                if (!Array.isArray(shoes))
                {
                    throw new Error("Unexpected response format");
                }
    
                renderTable(shoes);
                renderPagination(data.page);
            }
            catch (err)
            {
                console.error("Error loading shoes:", err);
                container.innerHTML = "<p>Error loading shoes</p>";
            }
        }
    
        function renderTable(shoes)
        {
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
                            <td>$${Number(shoe.price).toFixed(2)}</td>
                            <td>${shoe.stock}</td>
                            <td>${shoe.sizes.join(", ")}</td>
                            <td><img src="${shoe.image_url}" width="60" alt="${shoe.name}"/></td>
                        </tr>
                    `).join("")}
                </tbody>
            `;
    
            container.innerHTML = ""; // Clear previous
            container.appendChild(table);
        }
    
        function renderPagination(page)
        {
            const pagination = document.createElement("div");
            pagination.classList.add("admin-pagination");
            pagination.style.marginTop = "20px";
            pagination.style.display = "flex";
            pagination.style.justifyContent = "center";
            pagination.style.gap = "10px";
    
            const prevButton = document.createElement("button");
            prevButton.textContent = "Previous";
            prevButton.disabled = page <= 1;
            prevButton.onclick = () =>
            {
                if (currentPage > 1)
                {
                    currentPage--;
                    fetchShoes(currentPage);
                }
            };
    
            const nextButton = document.createElement("button");
            nextButton.textContent = "Next";
            nextButton.onclick = () =>
            {
                currentPage++;
                fetchShoes(currentPage);
            };
    
            pagination.appendChild(prevButton);
            pagination.appendChild(nextButton);
    
            container.appendChild(pagination);
        }
    
        // Initial fetch
        fetchShoes(currentPage);
    });
    