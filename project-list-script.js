
let projectButtons = {};
let firstClick = -1;

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
        event.stopPropagation();
        //window.location.href = `graph.html?graph_id=${encodeURIComponent(id)}`;
        stateHandler(id);
    });
    document.body.appendChild(projectButton);
    projectButtons[id] = projectButton;
}


function createOtherButtons() {
    let renameButton = document.createElement("button");
    renameButton.id = "rename-project";
    renameButton.className = "editor-button";
    renameButton.textContent = "Rename";
    renameButton.addEventListener('click', (event) => {
        event.stopPropagation();
        //Finish this
    });
    document.body.appendChild(renameButton);
    let addButton = document.createElement("button");
    addButton.id = "add-project";
    addButton.className = "editor-button";
    addButton.textContent = "Add Project";
    addButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(0);
        //Finish this
    });
    document.body.appendChild(addButton);
}


function stateHandler(newClick) {
    //renameProject(newClick);
    //addProject();
    deleteProject();
}


async function deleteProject() {
    // Do this
    
}


async function addProject() {
    const name = prompt("Enter project name: ");
    if (name !== null && name !== "") {
        try {
            const response = await fetch('project-add.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `name=${name}`
            });
            location.reload();
        } catch (error) {
            console.error(`Error creating project: ${error}`);
        }
    }
    
}


async function renameProject(id) {
    const oldName = projectButtons[id].textContent;
    const newName = prompt("Rename '" + oldName + "': ");
    if (newName !== null && newName !== "") {
        projectButtons[id].textContent = newName;
        try {
            const response = await fetch('project-rename.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${id}&name=${newName}`
            });
            if (!response.ok) {
                console.error(`Error renaming project: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error renaming project: ${error}`);
        }
    }
}