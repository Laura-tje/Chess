/**Valid Moves*/
import * as board from "./board.js";

let validMoves = [];
let enPassantTarget = null; // Track the pawn that just moved 2 squares forward

// Track which pieces have moved (for castling rules)
let pieceMoved = {
    "1k": false, // White king
    "1rH": false, // White rook kingside
    "1rA": false, // White rook queenside
    "0k": false, // Black king
    "0rH": false, // Black rook kingside
    "0rA": false  // Black rook queenside
};

export function setEnPassantTarget(target) {
    enPassantTarget = target;
}

export function getEnPassantTarget() {
    return enPassantTarget;
}

export function recordPieceMoved(piece, row, col) {
    // Record if king moved
    if (piece === "1k") pieceMoved["1k"] = true;
    if (piece === "0k") pieceMoved["0k"] = true;
    
    // Record if rook moved (kingside or queenside)
    if (piece === "1r" && col === 7) pieceMoved["1rH"] = true; // White kingside rook
    if (piece === "1r" && col === 0) pieceMoved["1rA"] = true; // White queenside rook
    if (piece === "0r" && col === 7) pieceMoved["0rH"] = true; // Black kingside rook
    if (piece === "0r" && col === 0) pieceMoved["0rA"] = true; // Black queenside rook
}

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

function validWhitePawnMove(piece, row, col) //Promotion is handled in main.js after move
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

    //en passant - white pawn can capture black pawn on its sides if the black pawn just moved 2 squares
    if (row == 3) //white can en passant on 5th rank (row index 3)
    {
        //en passant left
        if (col - 1 >= 0 && board.boardState[row][col - 1] == "0p" && getEnPassantTarget() && getEnPassantTarget()[0] == row && getEnPassantTarget()[1] == col - 1)
        {
            validMoves.push([row - 1, col - 1]);
        }
        //en passant right
        if (col + 1 < 8 && board.boardState[row][col + 1] == "0p" && getEnPassantTarget() && getEnPassantTarget()[0] == row && getEnPassantTarget()[1] == col + 1)
        {
            validMoves.push([row - 1, col + 1]);
        }
    }
}

function validBlackPawnMove(piece, row, col) //Promotion is handled in main.js after move
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

    //en passant - black pawn can capture white pawn on its sides if the white pawn just moved 2 squares
    if (row == 4) //black can en passant on 4th rank (row index 4)
    {
        //en passant left
        if (col - 1 >= 0 && board.boardState[row][col - 1] == "1p" && getEnPassantTarget() && getEnPassantTarget()[0] == row && getEnPassantTarget()[1] == col - 1)
        {
            validMoves.push([row + 1, col - 1]);
        }
        //en passant right
        if (col + 1 < 8 && board.boardState[row][col + 1] == "1p" && getEnPassantTarget() && getEnPassantTarget()[0] == row && getEnPassantTarget()[1] == col + 1)
        {
            validMoves.push([row + 1, col + 1]);
        }
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

function validKingMove(piece, row, col) //Castling is handled in main.js after move
{
    //CHECK ALL 8 SURROUNDING SQUARES
    
    //UP
    if (row - 1 >= 0 && (board.boardState[row - 1][col] == "" || String(board.boardState[row - 1][col])[0] != String(piece)[0]))
    {
        validMoves.push([row - 1, col]);
    }

    //DOWN
    if (row + 1 < 8 && (board.boardState[row + 1][col] == "" || String(board.boardState[row + 1][col])[0] != String(piece)[0]))
    {
        validMoves.push([row + 1, col]);
    }

    //LEFT
    if (col - 1 >= 0 && (board.boardState[row][col - 1] == "" || String(board.boardState[row][col - 1])[0] != String(piece)[0]))
    {
        validMoves.push([row, col - 1]);
    }

    //RIGHT
    if (col + 1 < 8 && (board.boardState[row][col + 1] == "" || String(board.boardState[row][col + 1])[0] != String(piece)[0]))
    {
        validMoves.push([row, col + 1]);
    }

    //UP LEFT
    if (row - 1 >= 0 && col - 1 >= 0 && (board.boardState[row - 1][col - 1] == "" || String(board.boardState[row - 1][col - 1])[0] != String(piece)[0]))
    {
        validMoves.push([row - 1, col - 1]);
    }

    //UP RIGHT
    if (row - 1 >= 0 && col + 1 < 8 && (board.boardState[row - 1][col + 1] == "" || String(board.boardState[row - 1][col + 1])[0] != String(piece)[0]))
    {
        validMoves.push([row - 1, col + 1]);
    }

    //DOWN LEFT
    if (row + 1 < 8 && col - 1 >= 0 && (board.boardState[row + 1][col - 1] == "" || String(board.boardState[row + 1][col - 1])[0] != String(piece)[0]))
    {
        validMoves.push([row + 1, col - 1]);
    }

    //DOWN RIGHT
    if (row + 1 < 8 && col + 1 < 8 && (board.boardState[row + 1][col + 1] == "" || String(board.boardState[row + 1][col + 1])[0] != String(piece)[0]))
    {
        validMoves.push([row + 1, col + 1]);
    }

    //CASTLING
    //White kingside castling (0-0): King from e1(7,4) to g1(7,6)
    if (piece === "1k" && row === 7 && col === 4 && !pieceMoved["1k"] && !pieceMoved["1rH"])
    {
        if (board.boardState[7][5] === "" && board.boardState[7][6] === "" && board.boardState[7][7] === "1r")
        {
            validMoves.push([7, 6]); // Castling kingside
        }
    }
    
    //White queenside castling (0-0-0): King from e1(7,4) to c1(7,2)
    if (piece === "1k" && row === 7 && col === 4 && !pieceMoved["1k"] && !pieceMoved["1rA"])
    {
        if (board.boardState[7][3] === "" && board.boardState[7][2] === "" && board.boardState[7][1] === "" && board.boardState[7][0] === "1r")
        {
            validMoves.push([7, 2]); // Castling queenside
        }
    }
    
    //Black kingside castling: King from e8(0,4) to g8(0,6)
    if (piece === "0k" && row === 0 && col === 4 && !pieceMoved["0k"] && !pieceMoved["0rH"])
    {
        if (board.boardState[0][5] === "" && board.boardState[0][6] === "" && board.boardState[0][7] === "0r")
        {
            validMoves.push([0, 6]); // Castling kingside
        }
    }
    
    //Black queenside castling: King from e8(0,4) to c8(0,2)
    if (piece === "0k" && row === 0 && col === 4 && !pieceMoved["0k"] && !pieceMoved["0rA"])
    {
        if (board.boardState[0][3] === "" && board.boardState[0][2] === "" && board.boardState[0][1] === "" && board.boardState[0][0] === "0r")
        {
            validMoves.push([0, 2]); // Castling queenside
        }
    }
}