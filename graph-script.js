
const defaultLocation = [675, 500];

let graph_id;

let locations = {}
let connections = {}
let buttons = {};

let firstClick = -1;
let secondClick = -1;

let canvas;
let ctx;


(async () => {
    graph_id = new URLSearchParams(window.location.search).get('graph_id');
    try {
        const response = await fetch('graph-retrieve.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `graph_id=${graph_id}`
        });
        if (response.ok) {
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                const id = data[i]['id'];
                const title = data[i]['title'];
                const xPosition = data[i]['xPosition'];
                const yPosition = data[i]['yPosition'];
                const group = data[i]['connections'];
                if (xPosition === null) {
                    locations[id] = defaultLocation;
                } else {
                    locations[id] = [xPosition, yPosition];
                }
                if (group === '') {
                    connections[id] = [];
                } else {
                    connections[id] = group.split(", ").map(Number);
                }
                createButton(id, title);
            }
            canvas = document.getElementById("drawingCanvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 100;
            ctx = canvas.getContext("2d");
            ctx.strokeStyle = 'white';
            drawLines();
            loadEditorButtons();
        } else {
            console.error(`Error accessing data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();


function createButton(id, title) {
    let button = document.createElement('button');
    button.textContent = title;
    button.classList.add("graphButton");
    let x = locations[id][0];
    let y = locations[id][1];
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent triggering the document click event
        stateHandler(id + 7);
    });
    document.body.appendChild(button);
    buttons[id + 7] = button;
}


function loadEditorButtons() {
    let positionButton = document.getElementById("changePosition");
    positionButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(1);
    });
    let linesButton = document.getElementById("editLines");
    linesButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(2);
    });
    let pageButton = document.getElementById("goToPage");
    pageButton.addEventListener('click', (event) => {
        event.stopPropagation();
        stateHandler(3);
    });
    let createPageButton = document.getElementById("createPage");
    createPageButton.addEventListener('click', (event) => {
        event.stopPropagation();
        createPage();
    });
    let saveButton = document.getElementById("saveGraph");
    saveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        updateGraph();
        alert("Saved Successfully");
    });
    let exitButton = document.getElementById("exitProject");
    exitButton.addEventListener('click', (event) => {
        event.stopPropagation();
        updateGraph();
        window.location.href = `project-list.html`;
    });
    buttons[1] = positionButton;
    buttons[2] = linesButton;
    buttons[3] = pageButton;
    buttons[4] = createPageButton;
    buttons[5] = saveButton;
    buttons[6] = exitButton;
}


document.addEventListener("click", (event) => {
    const x = event.pageX;
    const y = event.pageY;
    stateHandler(0, x, y);
});


async function updateGraph() {
    try {
        const response = await fetch("graph-update.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "locations": locations,
                "connections": connections
            })
        });
    } catch (error) {
        console.error(`Error updating graph: ${error}`);
    }
}


function stateHandler(newClick, x, y) {
    if (newClick < 7 && newClick !== 0) {
        if (firstClick === -1) {
            firstButtonActivate(true, newClick);
        } else if (firstClick !== newClick) {
            firstButtonActivate(false);
            firstButtonActivate(true, newClick);
        }
        if (secondClick !== -1) {
            secondButtonActivate(false);
        }
    } else if (firstClick === 1) {
        if (secondClick === -1) {
            if (newClick === 0) {
                firstButtonActivate(false);
            } else {
                secondButtonActivate(true, newClick);
            }
        } else if (newClick === 0) {
            movePages(secondClick, x, y);
            secondButtonActivate(false);
        } else {
            firstButtonActivate(false);
            secondButtonActivate(false);
        }
    } else if (firstClick === 2) {
        if (secondClick === -1) {
            if (newClick === 0) {
                firstButtonActivate(false);
            } else {
                secondButtonActivate(true, newClick);
            }
        } else if (newClick >= 7 && newClick !== secondClick) {
            editConnections(secondClick - 7, newClick - 7);
            secondButtonActivate(false);
        } else {
            firstButtonActivate(false);
            secondButtonActivate(false);
        }
    } else if (firstClick === 3) {
        if (newClick >= 7) {
            goToPage(newClick - 7);
        } else {
            firstButtonActivate(false);
        }
    }
}


function firstButtonActivate(activate, newClick) {
    if (activate) {
        firstClick = newClick;
        buttons[firstClick].classList.add("highlighted");
    } else {
        buttons[firstClick].classList.remove("highlighted");
        firstClick = -1;
    }
}


function secondButtonActivate(activate, newClick) {
    if (activate) {
        secondClick = newClick;
        buttons[secondClick].classList.add("highlighted");
    } else {
        buttons[secondClick].classList.remove("highlighted");
        secondClick = -1;
    }
}


function editConnections(id1, id2) {
    const start = Math.min(id1, id2);
    const end = Math.max(id1, id2);
    const index = connections[start].indexOf(end);
    if (index === -1) {
        connections[start].push(end);
    } else {
        connections[start].splice(index, 1);
    }
    drawLines();
}


function movePages(newClick, x, y) {
    const button = buttons[newClick];
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    drawLines();
    locations[newClick - 7] = [x, y];
}


async function createPage() {
    try {
        const response = await fetch('page-create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `graph_id=${graph_id}`
        });
        if (response.ok) {
            const page_id = await response.text();
            goToPage(page_id);
        } else {
            console.error("Error creating page");
        }
    } catch (error) {
        console.error(`Error creating page: ${error}`);
    } 
}


function goToPage(page_id) {
    updateGraph();
    window.location.href = `page.html?page_id=${encodeURIComponent(page_id)}&graph_id=${encodeURIComponent(graph_id)}`;
}


function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let start in connections) {
        start = parseInt(start);
        for (let end of connections[start]) {
            const button1 = buttons[start + 7];
            const button2 = buttons[end + 7];
            const x1 = button1.offsetLeft;
            const y1 = button1.offsetTop;
            const x2 = button2.offsetLeft;
            const y2 = button2.offsetTop;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
}