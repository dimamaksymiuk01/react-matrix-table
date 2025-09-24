import { useState } from 'react';

import styles from './Matrix.module.scss';

import { InputForm } from '@/common/components';
import { MatrixTable } from '@/common/components/MatrixTable/MatrixTable.tsx';
import { useMatrix } from '@/common/hooks';

export const Matrix = () => {
  const [m, setM] = useState<number>(0);
  const [n, setN] = useState<number>(0);
  const [x, setX] = useState<number>(0);

  const {
    matrixData,
    hasData,
    hoveredCellId,
    nearestCellIds,
    incrementCellValue,
    handleCellHover,
  } = useMatrix(m, n, x);

  const handleMatrixSizeChange = (newM: number, newN: number, newX: number) => {
    setM(newM);
    setN(newN);
    setX(newX);
  };

  const handleCellClick = (cellId: number) => {
    incrementCellValue(cellId);
  };

  const handleCellHoverEvent = (cellId: number) => {
    handleCellHover(cellId);
  };

  const handleCellLeave = () => {
    handleCellHover(null);
  };

  return (
    <div className={styles.container}>
      <InputForm onMatrixSizeChange={handleMatrixSizeChange} />

      {hasData && (
        <MatrixTable
          matrixData={matrixData}
          m={m}
          n={n}
          x={x}
          hoveredCellId={hoveredCellId}
          nearestCellIds={nearestCellIds}
          onCellClick={handleCellClick}
          onCellHover={handleCellHoverEvent}
          onCellLeave={handleCellLeave}
        />
      )}
    </div>
  );
};
