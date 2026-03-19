/**Main Game Logic */

import * as board from "./board.js";
import * as moves from "./moves.js";
import * as rules from "./rules.js";


let selectedSquare = null;
let selectedPiece = null;
let validMoves = [];
let turn = 1; //white starts

export function onClick(square)
{   
    console.log(`Clicked on square: ${square}`);
    
    if (selectedSquare == null && String(board.boardState[square[0]][square[1]])[0] == String(turn)) //select piece check for turn and show valid moves
    {
        selectedSquare = square;
        selectedPiece = board.boardState[square[0]][square[1]];

        //valid moves
        validMoves = moves.calcValidMoves(selectedPiece, selectedSquare[0], selectedSquare[1]);
        board.drawValidMoves(validMoves);
        board.updateBoard();
    } 
    else if (selectedSquare != null)
    {
        //!!!!!!!!!!!!!!!! CHECK FOR CHECK AND MATE HERE !!!!!!!!!!!!!!
        for (let move of validMoves)
        {
            if (move[0] == square[0] && move[1] == square[1])
            {
                console.log("Move is valid");
                //check hier of en welke piece geslagen wordt
                if (board.boardState[square[0]][square[1]] != selectedPiece)
                {
                    board.boardState[square[0]][square[1]] = selectedPiece;
                    board.boardState[selectedSquare[0]][selectedSquare[1]] = "";
                    turn = rules.switchTurn(turn); //switch turn after move
                }
                board.updateBoard();
                document.getElementById('turn').textContent = turn === 1 ? 'Wit' : 'Zwart';
                break;
            }
            console.log("Move is invalid");
        }
        selectedSquare = null;
        selectedPiece = null;
        validMoves = [];
        board.drawValidMoves(validMoves);
    }
    // console.log(selectedPiece)
    // console.log(selectedSquare)

}

board.createBoard();









