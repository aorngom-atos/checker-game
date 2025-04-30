'use client';

import { useState } from 'react';

interface StartScreenProps {
  onStart: (config: { depth: number; playerColor: 'noir' | 'blanc' }) => void; //le faire passer à page.tsx (composant parent)
}

export default function StartScreen({ onStart }: Readonly<StartScreenProps>) {
  const [depth, setDepth] = useState(3); // difficulté par défaut
  const [playerColor, setPlayerColor] = useState<'noir' | 'blanc'>('blanc');

  const handleStart = () => {
    onStart({ depth, playerColor });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '20px',
      backgroundColor: 'grey',
    }}>
      <h1>Bienvenue au jeu de dames !</h1>

      <div>
        <label> Difficulté (1 à 10) : </label>
        <input
          type="number"
          min={1}
          max={10}
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))} //Depth mis à jour après le choix de l'utilisateur 
        />
      </div>

      <div>
        <label>Choisissez votre couleur : </label>
        <select
          value={playerColor}
          onChange={(e) => setPlayerColor(e.target.value as 'noir' | 'blanc')}
        >
          <option value="noir">Noir</option>
          <option value="blanc">Blanc</option>
        </select>
      </div>

      <button onClick={handleStart} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Commencer le jeu
      </button>
    </div>
  );
}
