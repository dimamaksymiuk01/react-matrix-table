import { useState, useEffect } from 'react';

import styles from './InputForm.module.scss';

import { HandleInputChangeParams, InputFormProps } from '@/common/types';

export const InputForm = ({ onMatrixSizeChange }: InputFormProps) => {
  const [m, setM] = useState<number>(0);
  const [n, setN] = useState<number>(0);
  const [x, setX] = useState<number>(0);

  const calculateXLimits = (mValue: number, nValue: number) => {
    const totalCells = mValue * nValue;
    return Math.max(0, totalCells - 1);
  };

  const maxX = calculateXLimits(m, n);

  const handleInputChange = ({
    value,
    setter,
    max,
  }: HandleInputChangeParams & { max?: number }) => {
    if (value === '') {
      setter(0);
      return;
    }

    const numValue = parseInt(value, 10);
    const upperLimit = max || 100;

    if (numValue >= 0 && numValue <= upperLimit) {
      setter(numValue);
    }
  };

  const handleXChange = (value: string) => {
    handleInputChange({
      value,
      setter: setX,
      max: maxX,
    });
  };

  useEffect(() => {
    if (x > maxX) {
      setX(maxX);
    }
  }, [maxX, x]);

  useEffect(() => {
    onMatrixSizeChange(m, n, x);
  }, [m, n, x, onMatrixSizeChange]);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Налаштування матриці</h2>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Кількість рядків (M):</label>
        <input
          type='number'
          min='0'
          max='100'
          value={m}
          onChange={(e) => handleInputChange({ value: e.target.value, setter: setM })}
          className={`${styles.input} ${styles.inputM}`}
        />
        <small className={styles.hint}>Значення від 0 до 100</small>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Кількість стовпців (N):</label>
        <input
          type='number'
          min='0'
          max='100'
          value={n}
          onChange={(e) => handleInputChange({ value: e.target.value, setter: setN })}
          className={`${styles.input} ${styles.inputN}`}
        />
        <small className={styles.hint}>Значення від 0 до 100</small>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Кількість найближчих клітинок (X):</label>
        <input
          type='number'
          min='0'
          max={maxX}
          value={x}
          onChange={(e) => handleXChange(e.target.value)}
          className={`${styles.input} ${styles.inputX}`}
          disabled={maxX === 0}
        />
        <small className={styles.hint}>
          Значення від 0 до {maxX} (максимум для матриці {m}×{n})
        </small>
      </div>

      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Поточні значення:</h3>
        <div className={styles.values}>
          <div className={`${styles.valueBox} ${styles.valueM}`}>
            <strong>M: {m}</strong>
          </div>
          <div className={`${styles.valueBox} ${styles.valueN}`}>
            <strong>N: {n}</strong>
          </div>
          <div className={`${styles.valueBox} ${styles.valueX}`}>
            <strong>X: {x}</strong>
          </div>
        </div>
        <div className={styles.matrixSize}>
          <strong>
            Створити матрицю: {m} × {n}
            {x > 0 && `, виділяти ${x} найближчих клітинок`}
          </strong>
        </div>
      </div>
    </div>
  );
};
