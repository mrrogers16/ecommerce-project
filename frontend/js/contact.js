document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); //prevents form from submitting normally

    const formData = new formData(this);

    fetch('/api/contact', { //sends form to backend
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // using JSON
    .then(data => {
        alert('Message sent successfully!');  // sent to backend
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message.');
    });
});