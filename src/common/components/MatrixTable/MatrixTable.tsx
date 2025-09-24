import styles from './MatrixTable.module.scss';

import { MatrixTableProps } from '@/common/types';

export const MatrixTable = ({
  matrixData,
  m,
  n,
  x,
  hoveredCellId,
  nearestCellIds,
  onCellClick,
  onCellHover,
  onCellLeave,
}: MatrixTableProps) => {
  const { matrix, rowSums, columnPercentiles } = matrixData;

  const getCellClassName = (cellId: number) => {
    let className = styles.cell;

    if (cellId === hoveredCellId) {
      className += ` ${styles.cellHovered}`;
    } else if (nearestCellIds.includes(cellId)) {
      className += ` ${styles.cellNearest}`;
    }

    return className;
  };

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.title}>
        Згенерована матриця {m} × {n}
        {x > 0 && ` (виділяти ${x} найближчих клітинок)`}
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
                  <td
                    key={cell.id}
                    className={getCellClassName(cell.id)}
                    onClick={() => onCellClick(cell.id)}
                    onMouseEnter={() => onCellHover(cell.id)}
                    onMouseLeave={() => onCellLeave()}
                  >
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
        {hoveredCellId && (
          <div className={styles.infoItem}>
            <strong>Наведена клітинка:</strong> ID {hoveredCellId}
            {nearestCellIds.length > 0 && (
              <span> | Виділено {nearestCellIds.length} найближчих клітинок</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.instructions}>
        <h4>Інструкції:</h4>
        <ul>
          <li>Натисніть на клітинку, щоб збільшити її значення на 1</li>
          <li>
            Наведіть курсор на клітинку, щоб побачити найближчі за значенням клітинки
          </li>
        </ul>
      </div>
    </div>
  );
};
