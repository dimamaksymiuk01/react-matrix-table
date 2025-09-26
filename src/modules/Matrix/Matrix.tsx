import { useState, useEffect } from 'react';

import styles from './Matrix.module.scss';

import crabIcon from '@/assets/crab.svg';
import { InputForm } from '@/common/components';
import { MatrixTable } from '@/common/components/MatrixTable/MatrixTable.tsx';
import { useMatrix } from '@/common/hooks';

export const Matrix = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [m, setM] = useState<number>(0);
  const [n, setN] = useState<number>(0);
  const [x, setX] = useState<number>(0);

  const {
    matrixData,
    hasData,
    nearestCellIds,
    hoveredSumRowIndex,
    incrementCellValue,
    removeRow,
    addRow,
    handleCellHover,
    handleCellLeave,
    handleSumCellHover,
    tableCellsRef,
  } = useMatrix(m, n, x);

  const handleMatrixSizeChange = (newM: number, newN: number, newX: number) => {
    setM(newM);
    setN(newN);
    setX(newX);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loader}>
          <img src={crabIcon} alt='Loading...' className={styles.loaderIcon} />
        </div>
      ) : (
        <>
          <InputForm onMatrixSizeChange={handleMatrixSizeChange} />

          {hasData && (
            <MatrixTable
              matrixData={matrixData}
              m={m}
              n={n}
              x={x}
              tableCellsRef={tableCellsRef}
              nearestCellIds={nearestCellIds}
              hoveredSumRowIndex={hoveredSumRowIndex}
              onCellClick={incrementCellValue}
              onCellHover={handleCellHover}
              onCellLeave={handleCellLeave}
              onSumCellHover={handleSumCellHover}
              onSumCellLeave={() => handleSumCellHover(null)}
              onRowRemove={removeRow}
              onRowAdd={addRow}
            />
          )}
        </>
      )}
    </div>
  );
};
