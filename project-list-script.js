let projectButtons = {};

(async () => {
    try {
        const response = await fetch('project-retrieve.php');
        if (response.ok) {
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                const id = data[i]['id'];
                const name = data[i]['name'];
                createProjectButton(id, name);
            }
            createOtherButtons();
        } else {
            console.error(`Error fetching projects: ${error}`)
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();


function createProjectButton(id, name) {
    let projectButton = document.createElement('button');
    projectButton.textContent = name;
    projectButton.classList.add("projects-container");
    projectButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent triggering the document click event
        window.location.href = `graph.html?graph_id=${encodeURIComponent(id)}`;
    });
    document.body.appendChild(projectButton);
    projectButtons[id] = projectButton;
}


function createOtherButtons() {
    let button = document.createElement("button");
    button.id = "rename-project";
    button.className = "editor-button";
    button.textContent = "Rename";
    document.body.appendChild(button);
}

//Create state handler