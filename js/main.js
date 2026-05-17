/**Main Game Logic */

import * as board from "./board.js";
import * as moves from "./moves.js";
import * as rules from "./rules.js";


let selectedSquare = null;
let selectedPiece = null;
let validMoves = [];
let turn = 1; //white starts
let check = false;

// Reset the game to initial state
function resetGame()
{
    // Reset board state
    board.resetBoard();
    
    // Reset game variables
    selectedSquare = null;
    selectedPiece = null;
    validMoves = [];
    turn = 1;
    check = false;
    
    // Reset moves tracking (for castling and en passant)
    moves.resetMoveTracking();
    moves.setEnPassantTarget(null);
    
    // Update UI
    board.updateBoard();
    board.drawValidMoves([]);
    board.highlightCheck(null);
    document.getElementById('turn').textContent = 'Wit';
    const statusDiv = document.getElementById('game-status');
    statusDiv.textContent = 'Wit aan zet';
    statusDiv.style.background = '#E8E8E8';
    
    console.log("Game reset!");
}

// Helper function: checks if a move is legal (doesn't leave king in check)
function isLegalMove(piece, fromRow, fromCol, toRow, toCol)
{
    // Simulate the move
    const originalPiece = board.boardState[toRow][toCol];
    const isEnPassant = piece.includes('p') && 
                       Math.abs(fromCol - toCol) === 1 && 
                       originalPiece === "";
    
    // Make the move
    board.boardState[toRow][toCol] = piece;
    board.boardState[fromRow][fromCol] = "";
    
    // If en passant, also remove the captured pawn
    let enPassantPiece = null;
    if (isEnPassant)
    {
        enPassantPiece = board.boardState[fromRow][toCol];
        board.boardState[fromRow][toCol] = "";
    }
    
    // Check if our own king is in check after this move
    const kingInCheck = rules.checkForCheck(turn);
    
    // Undo the move
    board.boardState[fromRow][fromCol] = piece;
    board.boardState[toRow][toCol] = originalPiece;
    if (isEnPassant && enPassantPiece)
    {
        board.boardState[fromRow][toCol] = enPassantPiece;
    }
    
    // Move is legal if king is NOT in check
    return !kingInCheck;
}

export function onClick(square)
{   
    console.log(`Clicked on square: ${square}, Current turn: ${turn}`);
    
    const clickedPiece = board.boardState[square[0]][square[1]];
    const clickedPieceColor = clickedPiece ? String(clickedPiece)[0] : null;
    
    // If clicking on your own piece, select it (or reselect if already have something selected)
    if (clickedPieceColor === String(turn))
    {
        // If clicking on the same piece again, deselect it
        if (selectedSquare && selectedSquare[0] === square[0] && selectedSquare[1] === square[1])
        {
            selectedSquare = null;
            selectedPiece = null;
            validMoves = [];
            board.drawValidMoves(validMoves);
            board.updateBoard();
        }
        else
        {
            selectedSquare = square;
            selectedPiece = clickedPiece;

            //valid moves
            let calculatedMoves = moves.calcValidMoves(selectedPiece, selectedSquare[0], selectedSquare[1]);
            
            // Filter moves: only show moves that don't leave king in check
            validMoves = calculatedMoves.filter(move => 
                isLegalMove(selectedPiece, selectedSquare[0], selectedSquare[1], move[0], move[1])
            ).map(move => [
                selectedSquare[0], selectedSquare[1],  // from position
                move[0], move[1]                        // to position
            ]);
            
            // Always add the selected piece's own position to allow deselection
            validMoves.push([
                selectedSquare[0], selectedSquare[1],  // from position
                selectedSquare[0], selectedSquare[1]   // to position (same = deselection)
            ]);
            
            board.drawValidMoves(validMoves);
            board.updateBoard();
        }
    } 
    else if (selectedSquare != null)
    {
        let moveFound = false;
        for (let move of validMoves)
        {
            if (move[2] == square[0] && move[3] == square[1])
            {
                // Check if this is a deselection (clicking on the same square)
                if (move[0] == square[0] && move[1] == square[1])
                {
                    // Deselect the piece
                    selectedSquare = null;
                    selectedPiece = null;
                    validMoves = [];
                    board.drawValidMoves(validMoves);
                    board.updateBoard();
                    moveFound = true;
                    break;
                }
                
                console.log("Move is valid");
                
                // Check if this is an en passant capture
                const isEnPassant = selectedPiece.includes('p') && 
                                   Math.abs(selectedSquare[1] - square[1]) === 1 && 
                                   board.boardState[square[0]][square[1]] === "";
                
                // Check if this is a double pawn move (2 squares forward)
                const isDoublePawnMove = selectedPiece.includes('p') && 
                                        Math.abs(selectedSquare[0] - square[0]) === 2;
                
                // Check if this is castling (king moves 2 squares)
                const isCastling = selectedPiece.includes('k') && Math.abs(selectedSquare[1] - square[1]) === 2;
                
                // If en passant, also remove the pawn next to the en passant square
                if (isEnPassant)
                {
                    board.boardState[selectedSquare[0]][square[1]] = ""; // Remove captured pawn
                }
                
                // Move the piece
                board.boardState[square[0]][square[1]] = selectedPiece;
                board.boardState[selectedSquare[0]][selectedSquare[1]] = "";
                
                // Handle castling: move the rook
                if (isCastling)
                {
                    if (square[1] === 6) // Kingside castling
                    {
                        board.boardState[square[0]][5] = board.boardState[square[0]][7];
                        board.boardState[square[0]][7] = "";
                    }
                    else if (square[1] === 2) // Queenside castling
                    {
                        board.boardState[square[0]][3] = board.boardState[square[0]][0];
                        board.boardState[square[0]][0] = "";
                    }
                }
                
                // Record that this piece has moved (for castling rules)
                moves.recordPieceMoved(selectedPiece, selectedSquare[0], selectedSquare[1]);
                
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
    
    // Clear any previous status message
    const statusDiv = document.getElementById('game-status');
    statusDiv.textContent = '';
    statusDiv.style.background = '';
    
    // Check for checkmate FIRST (since it includes check)
    if (rules.checkForMate(turn))
    {
        const winner = turn === 1 ? 'Zwart' : 'Wit';
        statusDiv.innerHTML = `🎉 SCHAAKMAT! ${winner} wint! <button id="replay-btn" style="margin-left: 10px; padding: 5px 10px; cursor: pointer;">Opnieuw spelen</button>`;
        statusDiv.style.background = '#90EE90';
        console.log(`Checkmate! ${winner} wins!`);
        
        // Add event listener to the replay button
        document.getElementById('replay-btn').addEventListener('click', resetGame);
        return;
    }
    
    // Check for stalemate (no legal moves but not in check)
    if (rules.checkForStalemate(turn))
    {
        statusDiv.innerHTML = `🤝 STALEMATE! Gelijkspel! <button id="replay-btn" style="margin-left: 10px; padding: 5px 10px; cursor: pointer;">Opnieuw spelen</button>`;
        statusDiv.style.background = '#FFC107';
        console.log("Stalemate! Draw!");
        
        // Add event listener to the replay button
        document.getElementById('replay-btn').addEventListener('click', resetGame);
        return;
    }
    
    // Check for check (only if not checkmate or stalemate)
    check = rules.checkForCheck(turn);
    
    // Always clear previous check highlighting first
    board.highlightCheck(null);
    
    if (check)
    {
        statusDiv.textContent = `⚠️ ${turn === 1 ? 'Wit' : 'Zwart'} staat in schaak!`;
        statusDiv.style.background = '#FFB6C6';
        console.log("King is in check!");
        board.highlightCheck(rules.findKingByColor(turn));
    }
    else
    {
        statusDiv.textContent = `${turn === 1 ? 'Wit' : 'Zwart'} aan zet`;
        statusDiv.style.background = '#E8E8E8';
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

// Initialize game status display
const statusDiv = document.getElementById('game-status');
statusDiv.textContent = `Wit aan zet`;
statusDiv.style.background = '#E8E8E8';









