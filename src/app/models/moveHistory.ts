export interface Move {
    depuisI: number;
    depuisJ: number;
    i: number;
    j: number;
    joueur: string; // "noir" ou "blanc"
  }

export type Direction = {
    row: number;
    col: number;
  };

export type Board = Piece[][];

  import { Piece } from"./piece" 
  let moveHistory: Move[] = [];   // Historique local (en mémoire)

//copié depuis page.tsx
  export const PIECE_DIRECTIONS: Record<Piece, Direction[]> = {
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

//copié depuis page.tsx
export function isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: Board): boolean {
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

//copié depuis page.txs
function getPieceColor(piece: Piece): Piece.Noir | Piece.Blanc {
  return piece.includes(Piece.Noir) ? Piece.Noir : Piece.Blanc;
}

//travail demandé
  // fonction: tous les coups possibles
export function getPossiblePositions(piece: Piece, position: Direction): Direction[] {
    const directions = PIECE_DIRECTIONS[piece] || [];
  
    const moves: Direction[] = directions.map((dir) => ({
      row: position.row + dir.row,
      col: position.col + dir.col,
    }));
  
    // Ne garder que les positions qui restent sur l'échiquier
    return moves.filter(
      (pos) => pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8
    );
  }
  
  //un move sur un board
export function applyMove(board: Board, move: Move): Board {
  const newBoard = board.map(row => [...row]); // Copie du plateau

  const pieceToMove = newBoard[move.depuisI][move.depuisJ];
  newBoard[move.i][move.j] = pieceToMove;
  newBoard[move.depuisI][move.depuisJ] = Piece.Null;

  return newBoard;
}

// déplacement: classement pour aider l'ia dans ces prédiction
export function evaluateBoard(board: Board): number {
  let score = 0;

  for (let row of board) {
    for (let cell of row) {
      if (cell === Piece.Noir) score += 1;
      if (cell === Piece.RoiNoir) score += 2; // Le roi vaut plus
      if (cell === Piece.Blanc) score -= 1;
      if (cell === Piece.RoiBlanc) score -= 2;
    }
  }

  return score;
}

//fonction pour valider le mouvement
export function getAllValidMoves(board: Board, joueur: "noir" | "blanc"): Move[] {
  const moves: Move[] = []; //aucun move enregistré à la baseeeee

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece.includes(joueur)) continue;

      const possiblePositions = getPossiblePositions(piece, { row: i, col: j });

      for (const pos of possiblePositions) {
        if (isValidMove(i, j, pos.row, pos.col, board)) {
          moves.push({ //stocker les mouv valides trouvés par l'IA ou par le joueur
            depuisI: i,
            depuisJ: j,
            i: pos.row,
            j: pos.col,
            joueur: joueur,
          });
        }
      }
    }
  }

  return moves;
}
