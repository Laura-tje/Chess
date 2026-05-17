/**Game Rules */

import * as board from "./board.js";
import * as moves from "./moves.js";

export function checkForCheck(turn)
{
    // Find the king of the current player (whose turn it is)
    let kingPos = findKingByColor(turn);
    
    if (!kingPos) return false;

    // Check if opponent's pieces can attack the king
    for (let row = 0; row < 8; row++)
    {
        for (let col = 0; col < 8; col++)
        {
            // Find all opponent pieces
            if (board.boardState[row][col] && board.boardState[row][col][0] != String(turn))
            {
                let validMoves = moves.calcValidMoves(board.boardState[row][col], row, col);
                for (let move of validMoves)
                {
                    // If opponent can move to king position, king is in check
                    if (move[0] == kingPos[0] && move[1] == kingPos[1])
                    {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

export function findKingByColor(color)
{
    const kingPiece = color + "k";
    
    for (let row = 0; row < 8; row++)
    {
        for (let col = 0; col < 8; col++)
        {
            if (board.boardState[row][col] == kingPiece)
            {
                return [row, col];
            }
        }
    }
    return null;
}

export function checkForMate(turn)
{
    // First check if king is in check
    if (!checkForCheck(turn))
    {
        return false; // Not in check, so not checkmate
    }

    // King is in check, now check if there are any legal moves
    for (let row = 0; row < 8; row++)
    {
        for (let col = 0; col < 8; col++)
        {
            // Find all pieces of current player
            if (board.boardState[row][col] && board.boardState[row][col][0] == String(turn))
            {
                let validMoves = moves.calcValidMoves(board.boardState[row][col], row, col);
                
                // Try each valid move and see if it gets out of check
                for (let move of validMoves)
                {
                    // Skip the current position (first element in validMoves)
                    if (move[0] === row && move[1] === col) continue;
                    
                    // Simulate the move
                    let capturedPiece = board.boardState[move[0]][move[1]];
                    board.boardState[move[0]][move[1]] = board.boardState[row][col];
                    board.boardState[row][col] = "";
                    
                    // Check if still in check after this move
                    let stillInCheck = checkForCheck(turn);
                    
                    // Undo the move
                    board.boardState[row][col] = board.boardState[move[0]][move[1]];
                    board.boardState[move[0]][move[1]] = capturedPiece;
                    
                    // If there's a move that gets out of check, it's not mate
                    if (!stillInCheck)
                    {
                        return false;
                    }
                }
            }
        }
    }

    // No legal moves found that get out of check = checkmate
    return true;
}

export function checkForStalemate(turn) // 50move rule and 3fold repetition not implemented yet, only stalemate by no legal moves
{
    // First check if king is NOT in check (stalemate must have no check)
    if (checkForCheck(turn))
    {
        return false; // In check, so not stalemate
    }

    // Not in check, now check if there are any legal moves
    for (let row = 0; row < 8; row++)
    {
        for (let col = 0; col < 8; col++)
        {
            // Find all pieces of current player
            if (board.boardState[row][col] && board.boardState[row][col][0] == String(turn))
            {
                let validMoves = moves.calcValidMoves(board.boardState[row][col], row, col);
                
                // Try each valid move and see if it's legal (doesn't leave king in check)
                for (let move of validMoves)
                {
                    // Skip the current position (for deselection)
                    if (move[0] === row && move[1] === col) continue;
                    
                    // Simulate the move
                    let capturedPiece = board.boardState[move[0]][move[1]];
                    board.boardState[move[0]][move[1]] = board.boardState[row][col];
                    board.boardState[row][col] = "";
                    
                    // Check if still in check after this move
                    let stillInCheck = checkForCheck(turn);
                    
                    // Undo the move
                    board.boardState[row][col] = board.boardState[move[0]][move[1]];
                    board.boardState[move[0]][move[1]] = capturedPiece;
                    
                    // If there's a legal move available, it's not stalemate
                    if (!stillInCheck)
                    {
                        return false;
                    }
                }
            }
        }
    }

    // No legal moves found and not in check = stalemate
    return true;
}

export function findKing(turn)
{
    // Find opponent's king (for highlighting check)
    const opponentColor = 1 - turn;
    return findKingByColor(opponentColor);
}

export function switchTurn(turn)
{
    let newturn = 1 - turn;
    return newturn;
}