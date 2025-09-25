import styles from './MatrixTable.module.scss';

import { Cell, MatrixTableProps } from '@/common/types';

export const MatrixTable = ({
  matrixData,
  n,
  x,
  hoveredCellId,
  nearestCellIds,
  hoveredSumRowIndex,
  onCellClick,
  onCellHover,
  onCellLeave,
  onSumCellHover,
  onSumCellLeave,
  onRowRemove,
  onRowAdd,
}: MatrixTableProps) => {
  const { matrix, rowSums, columnPercentiles } = matrixData;

  const getCellClassName = (cellId: number, rowIndex: number, cell: Cell) => {
    let className = styles.cell;

    if (cellId === hoveredCellId) {
      className += ` ${styles.cellHovered}`;
    } else if (nearestCellIds.includes(cellId)) {
      className += ` ${styles.cellNearest}`;
    }

    const percentageClass = getPercentageCellClassName(rowIndex, cell);
    if (percentageClass) {
      className += ` ${percentageClass}`;
    }

    return className;
  };

  const getPercentageForCell = (rowIndex: number, cellValue: number): number => {
    const rowSum = rowSums[rowIndex];
    return rowSum > 0 ? Math.round((cellValue / rowSum) * 100) : 0;
  };

  const getHeatmapIntensity = (rowIndex: number, cellValue: number): number => {
    const row = matrix[rowIndex];
    const maxValueInRow = Math.max(...row.map((cell) => cell.amount));
    return maxValueInRow > 0 ? (cellValue / maxValueInRow) * 100 : 0;
  };

  const getCellContent = (rowIndex: number, cell: Cell): string | number => {
    if (hoveredSumRowIndex === rowIndex) {
      return `${getPercentageForCell(rowIndex, cell.amount)}%`;
    }
    return cell.amount;
  };

  const getPercentageCellClassName = (rowIndex: number, cell: Cell): string => {
    if (hoveredSumRowIndex !== rowIndex) {
      return '';
    }

    const intensity = getHeatmapIntensity(rowIndex, cell.amount);

    if (intensity >= 80) return styles.heatmapVeryHigh;
    if (intensity >= 60) return styles.heatmapHigh;
    if (intensity >= 40) return styles.heatmapMedium;
    if (intensity >= 20) return styles.heatmapLow;
    return styles.heatmapVeryLow;
  };

  const getSumCellClassName = (rowIndex: number) => {
    let className = styles.sumCell;
    if (hoveredSumRowIndex === rowIndex) {
      className += ` ${styles.sumCellHovered}`;
    }
    return className;
  };

  const handleRowRemove = (rowIndex: number) => {
    if (onRowRemove) {
      onRowRemove(rowIndex);
    }
  };

  const handleRowAdd = () => {
    if (onRowAdd) {
      onRowAdd();
    }
  };

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.title}>
        Згенерована матриця {matrix.length} × {n}
        {x > 0 && ` (виділяти ${x} найближчих клітинок)`}
      </h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.actionsHeader}>Дії</th>
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
                <td className={styles.actionsCell}>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRowRemove(rowIndex)}
                    title={`Видалити рядок ${rowIndex + 1}`}
                    disabled={matrix.length <= 1}
                  >
                    Delete
                  </button>
                </td>

                {row.map((cell) => (
                  <td
                    key={cell.id}
                    className={getCellClassName(cell.id, rowIndex, cell)}
                    onClick={() => onCellClick(cell.id)}
                    onMouseEnter={() => onCellHover(cell.id)}
                    onMouseLeave={() => onCellLeave()}
                  >
                    {getCellContent(rowIndex, cell)}
                  </td>
                ))}
                <td
                  className={getSumCellClassName(rowIndex)}
                  onMouseEnter={() => onSumCellHover(rowIndex)}
                  onMouseLeave={() => onSumCellLeave()}
                >
                  {rowSums[rowIndex]}
                </td>
              </tr>
            ))}

            <tr className={styles.percentileRow}>
              <td className={styles.percentileLabel}>60th percentile</td>
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

      <div className={styles.addRowContainer}>
        <button
          className={styles.addRowButton}
          onClick={handleRowAdd}
          title='Додати новий рядок'
        >
          Додати рядок
        </button>
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <strong>Загальна кількість комірок:</strong> {matrix.length * n}
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
        {hoveredSumRowIndex !== null && (
          <div className={styles.infoItem}>
            <strong>Відображення відсотків:</strong> Рядок {hoveredSumRowIndex + 1}
            <span> | Теплова карта активна</span>
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
          <li>
            Наведіть курсор на клітинку з сумою рядка, щоб побачити відсотки та теплову
            карту
          </li>
          <li>Натисніть на кнопку "Delete" щоб видалити рядок</li>
          <li>
            Натисніть на кнопку + "Додати рядок" щоб додати новий рядок в кінець таблиці
          </li>
        </ul>
      </div>
    </div>
  );
};
