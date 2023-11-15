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
            document.getElementById('page-title').innerHTML = title;
            document.getElementById('page-body').innerHTML = body;

            if (data[0]['image_data']) {
                const imgBase64 = data[0]['image_data'];
                const displayedImage = document.getElementById('displayedImage');
                displayedImage.src = `data:image/png;base64,${imgBase64}`;
            }
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();


document.getElementById('page-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('page-title').value;
    if (title === '') {
        alert('Please fill in title');
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

document.getElementById('uploadImageButton').addEventListener('click', () => {
    document.getElementById('imageInput').click();
});


document.getElementById('imageInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('displayedImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});