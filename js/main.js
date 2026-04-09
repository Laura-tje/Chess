/**Main Game Logic */

import * as board from "./board.js";
import * as moves from "./moves.js";
import * as rules from "./rules.js";


let selectedSquare = null;
let selectedPiece = null;
let validMoves = [];
let turn = 1; //white starts
let check = false;

export function onClick(square)
{   
    console.log(`Clicked on square: ${square}`);
    
    // If clicking on your own piece, select it (or reselect if already have something selected)
    if (String(board.boardState[square[0]][square[1]])[0] == String(turn))
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
        for (let move of validMoves)
        {
            if (move[0] == square[0] && move[1] == square[1])
            {
                console.log("Move is valid");
                board.boardState[square[0]][square[1]] = selectedPiece;
                board.boardState[selectedSquare[0]][selectedSquare[1]] = "";
                
                turn = rules.switchTurn(turn); //switch turn after move ALWAYS
                board.updateBoard();
                document.getElementById('turn').textContent = turn === 1 ? 'Wit' : 'Zwart';
                
                //Check for check AFTER the move and turn switch
                // Check if the NEW current player is in check
                check = rules.checkForCheck(1 - turn);
                if (check)
                {
                    console.log("King is in check!");
                    //rules.checkForMate(turn);
                    board.highlightCheck(rules.findKing(1 - turn));
                }
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









