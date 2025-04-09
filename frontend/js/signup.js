document.addEventListener("DOMContentLoaded", () => 
    {
        const form = document.querySelector("form");
    
        form.addEventListener("submit", async (event) => 
        {
            event.preventDefault();
    
            // Get form values
            const firstName = document.getElementById("firstName").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const address = document.getElementById("address").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const termsAccepted = document.getElementById("terms").checked;
    
            // Basic validation
            if (!termsAccepted) 
            {
                alert("Please accept the terms and conditions.");
                return;
            }
    
            if (password !== confirmPassword) 
            {
                alert("Passwords do not match.");
                return;
            }
    
            try 
            {
                const response = await fetch("/api/customers/signup", {
                    method: "POST",
                    headers: 
                    {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        password,
                        address,
                        phone
                    })
                });
    
                const result = await response.json();
    
                if (response.ok) 
                {
                    alert("Account created successfully! Please log in.");
                    window.location.href = "login.html";
                } 
                else 
                {
                    alert(result.error || "An error occurred. Please try again.");
                }
            } 
            catch (error) 
            {
                console.error("Error during sign up:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        });
    });
    