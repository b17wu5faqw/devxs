"use client";
import { useState } from "react";
import Img from "@/components/img/Img";

type HuongDanSectionProps = {
  guide?: string;
  hotNumbersDesc?: string;
  exampleDesc?: string;
  helpDesc?: string;
}

const HuongDanSection = ({
  guide = "",
  hotNumbersDesc,
  exampleDesc,
  helpDesc
}: HuongDanSectionProps) => {
  const [isVisibleExample, setIsVisibleExample] = useState(false);
  const [isVisibleDescription, setIsVisibleDescription] = useState(false);

  const formatContent = (content: string) => {
    if (!content) return "";
    // Replace <br> and <br/> tags with actual line breaks for HTML rendering
    return content.replace(/<br\s*\/?>/gi, "<br/>");
  };

  return (
    <div className="flex justify-between items-center py-2.5 px-0 pl-2.5">
      <div className="text-[#106eb6] leading-[19px] text-xs">
        Hướng dẫn：{guide}
      </div>
      <div className="flex">
        {hotNumbersDesc && (
          <div className="flex cursor-pointer gap-1 pr-3 items-center underline">
            <Img url="/images/lotto/icon_Gstar.png" sx={{}} />
            <div className="text-xs">Số nóng</div>
          </div>
        )}
        {exampleDesc && (
          <div
            onMouseEnter={() => setIsVisibleExample(true)}
            onMouseLeave={() => setIsVisibleExample(false)}
            className="flex cursor-pointer gap-1 pr-3 items-center underline relative"
          >
            <Img url="/images/lotto/icon_cnATHint.png" sx={{}} />
            <div className="text-xs">Ví dụ</div>
            {isVisibleExample && (
              <div className="absolute top-5 right-0 bg-[#ffffcd] p-2.5 border border-[#b3b3b3] w-[280px] max-w-[370px] text-sm z-[99]">
                <div dangerouslySetInnerHTML={{ __html: formatContent(exampleDesc) }} />
              </div>
            )}
          </div>
        )}
        {helpDesc && (
          <div
            onMouseEnter={() => setIsVisibleDescription(true)}
            onMouseLeave={() => setIsVisibleDescription(false)}
            className="flex cursor-pointer gap-1 pr-3 items-center underline relative"
          >
            <Img url="/images/lotto/icon_ay2Hint.png" sx={{}} />
            <div className="text-xs">
              Trợ giúp
            </div>
            {isVisibleDescription && (
              <div className="absolute top-5 right-0 bg-[#ffffcd] p-2.5 border border-[#b3b3b3] w-[300px] max-w-[370px] text-sm z-[99]">
                <div dangerouslySetInnerHTML={{ __html: formatContent(helpDesc) }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HuongDanSection; 