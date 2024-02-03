
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
            loadOtherButtons();
        } else {
            console.error(`Error fetching projects: ${error}`)
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();


function createProjectButton(id, name) {
    const projectButton = document.createElement('button');
    projectButton.textContent = name;
    projectButton.classList.add("project-button");
    projectButton.addEventListener("click", (event) => {
        event.stopPropagation();
        stateHandler(id + 3);
    });
    document.querySelector('.projects-container').appendChild(projectButton);
    buttons[id + 3] = projectButton;
}


function loadOtherButtons() {
    const addButton = document.querySelector('#add-project');
    addButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(1);
    });
    const renameButton = document.querySelector('#rename-project')
    renameButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(2);
    });
    const deleteButton = document.querySelector('#delete-project');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(3);
    });
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
    } else if (newClick <= 3 && newClick !== 0) {
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