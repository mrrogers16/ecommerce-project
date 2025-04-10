document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../index.html";
    }

    const discountTableBody = document.querySelector("#discount-table tbody");
    const createDiscountForm = document.querySelector("#create-discount-form");

    async function fetchDiscountCodes() {
        try {
            const response = await fetch('/api/discount_codes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Error fetching discount codes");
            }

            const discounts = await response.json();
            populateDiscountTable(discounts);
        } catch (error) {
            console.error("Error fetching discount codes:", error);
        }
    }

    //Existing codes
    function populateDiscountTable(discounts) {
        discountTableBody.innerHTML = ''; // Clear existing rows
    
        discounts.forEach(discount => {
            const row = document.createElement('tr');
    
            row.innerHTML = `
                <td>${discount.code}</td>
                <td>${discount.discount_value} ${discount.discount_type === 'percent' ? '%' : '$'}</td>
                <td>${discount.discount_type === 'percent' ? 'Percentage' : 'Fixed Amount'}</td>
                <td>$${discount.min_order_total}</td>
                <td>${discount.usage_limit || '∞'}</td>
                <td>${discount.times_used}</td>
                <td>${discount.expires_at ? new Date(discount.expires_at).toLocaleDateString() : 'Never'}</td>
                <td>${discount.active ? 'Yes' : 'No'}</td>
                <td>
                    <button class="edit-discount" data-id="${discount.id}">Edit</button>
                    <button class="delete-discount" data-id="${discount.id}">Delete</button>
                </td>
            `;

            
            // Edit button functionality
            row.querySelector('.edit-discount').addEventListener('click', function() {
                editDiscount(discount.id);
            });

            // Delete button functionality
            row.querySelector('.delete-discount').addEventListener('click', function() {
                deleteDiscount(discount.id);
            });

            discountTableBody.appendChild(row);
        });
    }

    // Create discount code
    createDiscountForm.addEventListener("submit", async function(event) {
        event.preventDefault();
    
        const code = document.getElementById("discount-code").value;
        const discountAmount = document.getElementById("discount-amount").value;
        const discountType = document.getElementById("discount-type").value;
    
        // Ensure discount value is properly converted to a number
        const discountValue = parseFloat(discountAmount);
    
        if (isNaN(discountValue)) {
            alert("Discount value must be a valid number.");
            return;
        }
    
        const newDiscount = {
            code: document.getElementById("discount-code").value,
            discount_value: parseFloat(document.getElementById("discount-amount").value),
            discount_type: document.getElementById("discount-type").value,
            min_order_total: parseFloat(document.getElementById("min-order-total").value) || 0,
            usage_limit: parseInt(document.getElementById("usage-limit").value) || 0,
            active: document.getElementById("active").checked,
            expires_at: document.getElementById("expires-at").value || null
        };
    
        try {
            const response = await fetch('/api/discount_codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newDiscount)
            });
    
            if (response.ok) {
                const createdDiscount = await response.json();
                alert("Discount code created successfully");
                fetchDiscountCodes();  // Refresh the discount list
                createDiscountForm.reset();  // Reset form fields
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Error creating discount code:", error);
            alert("An error occurred while creating the discount code.");
        }
    });

    // Edit discount code
    async function editDiscount(discountId) {
        const code = prompt("Enter the new discount code:");
        const discountValue = prompt("Enter the new discount value:");
        const discountType = prompt("Enter the new discount type (percent/fixed):");

        if (code && discountValue && discountType) {
            const updatedDiscount = {
                code: code,
                discount_type: discountType,
                discount_value: parseFloat(discountValue),
                min_order_total: 0,
                usage_limit: 0
            };

            try {
                const response = await fetch(`/api/discount_codes/${discountId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedDiscount)
                });

                if (response.ok) {
                    const updatedData = await response.json();
                    alert("Discount code updated successfully");
                    fetchDiscountCodes();  // Refresh the discount list
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.error}`);
                }
            } catch (error) {
                console.error("Error updating discount code:", error);
                alert("An error occurred while updating the discount code.");
            }
        }
    }

    // Delete discount code
    async function deleteDiscount(discountId) {
        if (confirm("Are you sure you want to delete this discount code?")) {
            try {
                const response = await fetch(`/api/discount_codes/${discountId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`Discount code deleted: ${result.discount.code}`);
                    fetchDiscountCodes();  // Refresh the discount list
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.error}`);
                }
            } catch (error) {
                console.error("Error deleting discount code:", error);
                alert("An error occurred while deleting the discount code.");
            }
        }
    }

    //Fetch discount codes when the page loads
    fetchDiscountCodes();
});