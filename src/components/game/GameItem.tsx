import { Box, BoxProps } from "@mui/material";
import Flex from "../utils/Flex";
import CustomText from "../text/CustomText";

interface Props extends BoxProps {
  img: string;
  name: string;
  live: boolean;
  flag: boolean;
  flagIcon: string;
  round: boolean;
  roundWidth: string;
  roundHeight: string;
  roundPosition: string;
}

function GameItem({
  img,
  name,
  live,
  flag,
  flagIcon,
  round,
  roundWidth,
  roundHeight,
  roundPosition,
  ...props
}: Props) {
  return (
    <Box
      {...props}
      sx={{
        padding: "16px 0px 12px",
        width: "31%",
        backgroundColor: "#292929",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      {live && (
        <Box
          sx={{
            position: "absolute",
            top: "-3px",
            right: "-5px",
            background: "url(/images/main/icon_liveHint.png) no-repeat 0 40%",
            backgroundSize: "100%",
            height: "14px",
            width: "40px",
            borderRadius: "4px",
          }}
        />
      )}
      {flag && (
        <Box
          sx={{
            position: "absolute",
            top: "3%",
            right: "3%",
            background: `url(${flagIcon}) no-repeat 0 40%`,
            backgroundSize: "100%",
            height: "16px",
            width: "16px",
            borderRadius: "4px",
          }}
        />
      )}
      <Flex
        sx={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ position: "relative", marginBottom: "3px" }}>
          <Box
            sx={{
              width: "55px",
              paddingTop: "55px",
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              height: "0",
              position: "relative",
              margin: "0 auto",
              opacity: round ? "1" : "0",
            }}
          />
          <Box
            sx={{
              background: `url(${img}) no-repeat`,
              backgroundPosition: roundPosition,
              position: "absolute",
              left: "-30%",
              right: "-30%",
              top: 0,
              bottom: 0,
              margin: "auto",
              backgroundSize: "100% auto",
              maxWidth: "104px",
              width: roundWidth,
              height: roundHeight,
            }}
          />
        </Box>
        <CustomText sx={{ color: "#fff", fontWeight: "600" }}>
          {name}
        </CustomText>
      </Flex>
    </Box>
  );
}

export default GameItem;
