
let buttons = {};
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
        stateHandler(id + 3);
    });
    document.body.appendChild(projectButton);
    buttons[id + 3] = projectButton;
}


function createOtherButtons() {
    let addButton = document.createElement("button");
    addButton.id = "add-project";
    addButton.classList.add("editor-button");
    addButton.textContent = "Add Project";
    addButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(1);
    });
    let renameButton = document.createElement("button");
    renameButton.id = "rename-project";
    renameButton.classList.add("editor-button");
    renameButton.textContent = "Rename";
    renameButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(2);
    });
    let deleteButton = document.createElement("button");
    deleteButton.id = "delete-project";
    deleteButton.classList.add("editor-button");
    deleteButton.textContent = "Delete Project";
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(3);
    });
    document.body.appendChild(addButton);
    document.body.appendChild(renameButton);
    document.body.appendChild(deleteButton);
    buttons[1] = addButton;
    buttons[2] = renameButton;
    buttons[3] = deleteButton;
}


document.addEventListener("click", (event) => {
    stateHandler(0);
});


function stateHandler(newClick) {
    if (newClick === 0 && firstClick !== -1) {
        buttonActivate(false);
    } else if (newClick === 1) {
        if (firstClick !== -1) {
            buttonActivate(false);
        }
        addProject();
    } else if (newClick <= 3) {
        if (firstClick === -1) {
            buttonActivate(true, newClick);
        } else if (firstClick !== newClick) {
            buttonActivate(false);
            buttonActivate(true, newClick);
        }
    } else if (newClick > 3) {
        if (firstClick === -1) {
            goToProject(newClick - 3);
        } else if (firstClick === 2) {
            renameProject(newClick - 3);
            buttonActivate(false);
        } else if (firstClick === 3) {
            deleteProject(newClick - 3);
            buttonActivate(false);
        }
    }
}


function buttonActivate(activate, newClick) {
    if (activate) {
        firstClick = newClick;
        buttons[firstClick].classList.add("highlighted");
    } else {
        buttons[firstClick].classList.remove("highlighted");
        firstClick = -1;
    }
}


function goToProject(id) {
    window.location.href = `graph.html?graph_id=${encodeURIComponent(id)}`;
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
    const oldName = buttons[id + 3].textContent;
    const newName = prompt("Rename '" + oldName + "': ");
    if (newName !== null && newName !== "") {
        buttons[id + 3].textContent = newName;
        try {
            const response = await fetch('project-rename.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${id}&name=${newName}`
            });
        } catch (error) {
            console.error(`Error renaming project: ${error}`);
        }
    }
}


async function deleteProject(id) {
    const name = buttons[id + 3].textContent;
    const confirmed = confirm("Do you want to delete '" + name + "'?");
    if (confirmed) {
        try {
            const response = await fetch('project-delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${id}`
            });
            location.reload();
        } catch (error) {
            console.error(`Error deleting project: ${error}`);
        }
    }
}