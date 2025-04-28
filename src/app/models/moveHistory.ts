export interface Move {
    depuisI: number;
    depuisJ: number;
    i: number;
    j: number;
    joueur: string; // "noir" ou "blanc"
  }
  export type Board = Piece[][];
  import { Piece } from"./piece" 
  import { isValidMove } from "@/app/page";
  // Historique local (en mémoire)
  let moveHistory: Move[] = [];

//reste des fonctions supprimées.
 
//travail demandé
  // fonction: tous les coups possibles

export function getAllValidMoves(board: Board, joueur: "noir" | "blanc"): Move[] {
  const moves: Move[] = [];

  for (let depuisI = 0; depuisI < 8; depuisI++) {
    for (let depuisJ = 0; depuisJ < 8; depuisJ++) {
      const piece = board[depuisI][depuisJ];
      if (!piece.includes(joueur)) continue;

      for (let di = -2; di <= 2; di++) {
        for (let dj = -2; dj <= 2; dj++) {
          if (di === 0 && dj === 0) continue;
          const i = depuisI + di;
          const j = depuisJ + dj;
          if (i >= 0 && i < 8 && j >= 0 && j < 8) {
            if (isValidMove(depuisI, depuisJ, i, j, board)) {
              moves.push({ depuisI, depuisJ, i, j, joueur });
            }
          }
        }
      }
    }
  }

  return moves;
}

  //un move sur un board


export function applyMove(board: Board, move: Move): Board {
  const newBoard = board.map(row => [...row]); // Copie du plateau

  const pieceToMove = newBoard[move.depuisI][move.depuisJ];
  newBoard[move.i][move.j] = pieceToMove;
  newBoard[move.depuisI][move.depuisJ] = Piece.Null;

  return newBoard;
}

  