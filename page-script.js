let page_id;
let graph_id;

(async () => {
    page_id = new URLSearchParams(window.location.search).get('page_id');
    graph_id = new URLSearchParams(window.location.search).get('graph_id');
    try {
        const response = await fetch('page-retrieve.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${page_id}`
        });
        if (response.ok) {
            const data = await response.json();  //Switch data[0]?
            const title = data[0]['title'];
            const body = data[0]['body'];
            const imageReference = data[0]['image_reference'];
            document.getElementById('page-title').innerHTML = title;
            document.getElementById('page-body').innerHTML = body;
            if (imageReference) {
                document.getElementById('displayedImage').src = imageReference;
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
        formData.append('id', page_id);
        const response = await fetch('page-update.php', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            console.log(response.text());
            alert("Saved Successfully");
        } else {
            console.error(`Error saving page: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error saving page: ${error}`);
    }
});


document.getElementById('delete-page').addEventListener('click', async () => {
    try {
        const response = await fetch('page-delete.php', {
            method: 'POST',
            body: `id=${page_id}`
        });
        if (response.ok) {
            window.location.href = `graph.html`;
        } else {
            console.error(`Error deleting page: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error deleting page: ${error}`);
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


document.getElementById('back-to-graph').addEventListener('click', () => {
    window.location.href = `graph.html?graph_id=${encodeURIComponent(graph_id)}`;
});