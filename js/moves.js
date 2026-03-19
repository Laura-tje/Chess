/**Valid Moves*/
import * as board from "./board.js";

let validMoves = [];

export function calcValidMoves(piece, row, col)
{
    validMoves = [];
    validMoves.push([row, col]);

    switch (piece)
    {
        case "1p":
            validWhitePawnMove(piece, row, col);
            break;
        case "0p":
            validBlackPawnMove(piece, row, col);
            break;
        case "1r" || "0r":
            validRookMove(piece, row, col);
            break;
        case "1n" || "0n":
            validKnightMove(piece, row, col);
            break;
        case "1b" || "0b":
            validBishopMove(piece, row, col);
            break;
        case "1q" || "0q":
            validQueenMove(piece, row, col);
            break;
        case "1k" || "0k":
            validKingMove(piece, row, col);
            break;
    }
    
    for (let move of validMoves)
    {
        console.log(`valid moves are: ${move}`);
    }

    return validMoves;
}

function validWhitePawnMove(piece, row, col) //NOT DONE YET -- EN PASSANT, PROMOTE
{
    //MOVEMENT FORWARD
    if (board.boardState[row - 1][col] == "") //check if square in front is empty
    {
        if (row == 6) //starting pos
        {
            validMoves.push([row - 1, col]);
            validMoves.push([row - 2, col]);
        } else //not starting pos
        {
            validMoves.push([row - 1, col]);
        }
    }


    //MOVEMENT DIAGONALLY
    //capture move left
    if (board.boardState[row - 1][col - 1] != "" && String(board.boardState[row - 1][col - 1])[0] == "0")
    {
        validMoves.push([row - 1, col - 1]);
    } 
    
    //capture move right
    if (board.boardState[row - 1][col + 1] != "" && String(board.boardState[row - 1][col + 1])[0] == "0")
    {
        validMoves.push([row - 1, col + 1]);
    }
}

function validBlackPawnMove(piece, row, col) //NOT DONE YET -- EN PASSANT, PROMOTE
{
    //MOVEMENT FORWARD
    if (board.boardState[row + 1][col] == "") //check if square in front is empty
    {
        if (row == 1) //starting pos
        {
            validMoves.push([row + 1, col]);
            validMoves.push([row + 2, col]);
        } else //not starting pos
        {
            validMoves.push([row + 1, col]);
        }
    }

    //MOVEMENT DIAGONALLY
    //capture move left
    if (board.boardState[row + 1][col - 1] != "" && String(board.boardState[row + 1][col - 1])[0] == "1")
    {
        validMoves.push([row + 1, col - 1]);
    } 
    
    //capture move right
    if (board.boardState[row + 1][col + 1] != "" && String(board.boardState[row + 1][col + 1])[0] == "1")
    {
        validMoves.push([row + 1, col + 1]);
    }
}