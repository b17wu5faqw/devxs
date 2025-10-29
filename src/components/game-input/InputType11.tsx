import React from "react";

interface BetGroups {
  group_name: string;
  options: BetOption[];
}

interface BetOption {
  id: number;
  bet_type_id: number;
  option_key: string;
  option_label: string;
  odds: number;
  order_index: number;
  rule_condition: string;
}

interface InputType11Props {
  options: BetGroups[];
  selected: Record<string, string>;
  setOdds?: (odds: number) => void;
  onSelect: (row: string, optionKey: string) => void;
}

const InputType11: React.FC<InputType11Props> = ({
  options,
  selected,
  setOdds,
  onSelect,
}) => {
  
  const handleSelect = (groupName: string, optionKey: string) => {
    const currentSelected = selected[groupName];
    if (currentSelected === optionKey) {
      onSelect(groupName, "REMOVE");
      return;
    }

    Object.keys(selected).forEach(key => {
      if (key !== groupName && selected[key]) {
        onSelect(key, "REMOVE");
      }
    });
    onSelect(groupName, optionKey);
  
    if (setOdds) {
      const group = options.find(group => group.group_name === groupName);
      if (group) {
        const option = group.options.find(opt => opt.option_key === optionKey);
        if (option) {
          setOdds(option.odds);
        }
      }
    }
  };

  return (
    <div className="bg-black text-white p-2">
      {options.map((row) => (
        <div key={row.group_name} className="grid grid-cols-7 gap-1 mb-2">
          <div className="col-span-1 flex items-center justify-center bg-gray-700 text-sm [writing-mode:vertical-lr]">
            {row.group_name}
          </div>
          <div className="col-span-6 grid grid-cols-2 gap-[1px]">
            {row.options?.map((opt) => {
              const active = selected[row.group_name] === opt.option_key;
              return (
                <button
                  key={`${row.group_name}-${opt.option_key}`}
                  onClick={() => handleSelect(row.group_name, opt.option_key)}
                  className={`relative p-2 text-[16px] flex justify-around items-center ${
                    active ? "bg-teal-500" : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  style={{
                    ...(opt.option_key === "HOA" && {
                      gridArea: "2 / 1 / 3 / 3",
                    }),
                  }}
                >
                  <span
                    className={`flex-1 text-[16px] text-left ${
                      opt.option_key === "HOA" ? "text-right" : "text-left"
                    }`}
                  >
                    {opt.option_label}
                    <span className="text-[12px]">{opt.rule_condition}</span>
                  </span>
                  <span
                    className={`text-yellow-400 text-sm flex-1 ${
                      opt.option_key === "HOA" ? "text-left" : "text-right"
                    }`}
                  >
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

export default InputType11;
