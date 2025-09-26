export const toNumber = (value: string) =>
  value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);
