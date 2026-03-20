/**Valid Moves*/
import * as board from "./board.js";

let validMoves = [];

export function calcValidMoves(piece, row, col)
{
    validMoves = [];
    validMoves.push([row, col]);

    switch (String(piece)[1])
    {
        case "p":
            //FIX SWITCH IN SWITCH, ITS UGGLY AF
            switch (String(piece)[0])
            {
                case "1":
                    validWhitePawnMove(piece, row, col);
                    break;
                case "0":
                    validBlackPawnMove(piece, row, col);
                    break;
            }
            break;
        case "r":
            validRookMove(piece, row, col);
            break;
        case "n":
            validKnightMove(piece, row, col);
            break;
        case "b":
            validBishopMove(piece, row, col);
            break;
        case "q":
            validQueenMove(piece, row, col);
            break;
        case "k":
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
            if (board.boardState[row - 1][col] == "") //Check if empty
            {
                validMoves.push([row - 1, col]);
            }
            if (board.boardState[row - 2][col] == "") //Check if empty
            {
                validMoves.push([row - 2, col]);
            }
        } 
        else //not starting pos
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
            if (board.boardState[row + 1][col] == "") //Check if empty
            {
                validMoves.push([row + 1, col]);
            }
            if (board.boardState[row + 2][col] == "") //Check if empty
            {
                validMoves.push([row + 2, col]);
            }
        } 
        else //not starting pos
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

function validRookMove(piece, row, col)
{
    //HORIZONTAL MOVEMENT -- LEFT
    for (let i = col - 1; i >= 0; i--)
    {
        if (board.boardState[row][i] == "") //If empty
        {
            validMoves.push([row, i]);
        } 
        else if (String(board.boardState[row][i])[0] != String(piece)[0]) //If piece is of opposite color
        {
            validMoves.push([row, i]);
            break;
        } 
        else
        {
            break;
        }
    }

    //HORIZONTAL MOVEMENT -- RIGHT
    for (let i = col + 1; i < 8; i++)
    {
        if (board.boardState[row][i] == "") //If empty
        {
            validMoves.push([row, i]);
        } 
        else if (String(board.boardState[row][i])[0] != String(piece)[0]) //If piece is of opposite color
        {
            validMoves.push([row, i]);
            break;
        } 
        else
        {
            break;
        }
    }

    //VERTICAL MOVEMENT -- UP
    for (let i = row - 1; i >= 0; i--)
    {
        if (board.boardState[i][col] == "") //If empty  
        {
            validMoves.push([i, col]);
        } 
        else if (String(board.boardState[i][col])[0] != String(piece)[0]) //If piece is of opposite color
        {
            validMoves.push([i, col]);
            break;
        }
        else
        {
            break;
        }
    }
    
    //VERTICAL MOVEMENT -- DOWN
    for (let i = row + 1; i < 8; i++)
    {
        if (board.boardState[i][col] == "") //If empty  
        {
            validMoves.push([i, col]);
        } 
        else if (String(board.boardState[i][col])[0] != String(piece)[0]) //If piece is of opposite color
        {
            validMoves.push([i, col]);
            break;
        }
        else
        {
            break;
        }
    }
}

function validKnightMove(piece, row, col)
{
    //MOVEMENT UP -- LEFT
    if (row - 2 >= 0 && col - 1 >= 0 && (board.boardState[row - 2][col - 1] == "" || String(board.boardState[row - 2][col - 1])[0] != String(piece)[0]))
    {
        validMoves.push([row - 2, col - 1]);
    }

    //MOVEMENT UP -- RIGHT\
    if (row - 2 >= 0 && col + 1 < 8 && (board.boardState[row - 2][col + 1] == "" || String(board.boardState[row - 2][col + 1])[0] != String(piece)[0]))
    {
        validMoves.push([row - 2, col + 1]);
    }

    //MOVEMENT DOWN -- LEFT
    if (row + 2 < 8 && col - 1 >= 0 && (board.boardState[row + 2][col - 1] == "" || String(board.boardState[row + 2][col - 1])[0] != String(piece)[0]))
    {
        validMoves.push([row + 2, col - 1]);
    }

    //MOVEMENT DOWN -- RIGHT
    if (row + 2 < 8 && col + 1 < 8 && (board.boardState[row + 2][col + 1] == "" || String(board.boardState[row + 2][col + 1])[0] != String(piece)[0]))
    {
        validMoves.push([row + 2, col + 1]);
    }

    //MOVEMENT LEFT -- UP
    if (row - 1 >= 0 && col - 2 >= 0 && (board.boardState[row - 1][col - 2] == "" || String(board.boardState[row - 1][col - 2])[0] != String(piece)[0]))
    {
        validMoves.push([row - 1, col - 2]);
    }

    //MOVEMENT LEFT -- DOWN
    if (row + 1 < 8 && col - 2 >= 0 && (board.boardState[row + 1][col - 2] == "" || String(board.boardState[row + 1][col - 2])[0] != String(piece)[0]))
    {
        validMoves.push([row + 1, col - 2]);
    }

    //MOVEMENT RIGHT -- UP
    if (row - 1 >= 0 && col + 2 < 8 && (board.boardState[row - 1][col + 2] == "" || String(board.boardState[row - 1][col + 2])[0] != String(piece)[0]))
    {
        validMoves.push([row - 1, col + 2]);
    }

    //MOVEMENT RIGHT -- DOWN
    if (row + 1 < 8 && col + 2 < 8 && (board.boardState[row + 1][col + 2] == "" || String(board.boardState[row + 1][col + 2])[0] != String(piece)[0]))
    {
        validMoves.push([row + 1, col + 2]);
    }
}

function validBishopMove(piece, row, col)
{
    //DIAGONAL MOVEMENT -- UP LEFT
    for (let i = 1; row - i >= 0 && col - i >= 0; i++)
    {
        if (board.boardState[row - i][col - i] == "") //If empty
        {
            validMoves.push([row - i, col - i]);
        } 
        else if (String(board.boardState[row - i][col - i])[0] != String(piece)[0]) //If piece is of opposite color
        {
            validMoves.push([row - i, col - i]);
            break;
        }
        else if (String(board.boardState[row - i][col - i])[0] == String(piece)[0]) //If piece is of same color
        {
            break;
        }
    }

    //DIAGONAL MOVEMENT -- UP RIGHT
    for (let i = 1; row - i >= 0 && col + i <= 7; i++)
    {
        if (board.boardState[row - i][col + i] == "") //If empty
        {
            validMoves.push([row - i, col + i]);
        } 
        else if (String(board.boardState[row - i][col + i])[0] != String(piece)[0]) //If piece is of opposite color
        {
            validMoves.push([row - i, col + i]);
            break;
        }
        else if (String(board.boardState[row - i][col + i])[0] == String(piece)[0]) //If piece is of same color
        {
            break;
        }
    }

    //DIAGONAL MOVEMENT -- DOWN LEFT
    for (let i = 1; row + i <= 7 && col - i >= 0; i++)
    {
        if (board.boardState[row + i][col - i] == "") //If empty
        {
            validMoves.push([row + i, col - i]);
        } 
        else if (String(board.boardState[row + i][col - i])[0] != String(piece)[0]) //If piece is of opposite color
        {
            validMoves.push([row + i, col - i]);
            break;
        }
        else if (String(board.boardState[row + i][col - i])[0] == String(piece)[0]) //If piece is of same color
        {
            break;
        }
    }

    //DIAGONAL MOVEMENT -- DOWN RIGHT
    for (let i = 1; row + i <= 7 && col + i <= 7; i++)
    {
        if (board.boardState[row + i][col + i] == "") //If empty
        {
            validMoves.push([row + i, col + i]);
        } 
        else if (String(board.boardState[row + i][col + i])[0] != String(piece)[0]) //If piece is of opposite color
        {
            validMoves.push([row + i, col + i]);
            break;
        }
        else if (String(board.boardState[row + i][col + i])[0] == String(piece)[0]) //If piece is of same color
        {
            break;
        }
    }
}

function validQueenMove(piece, row, col)
{
    validRookMove(piece, row, col);
    validBishopMove(piece, row, col);
}