import { useState, useEffect, useMemo, useCallback } from 'react';

import { Cell, CellValue, MatrixData } from '@/common/types';

export const useMatrix = (m: number, n: number, x: number) => {
  const [matrixData, setMatrixData] = useState<MatrixData>({
    matrix: [],
    rowSums: [],
    columnPercentiles: [],
  });

  const [hoveredCellId, setHoveredCellId] = useState<number | null>(null);
  const [nearestCellIds, setNearestCellIds] = useState<number[]>([]);
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
    [recalculateData, hoveredSumRowIndex, hoveredCellId],
  );

  const findNearestCells = useCallback(
    (targetCellId: number, targetValue: number) => {
      if (x === 0) return [];

      const allCells: Array<{ id: number; amount: number; distance: number }> = [];

      matrixData.matrix.forEach((row) => {
        row.forEach((cell) => {
          if (cell.id !== targetCellId) {
            allCells.push({
              id: cell.id,
              amount: cell.amount,
              distance: Math.abs(cell.amount - targetValue),
            });
          }
        });
      });

      allCells.sort((a, b) => {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
        return a.amount - b.amount;
      });

      return allCells.slice(0, x).map((cell) => cell.id);
    },
    [matrixData.matrix, x],
  );

  const handleCellHover = useCallback(
    (cellId: number | null) => {
      setHoveredCellId(cellId);
      setHoveredSumRowIndex(null);

      if (cellId === null) {
        setNearestCellIds([]);
        return;
      }

      let targetCell: Cell | null = null;
      for (const row of matrixData.matrix) {
        const cell = row.find((c) => c.id === cellId);
        if (cell) {
          targetCell = cell;
          break;
        }
      }

      if (targetCell) {
        const nearest = findNearestCells(cellId, targetCell.amount);
        setNearestCellIds(nearest);
      }
    },
    [matrixData.matrix, findNearestCells],
  );

  const handleSumCellHover = useCallback((rowIndex: number | null) => {
    setHoveredSumRowIndex(rowIndex);
    setHoveredCellId(null);
    setNearestCellIds([]);
  }, []);

  useEffect(() => {
    setMatrixData(generateMatrix);
    setHoveredCellId(null);
    setNearestCellIds([]);
    setHoveredSumRowIndex(null);
  }, [generateMatrix]);

  return {
    matrixData,
    hasData: m > 0 && n > 0,
    hoveredCellId,
    nearestCellIds,
    hoveredSumRowIndex,
    incrementCellValue,
    removeRow,
    handleCellHover,
    handleSumCellHover,
  };
};
