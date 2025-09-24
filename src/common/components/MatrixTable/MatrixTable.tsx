import React from 'react';

import styles from './MatrixTable.module.scss';

import { MatrixTableProps } from '@/common/types';

export const MatrixTable: React.FC<MatrixTableProps> = ({ matrixData, m, n }) => {
  const { matrix, rowSums, columnPercentiles } = matrixData;

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.title}>
        Згенерована матриця {m} × {n}
      </h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {Array.from({ length: n }, (_, index) => (
                <th key={`header-${index}`} className={styles.columnHeader}>
                  Cell values N={index + 1}
                </th>
              ))}
              <th className={styles.sumHeader}>Sum values</th>
            </tr>
          </thead>

          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className={styles.dataRow}>
                {row.map((cell) => (
                  <td key={cell.id} className={styles.cell}>
                    {cell.amount}
                  </td>
                ))}
                <td className={styles.sumCell}>{rowSums[rowIndex]}</td>
              </tr>
            ))}

            <tr className={styles.percentileRow}>
              {columnPercentiles.map((percentile, index) => (
                <td key={`percentile-${index}`} className={styles.percentileCell}>
                  {percentile.toFixed(1)}
                </td>
              ))}
              <td className={styles.percentileLabel}>60th percentile</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <strong>Загальна кількість комірок:</strong> {m * n}
        </div>
        <div className={styles.infoItem}>
          <strong>Загальна сума матриці:</strong>{' '}
          {rowSums.reduce((sum, rowSum) => sum + rowSum, 0)}
        </div>
      </div>
    </div>
  );
};
