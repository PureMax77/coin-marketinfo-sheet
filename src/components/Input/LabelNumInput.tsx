import React from "react";

interface LabelNumInputProps {
  title: string;
  step: number;
  min?: number;
  max?: number;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LabelNumInput: React.FC<LabelNumInputProps> = ({
  title,
  step,
  min,
  max,
  value,
  onChange,
}) => {
  return (
    <>
      <label className="text-lg ml-5">{title} : </label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="w-24 px-2 py-1 mt-5 border rounded-lg"
      />
    </>
  );
};

export default LabelNumInput;
