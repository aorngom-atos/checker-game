import Image from 'next/image';
import { Piece } from './models/piece';

export default function Checkerboard(handleClick: (i: number, j: number) => void, board: Piece[][]) {
  const rows = [];

    for (let i = 0; i < 8; i++) {
      const cells = [];

      for (let j = 0; j < 8; j++) {
        const isBlack = (i + j) % 2 === 1;
        const piece = board[i][j];

        let pionImage = null;
        if (piece === Piece.Noir) {
          pionImage = (
            <Image
              src='/pion-noir.png'
              alt='Pion noir'
              width={30}
              height={30}
              style={{ margin: 'auto', marginTop: '10px' }}
            />
          );
        } else if (piece === Piece.Blanc) {
          pionImage = (
            <Image
              src='/pion-blanc.png'
              alt='Pion blanc'
              width={60}
              height={60}
              style={{ margin: 'auto', marginTop: '10px' }}
            />
          );
        } else if (piece === Piece.RoiNoir) {
          pionImage = (
            <Image
              src='/roi-noir.png'
              alt='Roi noir'
              width={30}
              height={30}
              style={{ margin: 'auto', marginTop: '10px' }}
            />
          );
        } else if (piece === Piece.RoiBlanc) {
          pionImage = (
            <Image
              src='/roi-blanc.png'
              alt='Roi blanc'
              width={60}
              height={60}
              style={{ margin: 'auto', marginTop: '10px' }}
            />
          );
        }

        cells.push(
          <div
            key={`${i}-${j}`}
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: isBlack ? 'black' : 'white',
              display: 'flex',
            }}
            onClick={() => handleClick(i, j)}
          >
            {pionImage}
          </div>
        );
      }

      rows.push(
        <div key={i} style={{ display: 'flex' }}>
          {cells}
        </div>
      );
    }
    
    return rows;
}