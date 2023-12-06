
let numPages;
let locations = {}
let connections = {}
let buttons = {};

const defaultLocation = [675, 500];

let mode = 0;
let prevClick = -1;

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
        eventHandler(id, x, y);
    });
    document.body.appendChild(button);
    buttons[id] = button;
}

document.addEventListener("click", (event) => {
    const x = event.pageX;
    const y = event.pageY;
    eventHandler(0, x, y);
});


//Might need to ensure that DOM is loaded first
let positionButton = document.getElementById("changePosition");
positionButton.addEventListener('click', (event) => {
    event.stopPropagation();
    changeMode(1);
});

let linesButton = document.getElementById("editLines");
linesButton.addEventListener('click', (event) => {
    event.stopPropagation();
    changeMode(2);
});

let pageButton = document.getElementById("goToPage");
pageButton.addEventListener('click', (event) => {
    event.stopPropagation();
    changeMode(3);
});

let saveButton = document.getElementById("saveGraph");
saveButton.addEventListener('click', (event) => {
    event.stopPropagation();
    updateGraph();
    alert("Saved Successfully");
});

let createPageButton = document.getElementById("createPage");
createPageButton.addEventListener('click', (event) => {
    event.stopPropagation();
    createPage();
});


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



function changeMode(newMode) {
    if (prevClick > 0) {
        buttons[prevClick].classList.remove("highlighted");
    }
    prevClick = -1;
    positionButton.classList.remove("highlighted");
    linesButton.classList.remove("highlighted");
    pageButton.classList.remove("highlighted");
    if (newMode === mode) {
        mode = 0;
    } else if (newMode === 1) {
        positionButton.classList.add("highlighted");
        mode = 1;
    } else if (newMode === 2) {
        linesButton.classList.add("highlighted");
        mode = 2;
    } else {
        pageButton.classList.add("highlighted");
        mode = 3;
    }
}


function eventHandler(newClick, x, y) {
    if (mode === 1) {
        movePages(newClick, x, y);
    } else if (mode === 2) {
        editConnections(newClick);
    } else if (mode === 3) {
        goToPage(newClick);
    }
}

function editConnections(newClick) {
    if (newClick > 0) {
        if (prevClick === newClick) {
            prevClick = -1;
        } else if (prevClick > 0) {
            const start = Math.min(prevClick, newClick);
            const end = Math.max(prevClick, newClick);
            const index = connections[start].indexOf(end);
            if (index === -1) {
                connections[start].push(end);
            } else {
                connections[start].splice(index, 1);
            }
            drawLines();
            prevClick = -1;
        } else {
            prevClick = newClick;
        }
    } else {
        prevClick = -1;
    }
}

function movePages(newClick, x, y) {
    if (newClick === 0 && prevClick > 0) {
        const prevButton = buttons[prevClick];
        prevButton.classList.toggle("highlighted");
        prevButton.style.left = `${x}px`;
        prevButton.style.top = `${y}px`;
        drawLines();
        locations[prevClick] = [x, y];
        prevClick = -1;
    } else {
        const button = buttons[newClick];
        button.classList.toggle("highlighted");
        if (prevClick < 1) {
            prevClick = newClick;
        } else if (prevClick === newClick) {
            prevClick = -1;
        } else {
            const prevButton = buttons[prevClick];
            prevButton.classList.toggle("highlighted");
            prevClick = newClick;
        }
    }
}


async function createPage() {
    const response = await fetch("page-create.php");
    const id = await response.text();
    goToPage(id);
}


function goToPage(newClick) {
    updateGraph();
    const id = newClick;
    window.location.href = `page.html?id=${encodeURIComponent(id)}`;
}


function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let start in connections) {
        for (let end of connections[start]) {
            const button1 = buttons[start];
            const button2 = buttons[end];
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