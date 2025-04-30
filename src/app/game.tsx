'use client';

import { useEffect, useState } from 'react';
import { Piece } from './models/piece';
import Checkerboard from './checkboard';
import { isValidMove, PIECE_DIRECTIONS, applyMove, movePiece} from './models/moveHistory';
import { minimax } from './models/ai';
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



export default function Home({ depth, playerColor }: Readonly<{ depth: number; playerColor: 'noir' | 'blanc' }>) {
  const [selected, setSelected] = useState<SelectedPiece | null>(null);
  const [activePlayer, setActivePlayer] = useState<Piece.Noir | Piece.Blanc>(
    playerColor === 'noir' ? Piece.Noir : Piece.Blanc
  );
  const iaColor = playerColor === 'noir' ? 'blanc' : 'noir';
  const [board, setBoard] = useState<Board>(initializeBoard());
  const [gameOver, setGameOver] = useState(false);

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


  useEffect(()=> {
    if (iaColor === 'noir') {
        iaMove(board);
      }
  }, [])
 
  function iaMove(board: Board) {
    const move = minimax(board, depth, iaColor === 'noir');
    setTimeout(() => {
        if (move.move) {
        const newBoard = applyMove(board, move.move);
        setBoard(newBoard);
        setActivePlayer(iaColor === 'noir' ? Piece.Blanc : Piece.Noir);
    }
    }, 1000);
  }

   function handleClick(row: number, col: number) {
     const clickedPiece = board[row][col];
 
     if (!selected) {
        const pieceColor = getPieceColor(clickedPiece);
        if (
          (pieceColor === activePlayer)
        ) {
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
       setTimeout(()=> {
         iaMove(newBoard);
       },1000)
       // Check for game over
       checkGameOver(newBoard);
     } else {
       // Invalid move
       setSelected(null);
     }
   }
 
 
 
   function getPieceColor(piece: Piece): Piece.Noir | Piece.Blanc {
     return piece.includes(Piece.Noir) ? Piece.Noir : Piece.Blanc;
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
               isValidMove(row, col, newRow, newCol, board)) {
             if (getPieceColor(piece) === Piece.Noir) canBlackMove = true;
             if (getPieceColor(piece) === Piece.Blanc) canWhiteMove = true;
           }
         }
       }
     }
 
     if (!canBlackMove || !canWhiteMove) {
        console.log('Game over!');
        setGameOver(true); 
     }
   }

   function restartGame() {
    const initialBoard = initializeBoard(); 
    setBoard(initialBoard);
    setGameOver(false);
    setSelected(null);
    setActivePlayer(playerColor === 'noir' ? Piece.Noir : Piece.Blanc);
  
    if (iaColor === 'noir') {
      setTimeout(() => {
        iaMove(initialBoard);
      }, 1000);
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
  
      <div style={{ marginTop: '20px' }}>
        <button onClick={restartGame} style={{ padding: '10px 20px' }}>
         Recommencer
        </button>
      </div>
  
      {gameOver && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          fontSize: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          flexDirection: 'column'
        }}>
          <div> Game Over !</div>
          <button
            onClick={restartGame}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
             Rejouer
          </button>
        </div>
      )}
  
    </div>
  );
  
 }
 