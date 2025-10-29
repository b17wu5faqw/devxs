interface InputType4Props {
  selected: number[];
  onToggleNumber: (num: number) => void;
}

const InputType4: React.FC<InputType4Props> = ({ selected, onToggleNumber }) => {
  const number100Arr = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div className="max-w-md mx-auto py-2 bg-gray-900 text-white shadow-lg overflow-y-auto">
      <hr />
      <div className="grid grid-cols-5 gap-[2px] max-h-[25rem] pt-3">
        {number100Arr.map((num) => {
          const strNum = num.toString().padStart(2, "0");
          const isSelected = selected.includes(num);
          return (
            <button
              key={num}
              onClick={() => onToggleNumber(num)}
              className={`p-1 ${
                isSelected ? "bg-teal-500" : "bg-gray-700"
              }`}
            >
              {strNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InputType4;