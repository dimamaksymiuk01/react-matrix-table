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
    hoveredSumRowIndex,
    incrementCellValue,
    handleCellHover,
    handleSumCellHover,
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

  const handleSumCellHoverEvent = (rowIndex: number) => {
    handleSumCellHover(rowIndex);
  };

  const handleSumCellLeave = () => {
    handleSumCellHover(null);
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
          hoveredSumRowIndex={hoveredSumRowIndex}
          onCellClick={handleCellClick}
          onCellHover={handleCellHoverEvent}
          onCellLeave={handleCellLeave}
          onSumCellHover={handleSumCellHoverEvent}
          onSumCellLeave={handleSumCellLeave}
        />
      )}
    </div>
  );
};
