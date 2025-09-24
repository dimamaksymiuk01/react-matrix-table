import { useState, useEffect } from 'react';

import styles from './InputForm.module.scss';

import { HandleInputChangeParams, InputFormProps } from '@/common/types';

export const InputForm = ({ onMatrixSizeChange }: InputFormProps) => {
  const [m, setM] = useState<number>(0);
  const [n, setN] = useState<number>(0);

  const handleInputChange = ({ value, setter }: HandleInputChangeParams) => {
    if (value === '') {
      setter(0);
      return;
    }

    const numValue = parseInt(value, 10);
    if (numValue >= 0 && numValue <= 100) {
      setter(numValue);
    }
  };

  useEffect(() => {
    onMatrixSizeChange(m, n);
  }, [m, n, onMatrixSizeChange]);

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

      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Поточні значення:</h3>
        <div className={styles.values}>
          <div className={`${styles.valueBox} ${styles.valueM}`}>
            <strong>M: {m}</strong>
          </div>
          <div className={`${styles.valueBox} ${styles.valueN}`}>
            <strong>N: {n}</strong>
          </div>
        </div>
        <div className={styles.matrixSize}>
          <strong>
            Створити матрицю: {m} × {n}
          </strong>
        </div>
      </div>
    </div>
  );
};
