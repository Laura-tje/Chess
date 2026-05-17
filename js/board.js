/**Only board state */

import * as main from "./main.js";

export let boardState = 
[
["0r", "0n", "0b", "0q", "0k", "0b", "0n", "0r"],
["0p", "0p", "0p", "0p", "0p", "0p", "0p", "0p"],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["1p","1p", "1p", "1p", "1p", "1p", "1p", "1p"],
["1r", "1n", "1b", "1q", "1k", "1b", "1n", "1r"]
];

export function resetBoard()
{
    const initialState = 
    [
    ["0r", "0n", "0b", "0q", "0k", "0b", "0n", "0r"],
    ["0p", "0p", "0p", "0p", "0p", "0p", "0p", "0p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["1p","1p", "1p", "1p", "1p", "1p", "1p", "1p"],
    ["1r", "1n", "1b", "1q", "1k", "1b", "1n", "1r"]
    ];
    
    // Clear and refill the boardState array
    for (let row = 0; row < 8; row++)
    {
        for (let col = 0; col < 8; col++)
        {
            boardState[row][col] = initialState[row][col];
        }
    }
}

const pieceIcons = 
{
"1r": "♖", "1n": "♘", "1b": "♗", "1q": "♕", "1k": "♔", "1p": "♙",
"0r": "♜", "0n": "♞", "0b": "♝", "0q": "♛", "0k": "♚", "0p": "♟",
"": ""
};

const board = document.getElementById("chessboard");
const boardButtons = [];
export let boardFlipped = false; // Voor zwart speler

export function setFlipped(flipped) {
    boardFlipped = flipped;
    createBoard(); // Reteken bord met nieuwe volgorde
}

export function createBoard()
{
    // Clear bestaand bord
    board.innerHTML = '';
    
    // Bepaal loop volgorde
    const rows = boardFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const cols = boardFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    
    for (let row of rows) 
    {
        for (let col of cols) 
        {
            const cell = document.createElement("div");

            if ((row + col) % 2 == 0) 
            {
                cell.className = "cell light";
            } 
            else
            {
                cell.className = "cell dark";
            }

            cell.textContent = pieceIcons[boardState[row][col]];

            cell.dataset.row = row; 
            cell.dataset.col = col; 

            cell.addEventListener("click", () => main.onClick([parseInt(cell.dataset.row), parseInt(cell.dataset.col)]));            board.appendChild(cell);
            
            //boardButtons[row][col] = cell;
        }
    }
}

export function drawValidMoves(validMoves) //FIX THIS, NOT MY OWN CODE
{
    // Verwijder eerst alle bestaande highlights
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("valid-move");
    });
    
    // Voeg highlight toe aan valid moves
    validMoves.forEach(move => {
        // Handle both old format [toRow, toCol] and new format [fromRow, fromCol, toRow, toCol]
        const toRow = move.length === 4 ? move[2] : move[0];
        const toCol = move.length === 4 ? move[3] : move[1];
        const cell = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
        if (cell) {
            cell.classList.add("valid-move");
        }
    });
}

export function highlightCheck(kingPos)
{
    // Remove all existing check highlights first
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("check");
    });
    
    // Highlight the king in check
    if (kingPos) {
        const cell = document.querySelector(`[data-row="${kingPos[0]}"][data-col="${kingPos[1]}"]`);
        if (cell) {
            cell.classList.add("check");
        }
    }
}


export function updateBoard()
{
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.textContent = pieceIcons[boardState[row][col]];
    });
}