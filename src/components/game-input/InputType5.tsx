type RowKey = "C.Ngan" | "Ngan" | "Tram" | "Chuc" | "Donvi";

interface InputType5Props {
  selectedArrNumbers: Record<RowKey, number[]>;
  onToggleNumber: (row: RowKey, num: number) => void;
}

const InputType5: React.FC<InputType5Props> = ({ 
  selectedArrNumbers, 
  onToggleNumber 
}) => {
  const rows: { key: RowKey; label: string }[] = [
    { key: "C.Ngan", label: "C.ngàn" },
    { key: "Ngan", label: "Ngàn" },
    { key: "Tram", label: "Trăm" },
    { key: "Chuc", label: "Chục" },
    { key: "Donvi", label: "Đơn vị" },
  ];

  return (
    <div className="bg-gray-900 text-white px-2 rounded-md max-w-md mx-auto">
      {rows.map((row) => (
        <div key={row.key} className="mb-1">
          <div className="grid grid-cols-6 gap-1 items-center mb-1">
            <div className="row-span-2 flex items-center justify-center bg-gray-700 px-2 py-4 h-full [writing-mode:vertical-lr]">
              {row.label}
            </div>

            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                onClick={() => onToggleNumber(row.key, i)}
                className={`p-1 text-bold text-[18px] ${
                  selectedArrNumbers[row.key].includes(i)
                    ? "bg-teal-500"
                    : "bg-gray-600"
                }`}
              >
                {i}
              </button>
            ))}

            {Array.from({ length: 5 }, (_, i) => i + 5).map((num) => (
              <button
                key={num}
                onClick={() => onToggleNumber(row.key, num)}
                className={`p-1 text-bold text-[18px] ${
                  selectedArrNumbers[row.key].includes(num)
                    ? "bg-teal-500"
                    : "bg-gray-600"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InputType5;