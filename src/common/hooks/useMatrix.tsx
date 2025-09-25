import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import styles from '@/common/components/MatrixTable/MatrixTable.module.scss';
import { Cell, CellValue, MatrixData, CellWithDistance } from '@/common/types';
import { MinHeap } from '@/common/utils';

export const useMatrix = (m: number, n: number, x: number) => {
  const [matrixData, setMatrixData] = useState<MatrixData>({
    matrix: [],
    rowSums: [],
    columnPercentiles: [],
  });

  const nearestCellIdsRef = useRef<number[]>([]);
  const tableCellsRef = useRef<Map<number, HTMLTableCellElement>>(new Map());
  const [hoveredSumRowIndex, setHoveredSumRowIndex] = useState<number | null>(null);

  const generateRandomAmount = (): CellValue => {
    return Math.floor(Math.random() * 900) + 100;
  };

  const calculatePercentile = (values: number[], percentile: number): number => {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);

    if (Number.isInteger(index)) {
      return sorted[index];
    }

    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  const recalculateData = useCallback(
    (matrix: Cell[][]) => {
      const rowSums = matrix.map((row) =>
        row.reduce((sum, cell) => sum + cell.amount, 0),
      );

      const columnPercentiles = Array.from({ length: n }, (_, col) =>
        calculatePercentile(
          matrix.map((row) => row[col].amount),
          60,
        ),
      );

      return {
        matrix,
        rowSums,
        columnPercentiles,
      };
    },
    [n],
  );

  const generateMatrix = useMemo(() => {
    if (m === 0 || n === 0) {
      return {
        matrix: [],
        rowSums: [],
        columnPercentiles: [],
      };
    }

    let idCounter = 1;

    const newMatrix: Cell[][] = Array.from({ length: m }, () =>
      Array.from({ length: n }, () => ({
        id: idCounter++,
        amount: generateRandomAmount(),
      })),
    );

    return recalculateData(newMatrix);
  }, [m, n, recalculateData]);

  const incrementCellValue = useCallback(
    (cellId: number) => {
      setMatrixData((prevData) => {
        const newMatrix = prevData.matrix.map((row) =>
          row.map((cell) =>
            cell.id === cellId ? { ...cell, amount: cell.amount + 1 } : cell,
          ),
        );

        return recalculateData(newMatrix);
      });
    },
    [recalculateData],
  );

  const removeRow = useCallback(
    (rowIndex: number) => {
      setMatrixData((prevData) => {
        const newMatrix = prevData.matrix.filter((_, index) => index !== rowIndex);

        return recalculateData(newMatrix);
      });
    },
    [recalculateData, hoveredSumRowIndex],
  );

  const addRow = useCallback(() => {
    setMatrixData((prevData) => {
      let maxId = 0;
      prevData.matrix.forEach((row) => {
        row.forEach((cell) => {
          if (cell.id > maxId) {
            maxId = cell.id;
          }
        });
      });

      const newRow: Cell[] = Array.from({ length: n }, () => ({
        id: ++maxId,
        amount: generateRandomAmount(),
      }));

      const newMatrix = [...prevData.matrix, newRow];

      return recalculateData(newMatrix);
    });
  }, [n, recalculateData]);

  const findNearestCells = useCallback(
    (targetCellId: number, targetValue: number): number[] => {
      if (x === 0) return [];

      const maxHeap = new MinHeap<CellWithDistance>((a, b) => {
        if (b.distance !== a.distance) {
          return b.distance - a.distance;
        }
        return b.amount - a.amount;
      });

      for (const row of matrixData.matrix) {
        for (const cell of row) {
          if (cell.id === targetCellId) continue;

          const distance = Math.abs(cell.amount - targetValue);
          const cellData: CellWithDistance = {
            id: cell.id,
            amount: cell.amount,
            distance,
          };

          if (maxHeap.size() < x) {
            maxHeap.push(cellData);
          } else {
            const topElement = maxHeap.peek();
            if (
              topElement &&
              (distance < topElement.distance ||
                (distance === topElement.distance && cell.amount < topElement.amount))
            ) {
              maxHeap.pop();
              maxHeap.push(cellData);
            }
          }
        }
      }

      const result: Cell[] = [];
      while (maxHeap.size() > 0) {
        const element = maxHeap.pop();
        if (element) result.unshift(element);
      }

      return result.map((cell) => cell.id);
    },
    [matrixData.matrix, x],
  );

  const handleCellHover = useCallback(
    (cell: Cell) => {
      const nearest = findNearestCells(cell.id, cell.amount);
      nearestCellIdsRef.current = nearest;

      nearest.forEach((id) => {
        tableCellsRef.current.get(id)?.classList.add(styles.cellNearest);
      });
    },
    [findNearestCells],
  );

  const handleSumCellHover = useCallback((rowIndex: number | null) => {
    setHoveredSumRowIndex(rowIndex);
    nearestCellIdsRef.current = [];
  }, []);

  const handleCellLeave = () => {
    nearestCellIdsRef.current = [];
    tableCellsRef.current.forEach((cell) => {
      cell.classList.remove(styles.cellNearest);
    });
  };

  useEffect(() => {
    setMatrixData(generateMatrix);
    nearestCellIdsRef.current = [];
    setHoveredSumRowIndex(null);
  }, [generateMatrix]);

  return {
    matrixData,
    hasData: m > 0 && n > 0,
    nearestCellIds: nearestCellIdsRef.current,
    hoveredSumRowIndex,
    incrementCellValue,
    removeRow,
    addRow,
    handleCellHover,
    handleCellLeave,
    handleSumCellHover,
    tableCellsRef,
  };
};
