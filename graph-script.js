
let numPages;

let locations = [
    [20, 20],
    [40, 100],
    [60, 180]
];

let connections = [
    [false, true, false],
    [false, false, true],
    [false, false, false]
]

let buttons = [];

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
                createButton(id, title, i);
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


function createButton(id, title, index) {
    let button = document.createElement('button');
    button.id = id;
    button.textContent = title;
    button.classList.add("button");
    let x = locations[index][0];
    let y = locations[index][1];
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent triggering the document click event
        eventHandler(index, x, y);
    });
    document.body.appendChild(button);
    buttons.push(button);
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
    console.log(newMode);
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
            const min = Math.min(prevClick, newClick);
            const max = Math.max(prevClick, newClick);
            connections[min][max] = !connections[min][max];
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
    let id = buttons[newClick].id;
    window.location.href = `page.html?id=${encodeURIComponent(id)}`;
}


function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numPages; i++) {
        for (let j = 0; j < numPages; j++) {
            if (connections[i][j]) {
                const button1 = buttons[i];
                const button2 = buttons[j];
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
}