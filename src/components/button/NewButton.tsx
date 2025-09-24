import React from "react";
import { SxProps, Theme } from "@mui/material/styles";
import { Button } from "@mui/material";
import { montserrat } from "@/utils/fontG";
import { baseColors } from "@/utils/colors";
import useDetect from "@/hooks/useDetect";

type TextProps = React.ComponentPropsWithRef<typeof Button> & {
  sx?: SxProps<Theme>;

  color?: React.CSSProperties["color"];
};

const NewButton: React.FC<TextProps> = ({ children, sx, ...props }) => {
  const { isMobile } = useDetect();
  return (
    <>
      <div className="flex justify-center">
        <button
          {...props}
          className="bg-button-gradient h-[46px] text-white font-semibold text-base uppercase w-full rounded-lg flex items-center justify-center"
        >
          {children}
        </button>
      </div>
    </>
  );
};

export default NewButton;
