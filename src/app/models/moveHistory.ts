export interface Move {
    depuisI: number;
    depuisJ: number;
    i: number;
    j: number;
    joueur: string; // "noir" ou "blanc"
  }
  
  // Historique local (en mémoire)
  let moveHistory: Move[] = [];
  
  // Enregistre un mouvement
  export function recordMove(depuisI: number, depuisJ: number, i: number, j: number, joueur: string) {
    moveHistory.push({ depuisI, depuisJ, i, j, joueur });
    console.log(`Mouvement enregistré : ${joueur} de [${depuisI},${depuisJ}] à [${i},${j}]`); // pour vérifier si tout est ok
  }
  
  // Retourne tous les mouvements enregistrés
  export function getMoveHistory(): Move[] {
    return moveHistory;
  }
  
  // Réinitialise l'historique
  export function resetMoveHistory() {
    moveHistory = [];
    console.log("Historique réinitialisé");
  }
  
  // Vérifie si chaque joueur a joué 5 fois
  export function hasPlayedFiveTurnsEach(): boolean {
    const noir = moveHistory.filter((m) => m.joueur === "noir").length;
    const blanc = moveHistory.filter((m) => m.joueur === "blanc").length;
    return noir >= 5 && blanc >= 5;
  }
  
  // Analyse simple 
  export function analyzeMoveHistory(): Move | null {
    if (!hasPlayedFiveTurnsEach()) {
      console.log("Pas encore assez de données pour analyser");
      return null;
    }
  
    // Exemple : retourne le dernier coup de l'IA (noir) comme base d’analyse
    const noirMoves = moveHistory.filter((m) => m.joueur === "noir");
    const dernier = noirMoves[noirMoves.length - 1];
    console.log("Analyse basée sur le dernier coup noir :", dernier);
    return dernier;
  }
  