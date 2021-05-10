




/*
function setTableSize() {
    actualTable.style.width = squareSidePx * cols + "px";
    actualTable.style.height = squareSidePx * rows + "px";
}
*/

class Square {
    constructor(elmnt, row, col) {
        this.element = elmnt;
        this.position = [row, col];
        this.isMine = false;
        this.visible = false;
        this.flagged = false;
        this.initialClick = false;
    }
    setVisible() {
        if (this.visible) return;
        if (!this.visible && !this.isMine) visibleCount++;
        this.visible = true;
        this.element.className = "visible square";
        if (this.isMine) {
            this.element.className += " mine";
            this.element.textContent = "💣";

        } else if (this.mines !== 0) {
            this.element.textContent = this.mines;
            this.element.className += " n" + this.mines;
        }
    }
    setFlagged() {
        if (this.visible === true) return;
        if (this.flagged) {
            this.element.textContent = this.mines === undefined ? "" : this.mines;
            this.flagged = false;

            increaseRemainMines();
        }
        else {
            this.flagged = true;
            this.element.textContent = "🚩";
            decreaseRemainMines();
        }
    }
}
function gameLost() {
    minesArray.forEach(mine => mine.setVisible());
    isGameLost = true;
    remainingMinesDOM.textContent = 0;
    gameOn = false;

}
function gameWon() {
    minesArray.forEach(mine => mine.setVisible());
    isGameWon = true;
    remainingMinesDOM.textContent = 0;
    gameOn = false;
}


function checkClick(event, square) {
    if (isGameLost || isGameWon) return;
    if (window.attachEvent && !window.addEventListener) {
        if (event.button === 1) {
            revealSquare(square);
        } else if (event.button === 2) {
            square.setFlagged();
        }
    } else {
        if (event.button === 0) {
            revealSquare(square);
        } else if (event.button === 2) {
            square.setFlagged();
        }
    }

}

function decreaseRemainMines() {
    remainingMines--;
    showRemainingMines();
}
function increaseRemainMines() {
    remainingMines++;
    showRemainingMines();
}
function showRemainingMines() {
    remainingMinesDOM.textContent = remainingMines;
}
function createGrid(width, height) {
    remainingMines = totalMines;
    showRemainingMines();

    gameOn = false;
    visibleCount = 0;
    isGameWon = false;
    squares = [];
    tableDOM.innerHTML = "";
    isGameLost = false;

    for (let i = 0; i < height; i++) {
        let rowArray = [];
        let rowDOM = document.createElement("tr")
        for (let j = 0; j < width; j++) {

            let squareDOM = document.createElement("td");
            let squareTEMP = new Square(squareDOM, i, j);
            squareDOM.className = "blank square";
            squareDOM.id = i + "_" + j;
            //square.onclick = function () { revealSquare(square) };
            squareDOM.addEventListener("mouseup", function (event) { checkClick(event, squareTEMP) });

            rowDOM.appendChild(squareDOM);
            rowArray.push(squareTEMP);

        }

        tableDOM.appendChild(rowDOM);
        squares.push(rowArray);
    }
}

function revealSquare(square) {
    if (square.visible || square.flagged) return;
    if (!gameOn) {
        assignSquares(square);

        gameOn = true;
    }

    if (square.isMine) {
        gameLost();
        return;
    }
    updateDisplay(square);

}

function updateDisplay(square) {
    if (isGameWon || isGameLost) {
        return;
    }

    if (setMineNb(square)) {
        let [row, col] = square.position;
        for (let i = Math.max(row - 1, 0); i <= row + 1 && i < rows && i >= 0; i++) {
            for (let j = Math.max(col - 1, 0); j <= col + 1 && j < cols && j >= 0; j++) {
                if (i === row && col === j) continue;
                if (squares[i][j].visible) continue;
                if (squares[i][j].isMine) continue;

                updateDisplay(squares[i][j]);
            }
        }
    }

    square.setVisible();

    if ((squares.length * squares[0].length - visibleCount) === minesArray.length) gameWon();
}

function setMineNb(square) {
    if (square.mines !== undefined) return false;
    let [row, col] = square.position;

    let mineCount = 0;
    for (let i = Math.max(row - 1, 0); i <= row + 1 && i < rows && i >= 0; i++) {
        for (let j = Math.max(col - 1, 0); j <= col + 1 && j < cols && j >= 0; j++) {
            if (i === row && col === j) continue;
            if (squares[i][j].isMine) mineCount++;
        }
    }
    square.mines = mineCount;
    return (mineCount === 0 && !square.isMine && !square.visible);
}

function assignSquares(square) {

    let [row, col] = square.position;

    for (let i = Math.max(row - 1, 0); i <= row + 1 && i < rows && i >= 0; i++) {
        for (let j = Math.max(col - 1, 0); j <= col + 1 && j < cols && j >= 0; j++) {
            squares[i][j].initialClick = true;
        }
    }

    minesArray = [];
    let assignedMines = 0;

    while (assignedMines != totalMines) {
        let i = Math.floor(Math.random() * rows);
        let j = Math.floor(Math.random() * cols);
        if (squares[i][j].isMine !== true && squares[i][j].initialClick !== true) {
            squares[i][j].isMine = true;
            minesArray.push(squares[i][j]);
            assignedMines++;
        }
    }

}

function settingsClick() {
    settingsOn ? closeSettings() : openSettings();
}

function openSettings() {
    settingsOn = true;
    settingWheel.style.transform = "rotate(90deg)";
}

function closeSettings() {
    settingsOn = false;
    settingWheel.style.transform = "rotate(0deg)";
}


var gameOn;
var isGameLost;
var isGameWon;
var squares;
var minesArray;
var cols = 20;
var rows = 20;
var totalMines = 20;
var tableDOM;
var visibleCount = 0;
var squareSidePx = 25;
var actualTable;
var remainingMines;
var settingsOn = false;


settingWheel = document.getElementById("wheel");
remainingMinesDOM = document.getElementById("remainingMines");
tableDOM = document.getElementById("game");
actualTable = document.getElementById("table");
//setTableSize();
tableDOM.addEventListener("contextmenu", function (e) {
    e.preventDefault();
})
var restartBtn = document.getElementById("restart");
restartBtn.addEventListener("click", function () { createGrid(cols, rows) });

createGrid(cols, rows);
