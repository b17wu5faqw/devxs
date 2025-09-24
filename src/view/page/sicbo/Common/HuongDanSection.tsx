"use client";
import { useState } from "react";
import { Box } from "@mui/material";
import Flex from "@/components/utils/Flex";
import CustomText from "@/components/text/CustomText";
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
    <Flex
      sx={{
        justifyContent: "space-between",
        padding: "10px 0 10px 10px",
        alignItems: "center",
      }}
    >
      <CustomText
        sx={{
          color: "#106eb6",
          lineHeight: "19px",
          fontSize: "12px",
        }}
      >
        Hướng dẫn：{guide}
      </CustomText>
      <Flex>
        {hotNumbersDesc && (
          <Flex
            sx={{
              cursor: "pointer",
              gap: "4px",
              paddingRight: "12px",
              alignItems: "center",
              textDecorationLine: "underline",
            }}
          >
            <Img url="/images/lotto/icon_Gstar.png" sx={{}} />
            <CustomText sx={{ fontSize: "12px" }}>Số nóng</CustomText>
          </Flex>
        )}
        {exampleDesc && (
          <Flex
            onMouseEnter={() => setIsVisibleExample(true)}
            onMouseLeave={() => setIsVisibleExample(false)}
            sx={{
              cursor: "pointer",
              gap: "4px",
              paddingRight: "12px",
              alignItems: "center",
              textDecorationLine: "underline",
              position: "relative",
            }}
          >
            <Img url="/images/lotto/icon_cnATHint.png" sx={{}} />
            <CustomText sx={{ fontSize: "12px" }}>Ví dụ</CustomText>
            {isVisibleExample && (
              <Box
                sx={{
                  position: "absolute",
                  top: "20px",
                  right: "0",
                  backgroundColor: "#ffffcd",
                  padding: "10px",
                  border: "1px solid #b3b3b3",
                  width: "280px",
                  maxWidth: "370px",
                  fontSize: "14px",
                  zIndex: 99,
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: formatContent(exampleDesc) }} />
              </Box>
            )}
          </Flex>
        )}
        {helpDesc && (
          <Flex
            onMouseEnter={() => setIsVisibleDescription(true)}
            onMouseLeave={() => setIsVisibleDescription(false)}
            sx={{
              cursor: "pointer",
              gap: "4px",
              paddingRight: "12px",
              alignItems: "center",
              textDecorationLine: "underline",
              position: "relative",
            }}
          >
            <Img url="/images/lotto/icon_ay2Hint.png" sx={{}} />
            <CustomText sx={{ fontSize: "12px" }}>
              Trợ giúp
            </CustomText>
            {isVisibleDescription && (
              <Box
                sx={{
                  position: "absolute",
                  top: "20px",
                  right: "0",
                  backgroundColor: "#ffffcd",
                  padding: "10px",
                  border: "1px solid #b3b3b3",
                  width: "300px",
                  maxWidth: "370px",
                  fontSize: "14px",
                  zIndex: 99,
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: formatContent(helpDesc) }} />
              </Box>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default HuongDanSection; 