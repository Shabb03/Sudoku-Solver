var speed = 300;

var sudokuBoard = [[3, 0, 6, 5, 0, 8, 4, 0, 0],
[5, 2, 0, 0, 0, 0, 0, 0, 0],
[0, 8, 7, 0, 0, 0, 0, 3, 1],
[0, 0, 3, 0, 1, 0, 0, 8, 0],
[9, 0, 0, 8, 6, 3, 0, 0, 5],
[0, 5, 0, 0, 9, 0, 6, 0, 0],
[1, 3, 0, 0, 0, 0, 2, 5, 0],
[0, 0, 0, 0, 0, 0, 0, 7, 4],
[0, 0, 5, 2, 0, 6, 3, 0, 0]];

var ogBoard = JSON.parse(JSON.stringify(sudokuBoard));

window.onload = function () {
    document.getElementById("setGameButton").addEventListener("click", setGame);
    document.getElementById("checkGameButton").addEventListener("click", checkGame);
    document.getElementById("solveGameButton").addEventListener("click", solve);
    setGame();
}

function setGame() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = '';

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (ogBoard[r][c] !== 0) {
                tile.innerText = ogBoard[r][c];
                tile.classList.add("tile-start");
            }
            else {
                tile.setAttribute('contenteditable', true);
                tile.textContent = '';
                tile.classList.add("grid-item");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener('input', () => {
                const enteredValue = tile.textContent.trim();
                const coords = tile.id.split("-");
                const row = parseInt(coords[0]);
                const col = parseInt(coords[1]);

                if (enteredValue.length > 1) {
                    //tile.textContent = enteredValue.charAt(enteredValue.length - 1);
                    tile.textContent = enteredValue.charAt(0);
                }

                if (!isValidInput(enteredValue)) {
                    tile.textContent = '';
                }
                removeErrors();
                updateBoard(tile.textContent, row, col);
            });
            document.getElementById("board").append(tile);
        }
    }
}

function isValidInput(input) {
    const regex = /^[0-9]*$/;
    return regex.test(input);
}

function removeErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(function (element) {
        element.classList.remove('error');
    });
}

function checkGame() {
    let complete = true;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const currentTile = sudokuBoard[r][c];
            if (currentTile === 0) {
                complete = false;
                continue;
            }
            const correctNum = correctNumber(sudokuBoard, currentTile, r, c);
            const box = correctBox(sudokuBoard, currentTile, r, c);
            if (!correctNum || !box) {
                complete = false;
                const tile = document.getElementById(r + "-" + c);
                tile.classList.add('error');
            }
        }
    }
    if (complete) {
        completeGrid();
    }
}

function completeGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.classList.remove('grid-item');
        item.classList.add('success');
    });
}

function correctNumber(board, input, row, col) {
    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === input) {
            return false;
        }
    }

    for (let i = 0; i < 9; i++) {
        if (i !== row && board[i][col] === input) {
            return false;
        }
    }
    return true;
}

function correctBox(board, input, row, col) {
    let sqrt = 3;
    let boxRowStart = row - (row % sqrt);
    let boxColStart = col - (col % sqrt);

    for (let r = boxRowStart; r < boxRowStart + sqrt; r++) {
        for (let c = boxColStart; c < boxColStart + sqrt; c++) {
            if (board[r][c] === input && r !== row && c !== col) {
                return false;
            }
        }
    }
    return true;
}

function updateBoard(input, row, col) {
    sudokuBoard[row][col] = Number(input);
}

function solve() {
    var newBoard = JSON.parse(JSON.stringify(sudokuBoard));
    if (!solveSudoku(newBoard)) {
        const errorTitle = document.getElementById('errorTitle');
        errorTitle.textContent = "Error: No Solution Found";
    }
}

function checkForErrors() {
    const errorElements = document.querySelectorAll('.error');
    const errorTitle = document.getElementById('errorTitle');

    if (errorElements.length > 0) {
        errorTitle.textContent = "Error: Some tiles have wrong numbers.";
        return true
    }
    else {
        errorTitle.textContent = "";
        return false
    }
}

async function solveSudoku(board) {
    if (checkForErrors()) {
        return;
    }
    let row = -1;
    let col = -1;
    let isEmpty = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                row = i;
                col = j;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) {
            break;
        }
    }

    if (isEmpty) {
        return true;
    }

    for (let num = 1; num <= 9; num++) {
        const correctNum = correctNumber(board, num, row, col);
        const box = correctBox(board, num, row, col);
        if (correctNum && box) {
            board[row][col] = num;
            const tile = document.getElementById(row + "-" + col);
            tile.textContent = num.toString();
            tile.classList.add('success');
            await delay(speed);
            if (await solveSudoku(board)) {
                return true;
            }
            else {
                board[row][col] = 0;
                tile.textContent = '';
                tile.classList.remove('success');
                await delay(300);
            }
        }
    }
    return false;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function () {
    const rangeSlider = document.getElementById('rangeSlider');
    const sliderValue = document.getElementById('sliderValue');

    rangeSlider.addEventListener('input', function () {
        sliderValue.textContent = this.value;
        const value = (3000 / this.value);
        speed = value.toFixed(2);
    });
});