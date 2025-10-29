import InputType1 from "@/components/game-input/InputType1";
import InputType2 from "@/components/game-input/InputType2";
import InputType4 from "@/components/game-input/InputType4";
import InputType5 from "@/components/game-input/InputType5";

export default function BetTypeInput({ subType, ...props }: any) {
  if (!subType) return null;

  switch (subType.input_type) {
    case 1:
      return <InputType1 {...props} />;
    case 2:
      return <InputType2 {...props} />;
    case 4:
      return <InputType4 {...props} />;
    case 5:
      return <InputType5 {...props} />;
    default:
      return <div className="text-white">Chưa hỗ trợ input_type {subType.input_type}</div>;
  }
}