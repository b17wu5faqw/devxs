import React from "react";
import { Box, BoxProps } from "@mui/material";
import Flex from "@/components/utils/Flex";
import { baseColors } from "@/utils/colors";
import CustomText from "@/components/text/CustomText";
import Img from "@/components/img/Img";

interface Props extends BoxProps {
  name: string;
  active: boolean;
}

function TitleHead({ name, active, ...props }: Props) {
  return (
    <Box {...props}>
      <Flex
        sx={{
          background: baseColors.bgGray,
          borderTop: "1px solid #f5f5f5",
          borderBottom: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        <Flex
          sx={{
            background: baseColors.bgBlue,
            borderTop: "1px solid #92c2f4",
            height: "35px",
            lineHeight: "35px",
            fontSize: "13px",
            fontWeight: "600",
            width: "100%",
            justifyContent: "start",
          }}
        >
          <Flex
            sx={{
              background: active
                ? "url(/images/main/icon_mainarrowUp.svg) no-repeat center"
                : "url(/images/main/icon_mainarrow.svg) no-repeat center",
              backgroundSize: "20px auto",
              width: "50px",
              height: "33px",
            }}
          />
          <CustomText sx={{ color: baseColors.white, fontWeight: "700" }}>
            {name}
          </CustomText>
        </Flex>
      </Flex>
    </Box>
  );
}

export default TitleHead;
