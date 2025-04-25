'use client';

import { useState } from 'react';
import { Piece } from './models/piece';
import Checkerboard from './checkboard';

// Types
type Position = {
  row: number;
  col: number;
};

type SelectedPiece = {
  piece: Piece;
  position: Position;
};

type Direction = {
  row: number;
  col: number;
};

type Board = Piece[][];

// Constants
const BOARD_SIZE = 8;
const INITIAL_PIECES_ROWS = 3;

const PIECE_DIRECTIONS: Record<Piece, Direction[]> = {
  [Piece.Noir]: [
    { row: 1, col: -1 },
    { row: 1, col: 1 },
    { row: 2, col: -2 },
    { row: 2, col: 2 },
  ],
  [Piece.Blanc]: [
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: -2, col: -2 },
    { row: -2, col: 2 },
  ],
  [Piece.RoiNoir]: [
    { row: 1, col: -1 },
    { row: 1, col: 1 },
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 2, col: -2 },
    { row: 2, col: 2 },
    { row: -2, col: -2 },
    { row: -2, col: 2 },
  ],
  [Piece.RoiBlanc]: [
    { row: 1, col: -1 },
    { row: 1, col: 1 },
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 2, col: -2 },
    { row: 2, col: 2 },
    { row: -2, col: -2 },
    { row: -2, col: 2 },
  ],
  [Piece.Null]: [],
};

export default function Home() {
  const [selected, setSelected] = useState<SelectedPiece | null>(null);
  const [activePlayer, setActivePlayer] = useState<Piece.Noir | Piece.Blanc>(Piece.Noir);
  const [board, setBoard] = useState<Board>(initializeBoard());

  function initializeBoard(): Board {
    const newBoard = Array(BOARD_SIZE)
      .fill(Piece.Null)
      .map(() => Array(BOARD_SIZE).fill(Piece.Null));

    // Place black pieces
    for (let row = 0; row < INITIAL_PIECES_ROWS; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = Piece.Noir;
        }
      }
    }

    // Place white pieces
    for (let row = BOARD_SIZE - INITIAL_PIECES_ROWS; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = Piece.Blanc;
        }
      }
    }

    return newBoard;
  }

  function handleClick(row: number, col: number) {
    const clickedPiece = board[row][col];

    if (!selected) {
      if (clickedPiece === activePlayer || 
          (activePlayer === Piece.Noir && clickedPiece === Piece.RoiNoir) ||
          (activePlayer === Piece.Blanc && clickedPiece === Piece.RoiBlanc)) {
        setSelected({ piece: clickedPiece, position: { row, col } });
      }
      return;
    }

    const { position: from, piece } = selected;
    const fromRow = from.row;
    const fromCol = from.col;

    // Try to make the move
    const newBoard = movePiece(board, fromRow, fromCol, row, col, piece);
    
    if (newBoard) {
      // Update game state
      setBoard(newBoard);
      setSelected(null);
      setActivePlayer(activePlayer === Piece.Noir ? Piece.Blanc : Piece.Noir);
      
      // Check for game over
      checkGameOver(newBoard);
    } else {
      // Invalid move
      setSelected(null);
    }
  }

  function movePiece(
    currentBoard: Board,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    piece: Piece
  ): Board | null {
    // Validate move
    if (!isValidMove(fromRow, fromCol, toRow, toCol)) {
      return null;
    }

    const newBoard = currentBoard.map(row => [...row]);
    
    // Handle capture
    if (Math.abs(toRow - fromRow) === 2) {
      const capturedRow = (fromRow + toRow) / 2;
      const capturedCol = (fromCol + toCol) / 2;
      newBoard[capturedRow][capturedCol] = Piece.Null;
    }

    // Move piece
    newBoard[toRow][toCol] = promoteToKing(toRow, piece);
    newBoard[fromRow][fromCol] = Piece.Null;

    return newBoard;
  }

  function isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    // Check if destination is empty
    if (board[toRow][toCol] !== Piece.Null) return false;

    const piece = board[fromRow][fromCol];
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // Validate move direction based on piece type
    if (piece === Piece.Noir && rowDiff <= 0) return false;
    if (piece === Piece.Blanc && rowDiff >= 0) return false;

    // Check if move is within bounds
    if (Math.abs(rowDiff) > 2 || Math.abs(colDiff) > 2) return false;
    if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;

    // Handle capture
    if (Math.abs(rowDiff) === 2) {
      const capturedRow = (fromRow + toRow) / 2;
      const capturedCol = (fromCol + toCol) / 2;
      const capturedPiece = board[capturedRow][capturedCol];
      
      if (capturedPiece === Piece.Null) return false;
      if (getPieceColor(capturedPiece) === getPieceColor(piece)) return false;
    }

    return true;
  }

  function getPieceColor(piece: Piece): Piece.Noir | Piece.Blanc {
    return piece.includes(Piece.Noir) ? Piece.Noir : Piece.Blanc;
  }

  function promoteToKing(row: number, piece: Piece): Piece {
    if (piece === Piece.Noir && row === BOARD_SIZE - 1) return Piece.RoiNoir;
    if (piece === Piece.Blanc && row === 0) return Piece.RoiBlanc;
    return piece;
  }

  function checkGameOver(board: Board) {
    let canBlackMove = false;
    let canWhiteMove = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece === Piece.Null) continue;

        const directions = PIECE_DIRECTIONS[piece];
        for (const dir of directions) {
          const newRow = row + dir.row;
          const newCol = col + dir.col;
          
          if (newRow >= 0 && newRow < BOARD_SIZE && 
              newCol >= 0 && newCol < BOARD_SIZE &&
              isValidMove(row, col, newRow, newCol)) {
            if (getPieceColor(piece) === Piece.Noir) canBlackMove = true;
            if (getPieceColor(piece) === Piece.Blanc) canWhiteMove = true;
          }
        }
      }
    }

    if (!canBlackMove || !canWhiteMove) {
      console.log('Game over!');
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h1>Checkers Game</h1>
      <div style={{ border: '2px solid black', width: 'fit-content' }}>
        {Checkerboard(handleClick, board)}
      </div>
    </div>
  );
}
