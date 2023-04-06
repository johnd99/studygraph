(async () => {
    try {
        const response = await fetch('graph-retrieve.php');
        if (response.ok) {
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                let id = data[i]['id'];
                let title = data[i]['title'];
                let button = document.createElement('button');
                button.textContent = title
                button.addEventListener('click', () => getPage(id, title));
                document.body.appendChild(button);
            }
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();

function getPage(id, title) {
    alert(id);
    alert(title);
}