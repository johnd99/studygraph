
let numPages;
let locations = {}
let connections = {}
let buttons = {};

const defaultLocation = [675, 500];

let firstClick = -1;
let secondClick = -1;

let canvas;
let ctx;


(async () => {
    try {
        const response = await fetch('graph-retrieve.php');
        if (response.ok) {
            const data = await response.json();
            numPages = data.length;
            for (let i = 0; i < numPages; i++) {
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
        stateHandler(id + 6);
    });
    document.body.appendChild(button);
    buttons[id + 6] = button;
}

document.addEventListener("click", (event) => {
    const x = event.pageX;
    const y = event.pageY;
    stateHandler(0, x, y);
});


//Might need to ensure that DOM is loaded first
let positionButton = document.getElementById("changePosition");
positionButton.addEventListener('click', (event) => {
    event.stopPropagation();
    stateHandler(1);
});
buttons[1] = positionButton;

let linesButton = document.getElementById("editLines");
linesButton.addEventListener('click', (event) => {
    event.stopPropagation();
    stateHandler(2);
});
buttons[2] = linesButton;

let pageButton = document.getElementById("goToPage");
pageButton.addEventListener('click', (event) => {
    event.stopPropagation();
    stateHandler(3);
});
buttons[3] = pageButton;

let saveButton = document.getElementById("saveGraph");
saveButton.addEventListener('click', (event) => {
    event.stopPropagation();
    updateGraph();
    alert("Saved Successfully");
});
buttons[4] = saveButton;

let createPageButton = document.getElementById("createPage");
createPageButton.addEventListener('click', (event) => {
    event.stopPropagation();
    createPage();
});
buttons[5] = createPageButton;


async function updateGraph() {
    const response = await fetch("graph-update.php", {
        method: "POST",
        body: JSON.stringify({
            "locations": locations,
            "connections": connections
        })
    });
    if (!response.ok) {
        console.error("Error sending data:", response.status, response.statusText);
    }
}


function stateHandler(newClick, x, y) {
    if (firstClick === -1 && newClick < 6 && newClick !== 0) {
        firstClick = newClick;
        buttons[firstClick].classList.add("highlighted");
    } else if (firstClick === 1) {
        if (secondClick === -1) {
            if (newClick >= 6) {
                secondClick = newClick;
                buttons[secondClick].classList.add("highlighted");
            } else {
                buttons[firstClick].classList.remove("highlighted");
                firstClick = -1;
            }
        } else if (newClick === 0) {
            movePages(secondClick, x, y);
            undoHighlight(); 
        } else {
            undoHighlight();
        }
    } else if (firstClick === 2) {
        if (secondClick === -1) {
            if (newClick >= 6) {
                secondClick = newClick;
                buttons[secondClick].classList.add("highlighted");
            } else {
                buttons[firstClick].classList.remove("highlighted");
                firstClick = -1;
            }
        } else if (newClick >= 6 && newClick !== secondClick) {
            editConnections(secondClick - 6, newClick - 6);
            undoHighlight(); 
        } else {
            undoHighlight();
        }
    } else if (firstClick === 3) {
        if (newClick >= 6) {
            goToPage(newClick - 6);
        } else {
            buttons[firstClick].classList.remove("highlighted");
            firstClick = -1;
        }
    }
}


function undoHighlight() {
    buttons[firstClick].classList.remove("highlighted");
    buttons[secondClick].classList.remove("highlighted");
    firstClick = -1;
    secondClick = -1;
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
    locations[newClick - 6] = [x, y];
}


async function createPage() {
    const response = await fetch("page-create.php");
    const id = await response.text();
    goToPage(id);
}


function goToPage(id) {
    updateGraph();
    window.location.href = `page.html?id=${encodeURIComponent(id)}`;
}


function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let start in connections) {
        start = parseInt(start);
        for (let end of connections[start]) {
            const button1 = buttons[start + 6];
            const button2 = buttons[end + 6];
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