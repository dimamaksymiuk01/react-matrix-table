import { useState } from 'react';

import styles from './Matrix.module.scss';

import { InputForm } from '@/common/components';
import { MatrixTable } from '@/common/components/MatrixTable/MatrixTable.tsx';
import { useMatrix } from '@/common/hooks';

export const Matrix = () => {
  const [m, setM] = useState<number>(0);
  const [n, setN] = useState<number>(0);

  const { matrixData, hasData } = useMatrix(m, n);

  const handleMatrixSizeChange = (newM: number, newN: number) => {
    setM(newM);
    setN(newN);
  };

  return (
    <div className={styles.container}>
      <InputForm onMatrixSizeChange={handleMatrixSizeChange} />

      {hasData && <MatrixTable matrixData={matrixData} m={m} n={n} />}
    </div>
  );
};
