import React from "react";

interface InputType6Props {
  selected: number[];
  onToggleNumber: (num: number) => void;
}

const InputType6: React.FC<InputType6Props> = ({ selected, onToggleNumber }) => {
  return (
    <div className="grid grid-cols-6 gap-[2px] items-center">
      {/* Label dọc */}
      <div className="row-span-2 flex items-center justify-center bg-[#565656] px-2 py-2 text-sm text-white h-full text-center">
        Số đơn
      </div>

      {/* Số 0–4 */}
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          onClick={() => onToggleNumber(i)}
          className={`p-2 text-white text-center text-[20px] text-bold ${
            selected.includes(i) ? "bg-[#e5464699]" : "bg-[#565656]"
          }`}
        >
          {i}
        </button>
      ))}

      {/* Số 5–9 */}
      {Array.from({ length: 5 }, (_, i) => i + 5).map((num) => (
        <button
          key={num}
          onClick={() => onToggleNumber(num)}
          className={`p-2 text-white text-center text-[20px] text-bold ${
            selected.includes(num) ? "bg-[#e5464699]" : "bg-[#565656]"
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default InputType6;