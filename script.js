const vertBoardSize = window.innerHeight;
const horBoardSize = window.innerWidth - document.getElementById("menu").offsetWidth;
const squareSize = 20;
const board = createBoard(calcNumSquares(vertBoardSize), calcNumSquares(horBoardSize), null);
const path = "assets/";
const statuses = ["DEAD", "ALIVE", "WALL", "RANDOM", "ZOMBIE"];
var currentStatus = 1;
var mouseDown = false;
var rightClick = false;
var updateInterval = null;
var defaultCell = "RANDOM";
var speed = 250;

document.addEventListener("DOMContentLoaded", function(event) {
    start();
});

function findRemove(htmlElm, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == htmlElm.id) {
            array.splice(i, 1);
            return i;
        }
    }
    return -1;
}

function updateNeighbors(row, col, board) {
    for (let tempRow = row - 1; tempRow <= row + 1; tempRow++) {
        for (let tempCol = col - 1; tempCol <= col + 1; tempCol++) {
            let targetRow = tempRow;
            let targetCol = tempCol;
            if (targetRow < 0) {
                targetRow = board.length - 1;
            } else if (targetRow >= board.length) {
                targetRow = 0;
            }
            if (targetCol < 0) {
                targetCol = board[0].length - 1;
            } else if (targetCol >= board[0].length) {
                targetCol = 0;
            }
            if (targetRow != row || targetCol != col) {
                board[targetRow][targetCol]++;
            }
        }
    }
}

function move(row, col) {
    let posSquares = [];
    for (let tempRow = row - 1; tempRow <= row + 1; tempRow++) {
        for (let tempCol = col - 1; tempCol <= col + 1; tempCol++) {
            let targetRow = tempRow;
            let targetCol = tempCol;
            if (targetRow < 0) {
                targetRow = board.length - 1;
            } else if (targetRow >= board.length) {
                targetRow = 0;
            }
            if (targetCol < 0) {
                targetCol = board[0].length - 1;
            } else if (targetCol >= board[0].length) {
                targetCol = 0;
            }
            if (board[targetRow][targetCol].status == "DEAD") {
                posSquares.push([targetRow, targetCol]);
            }
        }
    }
    return posSquares[getRandomInt(0, posSquares.length - 1)];
}

function updateBoard() {
    let numBoard = createBoard(board.length, board[0].length, 0);
    let zombieNumBoard = createBoard(board.length, board[0].length, 0);
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col].status == "ALIVE") {
                updateNeighbors(row, col, numBoard);
            } else if (board[row][col].status == "ZOMBIE") {
                updateNeighbors(row, col, zombieNumBoard);
            }
        }
    }
    for (let row = 0; row < numBoard.length; row++) {
        for (let col = 0; col < numBoard[0].length; col++) {
            if (board[row][col].status == "ALIVE") {
                aliveInteraction(row, col, numBoard[row][col], zombieNumBoard[row][col]);
            } else if (board[row][col].status == "DEAD") {
                deadInteraction(row, col, numBoard[row][col]);
            } else if (board[row][col].status == "RANDOM") {
                setElm(board[row][col], getRandomStatus());
            } else if (board[row][col].status == "ZOMBIE") {
                zombieInteraction(row,col, numBoard[row][col]);
            }
        }
    }
}

function zombieInteraction(row, col, numAlive){
    if (numAlive>=2){
        setElm(board[row][col], "DEAD");
    } else if (getRandomInt(0,10)==0){
        let targetMove = move(row,col);
        setElm(board[targetMove[0]][targetMove[1]], "ZOMBIE");
        setElm(board[row][col], "DEAD");
    }
}

function deadInteraction(row, col, numAlive) {
    if (numAlive == 3) {
        setElm(board[row][col], "ALIVE");
    } else if (getRandomInt(0, 10000) == 0) {
        setElm(board[row][col], "ZOMBIE");
    }
}


function aliveInteraction(row, col, numAlive, numZombies) {
    if (numZombies > 0 && getRandomInt(0, 1) > 1) {
        setElm(board[row][col], "ZOMBIE");
    } else if (numAlive < 2 || numAlive > 3) {
        setElm(board[row][col], "DEAD");
    } 
}

function getRandomStatus() {
    return statuses[getRandomInt(0, statuses.length - 1)];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateStatus(change) {
    currentStatus += change;
    if (currentStatus < 0) {
        currentStatus = statuses.length - 1;
    } else if (currentStatus >= statuses.length) {
        currentStatus = 0;
    }
    document.getElementById("currentStatus").src = path + statuses[currentStatus] + ".png";
}

document.addEventListener("mousedown", function(event) {
    mouseDown = true;
    if (event.button == 2) {
        rightClick = true;
    }
});

document.addEventListener("mouseup", function(evnet) {
    mouseDown = false;
    rightClick = false;
});

document.addEventListener("mousemove", function(event) {
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

function setElm(elm, statusChange) {
    if (rightClick) {
        elm.src = path + statuses[0] + ".png";
        elm.status = statuses[0];
    } else {
        elm.src = path + statusChange + ".png";
        elm.status = statusChange;
    }
}

function start() {
    document.getElementById("clear").addEventListener("click", function(event) {
        clearInterval(updateInterval);
        updateInterval = null;
        document.getElementById("playPause").src = path + "NEXT.png";
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                setElm(board[row][col], defaultCell);
            }
        }
    })
    document.getElementById("playPause").addEventListener("click", function(event) {
        if (updateInterval == null) {
            updateInterval = setInterval(updateBoard, speed);
            document.getElementById("playPause").src = path + "PAUSE.png";
        } else {
            clearInterval(updateInterval);
            updateInterval = null;
            document.getElementById("playPause").src = path + "NEXT.png";
        }
    });
    document.getElementById("up").addEventListener("click", function(event) {
        updateStatus(-1);
    });
    document.getElementById("down").addEventListener("click", function(event) {
        updateStatus(1);
    });
    document.getElementById("menu").style.left = window.innerWidth - document.getElementById("menu").offsetWidth + "px";
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            board[row][col] = createElm("img", row + "|" + col, squareSize, squareSize, col * squareSize, row * squareSize, "square");
            board[row][col].src = path + "DEAD.png";
            board[row][col].isProcessing = false;
            board[row][col].status = "DEAD";
            board[row][col].addEventListener("click", function(event) {
                let elm = (event.target || event.srcElement);
                if (!elm.isProcessing) {
                    setElm(elm, statuses[currentStatus]);
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