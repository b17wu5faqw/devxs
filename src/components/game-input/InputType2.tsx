interface InputType2Props {
  selected: number[];
  hundred: number;
  onToggleNumber: (num: number) => void;
  onSetHundred: (h: number) => void;
}

const InputType2: React.FC<InputType2Props> = ({ 
  selected, 
  hundred, 
  onToggleNumber, 
  onSetHundred 
}) => {
  const numberArr = Array.from({ length: 100 }, (_, i) => hundred * 100 + i);

  const countByHundred = (h: number) =>
    selected.filter((n) => Math.floor(n / 100) === h).length;

  return (
    <div className="max-w-md mx-auto py-2 bg-gray-900 text-white rounded-lg shadow-lg overflow-y-auto">
      <div className="text-center mb-2 font-bold">Trăm</div>
      <div className="grid grid-cols-5 gap-1 px-3 mb-3">
        {Array.from({ length: 10 }, (_, i) => i).map((i) => {
          const count = countByHundred(i);
          return (
            <button
              key={i}
              onClick={() => onSetHundred(i)}
              className={`relative p-1 rounded ${
                hundred === i ? "bg-teal-500" : "bg-[#ffffff4d]"
              }`}
            >
              {i}
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <hr />

      <div className="grid grid-cols-5 gap-[2px] max-h-[25rem] pt-3">
        {numberArr.map((num) => {
          const strNum = num.toString().padStart(3, "0");
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

export default InputType2;