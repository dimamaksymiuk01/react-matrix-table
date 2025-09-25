import { useState, useEffect } from 'react';

import styles from './InputForm.module.scss';

import { InputFormProps } from '@/common/types';

export const InputForm = ({ onMatrixSizeChange }: InputFormProps) => {
  const [m, setM] = useState('');
  const [n, setN] = useState('');
  const [x, setX] = useState('');

  const toNumber = (value: string) =>
    value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);

  const mNum = toNumber(m);
  const nNum = toNumber(n);
  const xNum = toNumber(x);
  const maxX = Math.max(0, mNum * nNum - 1);

  const handleChange = (
    value: string,
    setter: (v: string) => void,
    max: number = 100,
  ) => {
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= max)) {
      setter(value);
    }
  };

  useEffect(() => {
    if (xNum > maxX && x !== '') {
      setX(maxX.toString());
    }
  }, [maxX, xNum, x]);

  useEffect(() => {
    onMatrixSizeChange(mNum, nNum, xNum);
  }, [mNum, nNum, xNum, onMatrixSizeChange]);

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
          placeholder='0-100'
          onChange={(e) => handleChange(e.target.value, setM)}
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
          placeholder='0-100'
          onChange={(e) => handleChange(e.target.value, setN)}
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
          placeholder={`0-${maxX}`}
          onChange={(e) => handleChange(e.target.value, setX, maxX)}
          className={`${styles.input} ${styles.inputX}`}
          disabled={maxX === 0}
        />
        <small className={styles.hint}>
          Значення від 0 до {maxX} (максимум для матриці {mNum}×{nNum})
        </small>
      </div>

      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Поточні значення:</h3>
        <div className={styles.values}>
          <div className={`${styles.valueBox} ${styles.valueM}`}>
            <strong>M: {mNum}</strong>
          </div>
          <div className={`${styles.valueBox} ${styles.valueN}`}>
            <strong>N: {nNum}</strong>
          </div>
          <div className={`${styles.valueBox} ${styles.valueX}`}>
            <strong>X: {xNum}</strong>
          </div>
        </div>
        <div className={styles.matrixSize}>
          <strong>
            Створити матрицю: {mNum} × {nNum}
            {xNum > 0 && `, виділяти ${xNum} найближчих клітинок`}
          </strong>
        </div>
      </div>
    </div>
  );
};
