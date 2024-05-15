const vertBoardSize = window.innerHeight;
const horBoardSize = window.innerWidth - document.getElementById("menu").offsetWidth;
const squareSize = 20;
const board = createBoard(calcNumSquares(vertBoardSize), calcNumSquares(horBoardSize), null);
const path = "assets/";
const statuses = ["DEAD", "ALIVE", "WALL", "RANDOM"];
var currentStatus = 1;
var mouseDown = false;
var rightClick = false;
var updateInterval = null;

document.addEventListener("DOMContentLoaded", function (event) {
    start();
    
});

function findRemove(htmlElm, array){
    for(let i=0; i<array.length; i++){
        if (array[i].id==htmlElm.id){
            array.splice(i,1);
            return i;
        }
    }
    return -1;
}

function updateNeighbors(row, col, board){
    for(let tempRow = row-1; tempRow<=row+1; tempRow++){
        for(let tempCol = col-1; tempCol<=col+1; tempCol++){
            if (tempRow>=0&&tempRow<board.length&&tempCol>=0&&tempCol<board[0].length&&(tempRow!=row||tempCol!=col)){
                board[tempRow][tempCol]++;
            }
        }
    }
}

function updateBoard(){
    let numBoard = createBoard(board.length, board[0].length, 0);
    for(let row=0; row<board.length; row++){
        for(let col=0; col<board[0].length; col++){
            if (board[row][col].status=="RANDOM"){
                setElm(board[row][col], getRandomStatus());
            } else if (board[row][col].status=="ALIVE"){
                
            }
        }
    }
}

function getRandomStatus(){
    return statuses[getRandomInt(0,statuses.length-1)];
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

document.addEventListener("mousedown", function (event) {
    mouseDown = true;
    if (event.button==2){
        rightClick = true;
    }
});

document.addEventListener("mouseup", function (evnet) {
    mouseDown = false;
    rightClick = false;
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

function setElm(elm, statusChange){
    if (rightClick){
        elm.src = path + statuses[0] + ".png";
        elm.status = statuses[0];
    } else {
        if (elm.status=="ALIVE"&&statusChange!="ALIVE"){
            findRemove(elm, aliveSquares);
        } else if (elm.status="RANDOM"&&statusChange!="RANDOM"){
            findRemove(elm, randomSquares);
        }
        elm.src = path + statusChange +".png";
        elm.status = statusChange;
    }
}

function start() {
    document.getElementById("playPause").addEventListener("click", function(event){
        if (updateInterval==null){
            updateInterval = setInterval(updateBoard, 30);
            document.getElementById("playPause").src = path+"PAUSE.png";
        } else {
            clearInterval(updateInterval);
            updateInterval = null;
            document.getElementById("playPause").src = path+"NEXT.png";
        }
    });
    document.getElementById("up").addEventListener("click", function (event) {
        updateStatus(-1);
    });
    document.getElementById("down").addEventListener("click", function (event) {
        updateStatus(1);
    });
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