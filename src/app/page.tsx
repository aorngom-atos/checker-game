'use client';

import { useState } from 'react';
import { Piece } from './models/piece';
import Checkerboard from './checkboard';
import {
  recordMove,
  hasPlayedFiveTurnsEach,
  analyzeMoveHistory,
  resetMoveHistory,
  getMoveHistory,
} from './models/moveHistory'; 


interface SelectedPiece {
  piece: Piece;
  i: number;
  j: number;
}

export default function Home() {
  const [selected, setSelected] = useState<SelectedPiece | null>(null);
  const [joueurActif, setJoueurActif] = useState<Piece.Noir | Piece.Blanc>(Piece.Noir);
  const [board, setBoard] = useState<Piece[][]>(() => {
    const damierboard = Array(8)
      .fill(Piece.Null)
      .map(() => Array(8).fill(Piece.Null));

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          damierboard[i][j] = Piece.Noir;
        }
      }
    }

    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          damierboard[i][j] = Piece.Blanc;
        }
      }
    }

    return damierboard;

    // return [
    //   [Piece.Null, Piece.Noir, Piece.Null, Piece.Noir, Piece.Null, Piece.Null, Piece.Null, Piece.Noir],
    //   [Piece.Null, Piece.Null, Piece.Blanc, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null],
    //   [Piece.Null, Piece.Null, Piece.Null, Piece.Noir, Piece.Null, Piece.Null, Piece.Null, Piece.Null],
    //   [Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Noir, Piece.Null, Piece.Null, Piece.Null],
    //   [Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null],
    //   [Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null],
    //   [Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null],
    //   [Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null, Piece.Null],
    // ];
  });

  //handleclick
  const handleClick = (i: number, j: number) => {
    const clickedPiece = board[i][j];

    if (selected === null) {
      if (clickedPiece.includes(joueurActif)) {
        setSelected({ piece: clickedPiece, i, j})
      } else {
        console.log('Ce n’est pas ton tour !');
      }
    } else {
      movePiece(i, j);
    }
  };

  //pièce bouge en fonction des différentes conditions
  const movePiece = (i: number, j: number) => {
    let newboard: Piece[][];

    if (!selected) return;

    const depuisI = selected.i;
    const depuisJ = selected.j;
    const pieceToMove = selected.piece;

    // Vérifie que la case d'arrivée est vide
    if (board[i][j] !== Piece.Null) {
      console.log('Déplacement interdit : case déjà occupée');
      setSelected(null);
      return;
    }

    const isCaptureMove = Math.abs(i - depuisI) === 2 && Math.abs(j - depuisJ) === 2;

    if (isCaptureMove) {
      newboard = capturePiece(i, j, depuisI, depuisJ, pieceToMove);
      setSelected(null);
    } else {
      // Sinon, c'est un déplacement normal
      const isValid = isValidMove(depuisI, depuisJ, i, j, board);
      if (!isValid) {
        setSelected(null);
        return;
      }
      newboard = normalMove(i, j, depuisI, depuisJ, pieceToMove);
    }
    setSelected(null);
    setJoueurActif(joueurActif === Piece.Noir ? Piece.Blanc : Piece.Noir);
    setBoard(newboard);
    recordMove(depuisI, depuisJ, i, j, joueurActif);
    if (hasPlayedFiveTurnsEach()) {
      const analyse = analyzeMoveHistory();
      console.log("Analyse IA après 5 coups chacun :", analyse);
    }
    
    isGameOver(newboard);
  };

  const normalMove = (
    i: number,
    j: number,
    depuisI: number,
    depuisJ: number,
    piece: Piece
  ) => {
    //fonction pour move normal
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[i][j] = becomeKing(i, j, piece);
    newBoard[depuisI][depuisJ] = Piece.Null;
    return newBoard;
  };

  const canMove = (i: number, j: number, depuisI: number, depuisJ: number, board: Piece[][]) => {
    if (board[i][j] === Piece.Noir) {
      return (
        canMoveDiagonaDownLeft(i, j, depuisI, depuisJ) ||
        canMoveDiagonalDownRight(i, j, depuisI, depuisJ) ||
        canCaptureDiagonalDownLeft(i, j, depuisI, depuisJ) ||
        canCaptureDiagonalDownRight(i, j, depuisI, depuisJ)
      );
    } else if (board[i][j] === Piece.Blanc) {
      return (
        canMoveDiagonalUpLeft(i, j, depuisI, depuisJ) ||
        canMoveDiagonalUpRight(i, j, depuisI, depuisJ) ||
        canCaptureDiagonalUpLeft(i, j, depuisI, depuisJ) ||
        canCaptureDiagonalUpRight(i, j, depuisI, depuisJ)
      );
    }

    return (
      canMoveDiagonalUpLeft(i, j, depuisI, depuisJ) ||
      canMoveDiagonalUpRight(i, j, depuisI, depuisJ) ||
      canMoveDiagonaDownLeft(i, j, depuisI, depuisJ) ||
      canMoveDiagonalDownRight(i, j, depuisI, depuisJ) ||
      canCaptureDiagonalDownLeft(i, j, depuisI, depuisJ) ||
      canCaptureDiagonalDownRight(i, j, depuisI, depuisJ) ||
      canCaptureDiagonalUpLeft(i, j, depuisI, depuisJ) ||
      canCaptureDiagonalUpRight(i, j, depuisI, depuisJ)
    );
  }

  const canMoveDiagonalUpLeft = (i: number, j: number, depuisI: number, depuisJ: number) => {
    return depuisI - 1 === i && depuisJ - 1 === j;
  }

  const canMoveDiagonalUpRight = (i: number, j: number, depuisI: number, depuisJ: number) => {
    return depuisI - 1 === i && depuisJ + 1 === j;
  }

  const canMoveDiagonaDownLeft = (i: number, j: number, depuisI: number, depuisJ: number) => {
    return depuisI + 1 === i && depuisJ - 1 === j;
  }

  const canMoveDiagonalDownRight = (i: number, j: number, depuisI: number, depuisJ: number) => {
    return depuisI + 1 === i && depuisJ + 1 === j;
  }

  const canCaptureDiagonalUpLeft = (i: number, j: number, depuisI: number, depuisJ: number) => {
    return depuisI - 2 === i && depuisJ - 2 === j;
  }

  const canCaptureDiagonalUpRight = (i: number, j: number, depuisI: number, depuisJ: number) => {
    return depuisI - 2 === i && depuisJ + 2 === j;
  }

  const canCaptureDiagonalDownLeft = (i: number, j: number, depuisI: number, depuisJ: number) => {
    return depuisI + 2 === i && depuisJ - 2 === j;
  }

  const canCaptureDiagonalDownRight = (i: number, j: number, depuisI: number, depuisJ: number) => {
    return depuisI + 2 === i && depuisJ + 2 === j;
  }

  const isValidMove = (
    depuisI: number,
    depuisJ: number,
    i: number,
    j: number,
    board: Piece[][]
  ): boolean => {
    const piece = board[depuisI][depuisJ];
    // Vérifie que la case d'arrivée est vide
    if (board[i][j] !== Piece.Null) {
      console.log('Déplacement interdit : case déjà occupée');
      setSelected(null);
      return false;
    }

    if (piece === Piece.Noir || piece === Piece.Blanc) {
      const validerMove =
        piece === Piece.Noir
          ? canMoveDiagonaDownLeft(i, j, depuisI, depuisJ) ||
            canMoveDiagonalDownRight(i, j, depuisI, depuisJ)
          : canMoveDiagonalUpLeft(i, j, depuisI, depuisJ) ||
            canMoveDiagonalUpRight(i, j, depuisI, depuisJ);

      if (!validerMove) {
        setSelected(null);
        return false;
      }

      return true;
    }

    if (piece === Piece.RoiNoir || piece === Piece.RoiBlanc) {
      return canMoveDiagonaDownLeft(i, j, depuisI, depuisJ) ||
        canMoveDiagonalDownRight(i, j, depuisI, depuisJ) ||
        canMoveDiagonalUpLeft(i, j, depuisI, depuisJ) ||
        canMoveDiagonalUpRight(i, j, depuisI, depuisJ);
    }

    return false;
  };

  const capturePiece = (
    i: number,
    j: number,
    depuisI: number,
    depuisJ: number,
    piece: Piece
  ) => {
    //une fonction pour capturer
    const newBoard = JSON.parse(JSON.stringify(board));
    const milieuI = (i + depuisI) / 2;
    const milieuJ = (j + depuisJ) / 2;
    const pieceAuMilieu = board[milieuI][milieuJ];
    const getCouleur = (p: string) => (p.includes(Piece.Noir) ? Piece.Noir : Piece.Blanc);

    if (pieceAuMilieu && getCouleur(pieceAuMilieu) !== getCouleur(piece)) {
      newBoard[i][j] = becomeKing(i, j, piece);
      newBoard[depuisI][depuisJ] = Piece.Null;
      newBoard[milieuI][milieuJ] = Piece.Null;
      console.log('Pion mangé !');
    }
    return newBoard;
  };

  const becomeKing = (i: number, j: number, piece: string) => {
    if (piece === Piece.Noir && i === 7) {
      return Piece.RoiNoir;
    } else if (piece === Piece.Blanc && i === 0) {
      return Piece.RoiBlanc;
    } else {
      return piece;
    }
  };

  const directionsPiece: { [piece: string]: [number, number][] } = {
    [Piece.Noir]: [
      [1, -1],
      [1, 1],
      [2, -2],
      [2, 2],
    ],
    [Piece.Blanc]: [
      [-1, -1],
      [-1, 1],
      [-2, -2],
      [-2, 2],
    ],
    [Piece.RoiNoir]: [
      [1, -1],
      [1, 1],
      [-1, -1],
      [-1, 1],
      [2, -2],
      [2, 2],
      [-2, -2],
      [-2, 2],
    ],
    [Piece.RoiBlanc]: [
      [1, -1],
      [1, 1],
      [-1, -1],
      [-1, 1],
      [2, -2],
      [2, 2],
      [-2, -2],
      [-2, 2],
    ],
  };

  const isGameOver = (board: Piece[][]) => {
    let canBlackMove = false;
    let canWhiteMove = false;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (!piece) continue;

        const directions = directionsPiece[piece] || [];

        for (const [di, dj] of directions) {
          const ni = i + di;
          const nj = j + dj;
          if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
            if (canMove(i, j, ni, nj, board)) {
              if (piece.includes(Piece.Noir)) canBlackMove = true;
              if (piece.includes(Piece.Blanc)) canWhiteMove = true;
            }
          }
        }
      }
    }

    console.log(canBlackMove, canWhiteMove);

    if (!canBlackMove || !canWhiteMove) {
      console.log('Game over.');
    }
  };
  
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
      <h1>Jeu de Dames</h1>
      <div style={{ border: '2px solid black', width: 'fit-content' }}>
        {Checkerboard(handleClick, board)}
      </div>
    </div>
  );
}

// 1. Creer une fonction qui comme param le joueur actif et qui retourne toutes les pieces qui peuvent faire un move
// 2. Creer une fonction qui permet de savoir tous les move d'une piece
// 3. creer une fonction qui se base sur 1. et 2. et qui fait un move
// Sauvegarder 5 fois