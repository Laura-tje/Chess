/**Game Rules */

import * as board from "./board.js";
import * as moves from "./moves.js";

export function checkForCheck(turn)
{
    let kingPos = findKing(turn);

    for (let row = 0; row < 8; row++)
    {
        for (let col = 0; col < 8; col++)
        {
            //calculate all valid moves for CURRENT player's pieces
            if (board.boardState[row][col][0] == String(turn))
            {
                let validMoves = moves.calcValidMoves(board.boardState[row][col], row, col);
                for (let move of validMoves)
                {
                    if (move[0] == kingPos[0] && move[1] == kingPos[1])
                    {
                        return true; //king is in check
                    }
                }
            }
        }
    }
    return false; //king is not in check
}

export function findKing(turn)
{
    turn = 1 - turn; //find opponent's king
    
    for (let row = 0; row < 8; row++)
    {
        for (let col = 0; col < 8; col++)
        {
            if (board.boardState[row][col] == turn + "k")
            {
                return [row, col];
            }
        }
    }
    return null;
}

export function switchTurn(turn)
{
    let newturn = 1 - turn;
    return newturn;
}