// Tạo file mới hoặc thêm vào cuối file index.tsx
interface InputType7Props {
  selectedType7: {
    trungNhi: number[];
    soDon: number[];
  };
  onToggleNumber: (group: "trungNhi" | "soDon", num: number) => void;
}

const InputType7: React.FC<InputType7Props> = ({
  selectedType7,
  onToggleNumber,
}) => {
  return (
    <div className="bg-gray-900 text-white px-2 rounded-md max-w-md mx-auto">
      <div className="mb-3">
        <div className="grid grid-cols-7 gap-0 mb-2">
          <div className="col-span-1 flex items-center justify-center bg-[#3b3b3b] text-sm [writing-mode:vertical-lr]">
            Trùng nhị
          </div>
          <div className="col-span-6 grid grid-cols-5 gap-[1px]">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={`trungNhi-${i}`}
                onClick={() => onToggleNumber("trungNhi", i)}
                className={`p-2 text-white text-center text-lg font-bold ${
                  selectedType7.trungNhi.includes(i)
                    ? "bg-[#e5464699]"
                    : "bg-[#565656]"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="grid grid-cols-7 gap-0 mb-2">
          <div className="col-span-1 flex items-center justify-center bg-[#3b3b3b] text-sm [writing-mode:vertical-lr]">
            Số đơn
          </div>
          <div className="col-span-6 grid grid-cols-5 gap-[1px]">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={`soDon-${i}`}
                onClick={() => onToggleNumber("soDon", i)}
                className={`p-3 text-white text-center text-lg font-bold ${
                  selectedType7.soDon.includes(i)
                    ? "bg-[#e5464699]"
                    : "bg-[#565656]"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputType7;
