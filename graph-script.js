
let numPages;

let locations = {
    1: [20, 20],
    2: [40, 100],
    3: [60, 180]
}


let connections = {
    1: new Set().add(2),
    2: new Set().add(3)
}

let buttons = {};

let mode = 0;
let prevClick = -2;

let canvas;
let ctx;


(async () => {
    try {
        const response = await fetch('graph-retrieve.php');
        if (response.ok) {
            const data = await response.json();
            numPages = data.length;
            for (let i = 0; i < numPages; i++) {
                let id = data[i]['id'];
                let title = data[i]['title'];
                createButton(id, title);
            }
            canvas = document.getElementById("drawingCanvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx = canvas.getContext("2d");
            drawLines();
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
})();


function createButton(id, title) {
    let button = document.createElement('button');
    button.textContent = title;
    button.classList.add("button");
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
    const x = event.clientX;
    const y = event.clientY;
    eventHandler(-1, x, y);
});


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


function changeMode(newMode) {
    if (prevClick >= 0) {
        buttons[prevClick].classList.toggle("highlighted");
    }
    prevClick = -2;
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
    if (newClick >= 0) {
        if (prevClick === newClick) {
            prevClick = -2;
        } else if (prevClick >= 0) {
            const start = Math.min(prevClick, newClick);
            const end = Math.max(prevClick, newClick);
            if (connections[start].has(end)) {
                connections[start].delete(end);
            } else {
                connections[start].add(end);
            }
            drawLines();
            prevClick = -2;
        } else {
            prevClick = newClick;
        }
    } else {
        prevClick = -2;
    }
}

function movePages(newClick, x, y) {
    if (newClick === -1) {
        if (prevClick >= 0) {
            const prevButton = buttons[prevClick];
            prevButton.classList.toggle("highlighted");
            prevButton.style.left = `${x}px`;
            prevButton.style.top = `${y}px`;
            drawLines();
            locations[prevClick] = [x, y];
            prevClick = -2;
        }
    } else {
        const button = buttons[newClick];
        button.classList.toggle("highlighted");
        if (prevClick < 0) {
            prevClick = newClick;
        } else if (prevClick === newClick) {
            prevClick = -2;
        } else {
            const prevButton = buttons[prevClick];
            prevButton.classList.toggle("highlighted");
            prevClick = newClick;
        }
    }
}


function goToPage(newClick) {
    id = newClick;
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