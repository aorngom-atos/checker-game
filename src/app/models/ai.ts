import { Piece } from"./piece" // pour pouvoir utiliser les différentes pièces
import { getMoveHistory } from "./moveHistory"; // l'historique des coups joués ici
//pour permettre à l'ia d'avoir les 5 (noirs et blancs) et pouvoir jouer en fonction de ces 10 mouvements là

export const getBestMoveAfterAnalysis = (board: Piece[][]): [number, number, number, number] | null => {
  const history = getMoveHistory();

  // normalement minimax est censé être ici après
  //condition pour vérifier que les 10 mouvements là sont déjà fait avant que l'ia ne commence à analyser (il ne doit pas le faire trop tôt)
  if (history.length >= 10) {
    const last = history[history.length - 1]; //dernier mouvement
    // move au hasard à partir de last (par l'ia)
  }

  return null;
};
