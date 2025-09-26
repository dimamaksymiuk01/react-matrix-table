import { useState, useEffect } from 'react';

import styles from './InputForm.module.scss';

import { InputFormProps } from '@/common/types';
import { toNumber } from '@/common/utils';

export const InputForm = ({ onMatrixSizeChange }: InputFormProps) => {
  const [rowsInput, setRowsInput] = useState('');
  const [columnsInput, setColumnsInput] = useState('');
  const [nearestCellsInput, setNearestCellsInput] = useState('');

  const rowsCount = toNumber(rowsInput);
  const columnsCount = toNumber(columnsInput);
  const nearestCellsCount = toNumber(nearestCellsInput);
  const maxNearestCells = Math.max(0, rowsCount * columnsCount - 1);

  const handleInputChange = (
    value: string,
    setter: (v: string) => void,
    maxValue: number = 100,
  ) => {
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= maxValue)) {
      setter(value);
    }
  };

  useEffect(() => {
    if (nearestCellsCount > maxNearestCells && nearestCellsInput !== '') {
      setNearestCellsInput(maxNearestCells.toString());
    }
  }, [maxNearestCells, nearestCellsCount, nearestCellsInput]);

  useEffect(() => {
    onMatrixSizeChange(rowsCount, columnsCount, nearestCellsCount);
  }, [rowsCount, columnsCount, nearestCellsCount, onMatrixSizeChange]);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Matrix Settings</h2>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Number of rows (M):</label>
        <input
          type='number'
          min='0'
          max='100'
          value={rowsInput}
          placeholder='0-100'
          onChange={(e) => handleInputChange(e.target.value, setRowsInput)}
          className={`${styles.input} ${styles.inputM}`}
        />
        <small className={styles.hint}>Value from 0 to 100</small>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Number of columns (N):</label>
        <input
          type='number'
          min='0'
          max='100'
          value={columnsInput}
          placeholder='0-100'
          onChange={(e) => handleInputChange(e.target.value, setColumnsInput)}
          className={`${styles.input} ${styles.inputN}`}
        />
        <small className={styles.hint}>Value from 0 to 100</small>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Number of nearest cells (X):</label>
        <input
          type='number'
          min='0'
          max={maxNearestCells}
          value={nearestCellsInput}
          placeholder={`0-${maxNearestCells}`}
          onChange={(e) =>
            handleInputChange(e.target.value, setNearestCellsInput, maxNearestCells)
          }
          className={`${styles.input} ${styles.inputX}`}
          disabled={maxNearestCells === 0}
        />
        <small className={styles.hint}>
          Value from 0 to {maxNearestCells} (maximum for {rowsCount}×{columnsCount}{' '}
          matrix)
        </small>
      </div>
      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Current values:</h3>
        <div className={styles.values}>
          <div className={`${styles.valueBox} ${styles.valueM}`}>
            <strong>M: {rowsCount}</strong>
          </div>
          <div className={`${styles.valueBox} ${styles.valueN}`}>
            <strong>N: {columnsCount}</strong>
          </div>
          <div className={`${styles.valueBox} ${styles.valueX}`}>
            <strong>X: {nearestCellsCount}</strong>
          </div>
        </div>
        <div className={styles.matrixSize}>
          <strong>
            Generated matrix: {rowsCount} × {columnsCount}
            {nearestCellsCount > 0 && `, highlight ${nearestCellsCount} nearest cells`}
          </strong>
        </div>
      </div>
    </div>
  );
};
