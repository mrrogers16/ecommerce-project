    document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const res = await fetch('../api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        document.getElementById('status').innerText = data.message || 'Message sent!';
    } catch (err) {
        document.getElementById('status').innerText = 'Something went wrong.';
        console.error(err);
    }
    });