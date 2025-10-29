import React from "react";

interface BetOption {
  id: number;
  bet_type_id: number;
  option_key: string;
  option_label: string;
  odds: number;
  order_index: number;
  rule_condition: string;
}

interface InputType10Props {
  options: BetOption[];
  selected: Record<string, string>;
  onSelect: (row: string, optionKey: string) => void;
}

const InputType10: React.FC<InputType10Props> = ({ options, selected, onSelect }) => {
  const ROW_LABELS = ["C.ngàn", "Ngàn", "Trăm", "Chục", "Đơn vị"];

  return (
    <div className="bg-black text-white p-2">
      {ROW_LABELS.map((row) => (
        <div key={row} className="grid grid-cols-7 gap-1 mb-2">
          <div className="col-span-1 flex items-center justify-center bg-gray-700 text-sm [writing-mode:vertical-lr]">
            {row}
          </div>
          <div className="col-span-6 grid grid-cols-2 gap-[1px]">
            {options?.map((opt) => {
              const active = selected[row] === opt.option_key;
              return (
                <button
                  key={`${row}-${opt.option_key}`}
                  onClick={() => onSelect(row, opt.option_key)}
                  className={`relative p-1 text-[16px] flex justify-around items-center ${
                    active ? "bg-teal-500" : "bg-gray-600 hover:bg-gray-500"
                  }`}
                >
                  <span>{opt.option_label}</span>
                  <span className="text-yellow-400 text-sm">
                    {opt.odds}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InputType10;