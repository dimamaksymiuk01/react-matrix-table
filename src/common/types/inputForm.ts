export type HandleInputChangeParams = {
  value: string;
  setter: (value: number) => void;
};

export type InputFormProps = {
  onMatrixSizeChange: (m: number, n: number) => void;
};
