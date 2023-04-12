let id;

(async () => {
    id = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await fetch('page-retrieve.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${id}`
        });
        if (response.ok) {
            const data = await response.json();
            const title = data[0]['title'];
            const body = data[0]['body'];
            id = data[0]['id'];
            document.getElementById('title').innerHTML = title;
            document.getElementById('body').innerHTML = body;
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();


document.getElementById('page-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    if (title === '' || body === '') {
        alert('Please fill in all fields');
        return;
    }

    try {
        const formData = new FormData(event.target);
        formData.append('id', id);
        const response = await fetch('page-update.php', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            alert("Saved Successfully");
        } else {
            console.error(`Error submitting form: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error submitting form: ${error}`);
    }
});


document.getElementById('delete-page').addEventListener('click', async () => {
    try {
        const formData = new FormData();
        formData.append('id', id);
        const response = await fetch('page-delete.php', {
            method: 'POST',
            body: formData
        });
        console.log(response.text());
        if (response.ok) {
            window.location.href = `graph.html`;
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error submitting form: ${error}`);
    }
});
