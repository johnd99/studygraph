let buttons = {};

(async () => {
    try {
        const response = await fetch('project-retrieve.php');
        if (response.ok) {
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                const id = data[i]['id'];
                const name = data[i]['name'];
                createButton(id, name);
            }
        } else {
            console.error(`Error fetching projects: ${error}`)
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();


function createButton(id, name) {
    let button = document.createElement('button');
    button.textContent = name;
    //button.classList.add("graphButton");
    button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent triggering the document click event
        window.location.href = `graph.html?graph_id=${encodeURIComponent(id)}`;
    });
    document.body.appendChild(button);
    buttons[id] = button;
}