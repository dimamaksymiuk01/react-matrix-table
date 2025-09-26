import { useRef } from 'react';

import styles from './MatrixTable.module.scss';

import { useVirtualization } from '@/common/hooks';
import { Cell, MatrixTableProps } from '@/common/types';

export const MatrixTable = ({
  matrixData,
  n,
  x,
  nearestCellIds,
  hoveredSumRowIndex,
  onCellClick,
  onCellHover,
  onCellLeave,
  onSumCellHover,
  onSumCellLeave,
  onRowRemove,
  onRowAdd,
  tableCellsRef,
}: MatrixTableProps) => {
  const { matrix, rowSums, columnPercentiles } = matrixData;
  const hoveredCellId = useRef<number | null>(null);

  const virtualization = useVirtualization({
    totalRows: matrix.length,
    totalCols: n,
    containerHeight: 600,
    rowHeight: 40,
    columnWidth: 100,
    overscan: 5,
    overscanCols: 4,
  });

  const {
    scrollContainerRef,
    handleScroll,
    startIndex,
    endIndex,
    topPaddingHeight,
    bottomPaddingHeight,
    colStart,
    colEnd,
    leftPaddingWidth,
    rightPaddingWidth,
    columnWidth,
    containerHeight,
  } = virtualization;

  const visibleRows = matrix.slice(startIndex, endIndex);

  const getCellClassName = (cellId: number, rowIndex: number, cell: Cell) => {
    let className = styles.cell;

    if (nearestCellIds.includes(cellId)) {
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
        Generated matrix {matrix.length} × {n}
        {x > 0 && ` (highlight ${x} nearest cells)`}
      </h3>
      <div
        className={styles.tableWrapper}
        ref={scrollContainerRef}
        style={{ maxHeight: containerHeight, overflowY: 'auto' }}
        onScroll={handleScroll}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.actionsHeader}>Actions</th>
              {colStart > 0 && (
                <th colSpan={colStart}>
                  <div style={{ width: leftPaddingWidth }} />
                </th>
              )}
              {Array.from({ length: colEnd - colStart }, (_, index) => {
                const colIndex = colStart + index;
                return (
                  <th
                    key={`header-${colIndex}`}
                    className={styles.columnHeader}
                    style={{ width: columnWidth, minWidth: columnWidth }}
                  >
                    Cell values N={colIndex + 1}
                  </th>
                );
              })}
              {colEnd < n && (
                <th colSpan={n - colEnd} style={{ padding: 0 }}>
                  <div style={{ width: rightPaddingWidth }} />
                </th>
              )}
              <th className={styles.sumHeader}>Sum values</th>
            </tr>
          </thead>
          <tbody>
            {topPaddingHeight > 0 && (
              <tr style={{ height: topPaddingHeight }}>
                <td colSpan={n + 2} />
              </tr>
            )}
            {visibleRows.map((row, virtualIndex) => {
              const rowIndex = startIndex + virtualIndex;
              return (
                <tr key={`row-${rowIndex}`} className={styles.dataRow}>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.removeButtonSoft}
                      onClick={() => handleRowRemove(rowIndex)}
                      title={`Remove row ${rowIndex + 1}`}
                      disabled={matrix.length <= 1}
                    ></button>
                  </td>
                  {colStart > 0 && (
                    <td colSpan={colStart} style={{ padding: 0 }}>
                      <div style={{ width: leftPaddingWidth }} />
                    </td>
                  )}
                  {row.slice(colStart, colEnd).map((cell) => (
                    <td
                      ref={(el) => {
                        if (el) {
                          tableCellsRef?.current?.set(cell.id, el);
                        } else {
                          tableCellsRef?.current?.delete(cell.id);
                        }
                      }}
                      key={cell.id}
                      className={getCellClassName(cell.id, rowIndex, cell)}
                      onClick={() => onCellClick(cell.id)}
                      onMouseEnter={() => {
                        hoveredCellId.current = cell.id;
                        onCellHover(cell);
                      }}
                      onMouseLeave={() => {
                        hoveredCellId.current = null;
                        onCellLeave();
                      }}
                      style={{ width: columnWidth, minWidth: columnWidth }}
                    >
                      {getCellContent(rowIndex, cell)}
                    </td>
                  ))}
                  {colEnd < n && (
                    <td colSpan={n - colEnd} style={{ padding: 0 }}>
                      <div style={{ width: rightPaddingWidth }} />
                    </td>
                  )}
                  <td
                    className={getSumCellClassName(rowIndex)}
                    onMouseEnter={() => onSumCellHover(rowIndex)}
                    onMouseLeave={() => onSumCellLeave()}
                  >
                    {rowSums[rowIndex]}
                  </td>
                </tr>
              );
            })}
            {bottomPaddingHeight > 0 && (
              <tr style={{ height: bottomPaddingHeight }}>
                <td colSpan={n + 2} />
              </tr>
            )}
            <tr className={styles.percentileRow}>
              <td className={styles.percentileLabel}>60th percentile</td>
              {colStart > 0 && (
                <td colSpan={colStart} style={{ padding: 0 }}>
                  <div style={{ width: leftPaddingWidth }} />
                </td>
              )}
              {columnPercentiles.slice(colStart, colEnd).map((percentile, index) => {
                const colIndex = colStart + index;
                return (
                  <td
                    key={`percentile-${colIndex}`}
                    className={styles.percentileCell}
                    style={{ width: columnWidth, minWidth: columnWidth }}
                  >
                    {percentile.toFixed(1)}
                  </td>
                );
              })}
              {colEnd < n && (
                <td colSpan={n - colEnd} style={{ padding: 0 }}>
                  <div style={{ width: rightPaddingWidth }} />
                </td>
              )}
              <td className={styles.percentileLabel}>60th percentile</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.addRowContainerIcon}>
        <button className={styles.addRowButton} onClick={handleRowAdd}>
          Add row
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.infoItem}>
          <strong>Total number of cells:</strong> {matrix.length * n}
        </div>
        <div className={styles.infoItem}>
          <strong>Total matrix sum:</strong>{' '}
          {rowSums.reduce((sum, rowSum) => sum + rowSum, 0)}
        </div>
        <div className={styles.infoItem}>
          <strong>Hovered cell:</strong> ID
          {hoveredCellId.current}
          <span>
            {nearestCellIds.length
              ? ` | Highlighted ${nearestCellIds.length} nearest cells`
              : '-'}
          </span>
        </div>
        {hoveredSumRowIndex !== null && (
          <div className={styles.infoItem}>
            <strong>Percentage display:</strong> Row {hoveredSumRowIndex + 1}
            <span> | Heatmap active</span>
          </div>
        )}
      </div>
      <div className={styles.instructions}>
        <h4>Instructions:</h4>
        <ul>
          <li>Click on a cell to increase its value by 1</li>
          <li>Hover over a cell to see the nearest cells by value</li>
          <li>Hover over a row sum cell to see percentages and heatmap</li>
          <li>Click the "X" button to remove a row</li>
          <li>Click the "+ Add row" button to add a new row at the end of the table</li>
        </ul>
      </div>
    </div>
  );
};
