'use client';

import { useState } from 'react';
import StartScreen from './startScreen';
import Game from './game';

export default function Page() {
  const [started, setStarted] = useState(false);
  const [depth, setDepth] = useState<number>(3);
  const [playerColor, setPlayerColor] = useState<'noir' | 'blanc'>('blanc');
  const [aiVsAi, setAiVsAi] = useState(false); 

  if (!started) {
    return (
      <StartScreen
        onStart={({ depth, playerColor, aiVsAi }) => {
          setDepth(depth);
          setPlayerColor(playerColor);
          setAiVsAi(aiVsAi);
          setStarted(true);
        }}
      />
    );
  }

  return <Game depth={depth} playerColor={playerColor}  aiVsAi={aiVsAi} />;
}
