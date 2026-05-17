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
    console.log(`Clicked on square: ${square}, Current turn: ${turn}`);
    
    const clickedPiece = board.boardState[square[0]][square[1]];
    const clickedPieceColor = clickedPiece ? String(clickedPiece)[0] : null;
    
    // If clicking on your own piece, select it (or reselect if already have something selected)
    if (clickedPieceColor === String(turn))
    {
        selectedSquare = square;
        selectedPiece = clickedPiece;

        //valid moves
        validMoves = moves.calcValidMoves(selectedPiece, selectedSquare[0], selectedSquare[1]);
        board.drawValidMoves(validMoves);
        board.updateBoard();
    } 
    else if (selectedSquare != null && validMoves.length > 0)
    {
        let moveFound = false;
        for (let move of validMoves)
        {
            if (move[0] == square[0] && move[1] == square[1])
            {
                console.log("Move is valid");
                
                // Check if this is an en passant capture
                const isEnPassant = selectedPiece.includes('p') && 
                                   Math.abs(selectedSquare[1] - square[1]) === 1 && 
                                   board.boardState[square[0]][square[1]] === "";
                
                // Check if this is a double pawn move (2 squares forward)
                const isDoublePawnMove = selectedPiece.includes('p') && 
                                        Math.abs(selectedSquare[0] - square[0]) === 2;
                
                // If en passant, also remove the pawn next to the en passant square
                if (isEnPassant)
                {
                    board.boardState[selectedSquare[0]][square[1]] = ""; // Remove captured pawn
                }
                
                // Move the piece
                board.boardState[square[0]][square[1]] = selectedPiece;
                board.boardState[selectedSquare[0]][selectedSquare[1]] = "";
                
                // Check for pawn promotion
                const isPawnPromotion = selectedPiece.includes('p') && 
                                       ((String(selectedPiece)[0] == "1" && square[0] == 0) || 
                                        (String(selectedPiece)[0] == "0" && square[0] == 7));
                
                // Update en passant target
                if (isDoublePawnMove)
                {
                    moves.setEnPassantTarget([square[0], square[1]]); // Target square of the moved pawn
                }
                else
                {
                    moves.setEnPassantTarget(null); // Reset if not a double pawn move
                }
                
                if (isPawnPromotion)
                {
                    promotePawn(square[0], square[1], String(selectedPiece)[0]);
                }
                else
                {
                    // Only switch turn if not promotion (promotion will handle turn switching)
                    completeTurn();
                }
                moveFound = true;
                break;
            }
        }
        
        // Reset selection after move attempt
        selectedSquare = null;
        selectedPiece = null;
        validMoves = [];
        board.drawValidMoves(validMoves);
        
        if (!moveFound)
        {
            console.log("Move is invalid");
        }
    }
}

function completeTurn()
{
    // Switch turn
    turn = rules.switchTurn(turn);
    console.log(`Turn switched to: ${turn}`);
    
    // Update board display
    board.updateBoard();
    document.getElementById('turn').textContent = turn === 1 ? 'Wit' : 'Zwart';
    
    // Check for check AFTER the move and turn switch
    check = rules.checkForCheck(1 - turn);
    if (check)
    {
        console.log("King is in check!");
        board.highlightCheck(rules.findKing(1 - turn));
    }
}

function promotePawn(row, col, color)
{
    // Create a modal dialog for promotion choice
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 3px solid black;
        border-radius: 8px;
        padding: 20px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    `;
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = color === "1" ? 'Kies promotie (Wit)' : 'Kies promotie (Zwart)';
    title.style.marginTop = '0';
    modal.appendChild(title);
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';
    
    const options = [
        { piece: 'q', label: '♕ Koningin', labelBlack: '♛ Koningin' },
        { piece: 'r', label: '♖ Toren', labelBlack: '♜ Toren' },
        { piece: 'b', label: '♗ Loper', labelBlack: '♝ Loper' },
        { piece: 'n', label: '♘ Paard', labelBlack: '♞ Paard' }
    ];
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = color === "1" ? option.label : option.labelBlack;
        button.style.cssText = `
            padding: 10px 15px;
            font-size: 16px;
            cursor: pointer;
            border: 2px solid #333;
            border-radius: 4px;
            background: #f0f0f0;
            transition: background 0.2s;
        `;
        
        button.onmouseover = () => button.style.background = '#e0e0e0';
        button.onmouseout = () => button.style.background = '#f0f0f0';
        
        button.onclick = () => {
            // Replace pawn with chosen piece
            board.boardState[row][col] = color + option.piece;
            
            // Update the board display immediately
            board.updateBoard();
            board.drawValidMoves([]);
            
            // Remove modal
            document.body.removeChild(modal);
            
            // Complete the turn (switch to other player, check for check, etc)
            completeTurn();
        };
        
        buttonContainer.appendChild(button);
    });
    
    modal.appendChild(buttonContainer);
    document.body.appendChild(modal);
}

board.createBoard();









