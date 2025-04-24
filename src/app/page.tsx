"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [joueurActif, setJoueurActif] = useState<"noir" | "blanc">("noir");
  const [pieceToMove, setPieceToMove] = useState<string | null >(null);
  const [gameOver, setGameOver] = useState(false);



  const [board, setBoard] = useState(() => {
   const damierboard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          damierboard[i][j] = "noir";
        }
      }
    }

    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          damierboard[i][j] = "blanc";
        }
      }
    }

    return damierboard;
    /*return [[null, null, null, null, null, null, null, "noir"], 
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, "noir", null, null, null],
            [null, null, null, null, null, "noir", null, "noir"],
            ["blanc", null, null, null, null, null, "blanc", null],
            ]*/
  });

  const Checkerboard = () => {
    const rows = [];
    console.log(board)

    for (let i = 0; i < 8; i++) {
      const cells = [];

      for (let j = 0; j < 8; j++) {
        const isBlack = (i + j) % 2 === 1;
        const piece = board[i][j];

        let pionImage = null;
        if (piece === "noir") {
          pionImage = (
            <Image
              src="/pion-noir.png"
              alt="Pion noir"
              width={30}
              height={30}
              style={{ margin: "auto", marginTop: "10px" }}
            />
          );
        } else if (piece === "blanc") {
          pionImage = (
            <Image
              src="/pion-blanc.png"
              alt="Pion blanc"
              width={60}
              height={60}
              style={{ margin: "auto", marginTop: "10px" }}
            />
          );
        } else if (piece === "roi-noir") {
          pionImage = (
            <Image
              src="/roi-noir.png"
              alt="Roi noir"
              width={30}
              height={30}
              style={{ margin: "auto", marginTop: "10px" }}
            />
          );
        } else if (piece === "roi-blanc") {
          pionImage = (
            <Image
              src="/roi-blanc.png"
              alt="Roi blanc"
              width={60}
              height={60}
              style={{ margin: "auto", marginTop: "10px" }}
            />
          );
        }

        cells.push(
          <div
            key={`${i}-${j}`}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: isBlack ? "black" : "white",
              display: "flex",
            }}
            onClick={() => handleClick(i, j)}
          >
            {pionImage}
          </div>
        );
      }

      rows.push(
        <div key={i} style={{ display: "flex" }}>
          {cells}
        </div>
      );
    }

    return rows;
  };

  //handleclick
  const handleClick = (i: number, j: number) => {
    const clickedPiece = board[i][j];
    if (selected === null) {
      if(
      (clickedPiece === "noir" && joueurActif === "noir") ||
      (clickedPiece === "blanc" && joueurActif === "blanc") ||
      (clickedPiece === "roi-noir" && joueurActif === "noir") ||
      (clickedPiece === "roi-blanc" && joueurActif === "blanc")) {
        setSelected([i, j]);
        setPieceToMove(clickedPiece);
        //console.log([i, j]);
      } else {
        console.log("Ce n’est pas ton tour !");
      }

    } else {
      movePiece(i,j);
    }
  }
  //pièce bouge en fonction des différentes conditions

  const movePiece = (i: number, j: number) => {
    let newboard: (string | null)[][]
    if (!selected || !pieceToMove) return;
  
    const [depuisI, depuisJ] = selected;
  
    // Vérifie que la case d'arrivée est vide
    if (board[i][j] !== null) {
      console.log("Déplacement interdit : case déjà occupée");
      setSelected(null);
      return;
    }
    //if()
  
    const isCaptureMove = Math.abs(i - depuisI) === 2 && Math.abs(j - depuisJ) === 2;
  
    if (isCaptureMove) {
      //console.log("erreur")
      newboard  = capturePiece(i, j, depuisI, depuisJ, pieceToMove);
      setSelected(null);
    } else {
      //console.log("erreur")
      // Sinon, c'est un déplacement normal
      const isValid = validMove(depuisI, depuisJ, i, j, pieceToMove, board);
      if (!isValid) {
        //console.log("null")
        setSelected(null);
        return;
      }
      newboard = normalMove(i, j, depuisI, depuisJ, pieceToMove);
    }
    setSelected(null);
    setPieceToMove(null);
    setJoueurActif(joueurActif === "noir" ? "blanc" : "noir");
    setBoard(newboard);
    evalGame(newboard);
  };

  
  

  const normalMove = (i: number, j: number, depuisI: number, depuisJ: number, piece: string) => {
    //fonction pour move normal
    //console.log("test")
    const newBoard = board.map((row) => row.slice());
    //console.log(board)
    newBoard[i][j] = becomeKing(i, j, piece);
    newBoard[depuisI][depuisJ] = null;
    //console.log(newBoard)
    return newBoard;
  }


  const validMove = (depuisI: number, depuisJ: number, i: number, j: number, piece: string, board: (string | null)[][] ): boolean => {
    //
        // Vérifie que la case d'arrivée est vide
        if (board[i][j] !== null) {
          console.log("Déplacement interdit : case déjà occupée");
          setSelected(null);
          return false;
        }
    if (piece === "noir" || piece === "blanc") {
      const validerMove =
        piece === "noir"
          ? i === depuisI + 1 && Math.abs(j - depuisJ) === 1 || i === depuisI + 2 && Math.abs(j - depuisJ) === 2
          : i === depuisI - 1 && Math.abs(j - depuisJ) === 1 || i === depuisI - 2 && Math.abs(j - depuisJ) === 2;
  
      if (!validerMove) {
        setSelected(null);
        return false;
      }
  
      return true;
    }
  
    if (piece === "roi-noir" || piece === "roi-blanc") {
      return Math.abs(i - depuisI) === Math.abs(j - depuisJ);
    }
    
    return false;
  };
  

  

  const capturePiece = (i: number, j: number, depuisI: number, depuisJ: number, piece: string) => {
    //une fonction pour capturer 
    const newBoard = board.map((row) => row.slice());
    const milieuI = (i + depuisI) / 2;
    const milieuJ = (j + depuisJ) / 2;
    const pieceAuMilieu = board[milieuI][milieuJ];
    //console.log(pieceAuMilieu)
    //console.log(piece)
    const getCouleur = (p: string) => p.includes( "noir" ) ? "noir" : "blanc";
    
    if (
      pieceAuMilieu &&
      getCouleur(pieceAuMilieu) !== getCouleur(piece)
    ) {
      newBoard[i][j] = becomeKing(i, j, piece);
      newBoard[depuisI][depuisJ] = null;
      newBoard[milieuI][milieuJ] = null;
      //console.log(newBoard)
      console.log("Pion mangé !");
    }
    return newBoard;
  };
  

  const becomeKing = (i: number, j: number, piece: string) => {
  
    if (piece === "noir" && i === 7) {
      return "roi-noir";
    } else if (piece === "blanc" && i === 0) {
      return "roi-blanc";
    } else {
      return piece;
    }
    
  };
  
    // après chaque déplacement, on doit voir si il est possible pour le pion de se déplacer ou si le jeu est fini
    // si le joueur n'a plus de pions: game over
    //si le joueur a des pions qui ne peuvent plus bouger: game over
   /* const evalGame = (board: (string | null)[][], joueurActif: "noir" | "blanc") => {
      const adversaire = joueurActif === "noir" ? "blanc" : "noir";
      let pionAdversaireExiste = false;
      //deux booleans
      //condition

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          if (piece && piece.includes(adversaire)) {
            pionAdversaireExiste = true;
            console.log("test")
            break;
          }
        }
       if (pionAdversaireExiste)
        console.log("test2 ")
        break;
      }
    
     if (!pionAdversaireExiste) {
        console.log("Game Over.")
        setGameOver(true); // plus aucun mouvement possible
      }
    };*/

    const directionsPiece: { [piece: string]: [number, number][] } = {
      "noir": [[1, -1], [1, 1], [2, -2], [2, 2]],
      "blanc": [[-1, -1], [-1, 1], [-2, -2], [-2, 2]],
      "roi-noir": [[1, -1], [1, 1], [-1, -1], [-1, 1], [2, -2], [2, 2], [-2, -2], [-2, 2]],
      "roi-blanc": [[1, -1], [1, 1], [-1, -1], [-1, 1], [2, -2], [2, 2], [-2, -2], [-2, 2]],

      //déplacement autorisé pour chaque pion
    };

    const evalGame = (board: (string | null)[][]) => {
        let canBlackMove = false
          let canWhiteMove = false

          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              const piece = board[i][j];
              if (!piece) continue;
          
              const directions = directionsPiece[piece] || [];
          
              for (const [di, dj] of directions) {
                const ni = i + di;
                const nj = j + dj;
                console.log("move %s %d %d to %d %d", piece, i, j, ni, nj)
                if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
                  if (validMove(i, j, ni, nj, piece, board)) {
                    console.log("move %d %d %d %d", i, j, ni, nj)
                    if (piece.includes("noir")) canBlackMove = true;
                    if (piece.includes("blanc")) canWhiteMove = true;
                  }
                }
              }

            }
          }
          console.log(canBlackMove)
          console.log(canWhiteMove)
        if (!canBlackMove || !canWhiteMove) {
          console.log("Game over.") 
          return;
        }
     }

    
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1>Jeu de Dames</h1>
      <div style={{ border: "2px solid black", width: "fit-content" }}>
        {Checkerboard()}
      </div>
    </div>
  );
}
