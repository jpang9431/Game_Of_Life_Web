const vertBoardSize = window.innerHeight;
const horBoardSize = window.innerWidth - document.getElementById("menu").offsetWidth;
const squareSize = 20;
const board = createBoard(calcNumSquares(vertBoardSize), calcNumSquares(horBoardSize), null);
const path = "assets/";
const statuses = ["DEAD", "ALIVE", "RANDOM", "WALL"];
var currentStatus = 1;
var mouseDown = false;

document.addEventListener("DOMContentLoaded", function (event) {
    start();
});

document.addEventListener("mousedown", function (event) {
    mouseDown = true;
});

document.addEventListener("mouseup", function (evnet) {
    mouseDown = false;
});

document.addEventListener("mousemove", function (event) {
    let row = Math.floor(event.clientY / squareSize);
    let col = Math.floor(event.clientX / squareSize);
    if (row < 0) {
        row = 0;
    }
    if (col < 0) {
        col = 0;
    }
    if (row < board.length && col < board[0].length && mouseDown) {
        document.getElementById(row + "|" + col).click();
    }
})

function calcNumSquares(size) {
    return (size - size % squareSize) / squareSize;
}

function start() {
    document.getElementById("menu").style.left = window.innerWidth - document.getElementById("menu").offsetWidth + "px";
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            board[row][col] = createElm("img", row + "|" + col, squareSize, squareSize, col * squareSize, row * squareSize, "square");
            board[row][col].src = path + "DEAD.png";
            board[row][col].isProcessing = false;
            board[row][col].status = "DEAD";
            board[row][col].addEventListener("click", function (event) {
                let elm = (event.target || event.srcElement);
                if (!elm.isProcessing) {
                    elm.src = path + statuses[currentStatus] + ".png";
                }
            })
        }
    }
}

function createBoard(rows, cols, value) {
    let returnBoard = [];
    for (let row = 0; row < rows; row++) {
        let rowList = [];
        for (let col = 0; col < cols; col++) {
            rowList.push(value);
        }
        returnBoard.push(rowList);
    }
    return returnBoard;
}

function createElm(type, id, width, height, left, top, className = "", text = "", inputElm = null,) {
    let elm = document.createElement(type);
    elm.style.position = "absolute";
    if (inputElm != null) {
        elm = inputElm;
    }
    elm.setAttribute("id", id);
    if (className != "") {
        elm.setAttribute("class", className);
    }
    elm.innerHTML = text;
    elm.style.width = width + "px";
    elm.style.height = height + "px";
    elm.style.left = left + "px";
    elm.style.top = top + "px";
    document.body.append(elm);
    return elm;
}