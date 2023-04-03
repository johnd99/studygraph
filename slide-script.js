(async () => {
    try {
        const response = await fetch('slide-retrieve.php');
        if (response.ok) {
            const data = await response.json();
            const title = data[0]['title'];
            const body = data[0]['body'];
            const lastSaved = data[0]['last_saved'];
            document.getElementById('title').innerHTML = title;
            document.getElementById('body').innerHTML = body;
            document.getElementById('last-saved').innerHTML = "Last saved: " + lastSaved;
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();

document.getElementById('slide-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    if (title === '' || body === '') {
        alert('Please fill in all fields');
        return;
    }

    // Send data to PHP file using Fetch API
    try {
        const formData = new FormData(event.target);
        const lastSaved = new Date().toLocaleString();
        formData.append('lastSaved', lastSaved);
        const response = await fetch('slide-update.php', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            document.getElementById('last-saved').innerHTML = "Last saved: " + lastSaved;
        } else {
            console.error(`Error submitting form: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error submitting form: ${error}`);
    }
});
