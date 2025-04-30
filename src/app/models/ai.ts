//node: c'est le plateau jeu
//depth: nombre d'étapes à prévoir à l'avance
// maximizingPlayer: boolean (au tour de l'ia ou p)
//child: un nouveau plateau (l'ancien mis à jour)
//value: meilleu score qu'on peut obtenir depuis cet état
//heuristic value of node: le score d'un plateau donné
import { Board, getAllValidMoves, applyMove, evaluateBoard, Move } from "./moveHistory";

export function minimax(board: Board, depth : number, maximizingPlayer : boolean): { score: number, move: Move | null} {

  if (depth === 0|| getAllValidMoves(board, maximizingPlayer ? "noir" : "blanc").length === 0)
    return { score: evaluateBoard(board), move: null}

  if(maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove: Move | null = null
    const moves = getAllValidMoves(board, "noir");
    for(const move of moves) {
      const newboard = applyMove(board, move);
      const { score} = minimax(newboard, depth - 1, false)
      if( score > maxEval) {
        maxEval = score;
        bestMove = move;
      }
    }
    return {score: maxEval, move: bestMove};
  }
  else {
    let miniEval = Infinity;
    let bestMove: Move | null = null
    const moves = getAllValidMoves(board, "blanc")
    for (const move of moves) {
      const newBoard = applyMove(board, move);
      const { score } = minimax(newBoard, depth - 1, false)
      if( score < miniEval) {
        miniEval = score;
        bestMove = move;
      }
    }
    return { score: miniEval, move: bestMove};
  }
}


// Pseudo code minimex, se baser sur ça pour faire l'ia
/*function minimax(node, depth, maximizingPlayer) is
    if depth = 0 or node is a terminal node then
        return the heuristic value of node
    if maximizingPlayer then
        value := −∞
        for each child of node do
            value := max(value, minimax(child, depth − 1, FALSE))
    else (* minimizing player *)
        value := +∞
        for each child of node do
            value := min(value, minimax(child, depth − 1, TRUE))
    return value*/
