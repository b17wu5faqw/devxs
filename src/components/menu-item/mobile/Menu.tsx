import Img from "@/components/img/Img";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { Box, BoxProps } from "@mui/material";
import { useEffect, useState } from "react";

interface Props extends BoxProps {
  id: string;
  name: string;
  time: string;
  img: string;
  lottoType: number;
  onTimerZero?: () => void;
}

function Menu({ id, name, img, time, lottoType, onTimerZero, ...props }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(time));

  function calculateTimeLeft(target: string) {
    const targetDate = new Date(target);
    if (isNaN(targetDate.getTime())) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(time);
      setTimeLeft(calculateTimeLeft(time));

      if (
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
        onTimerZero?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onTimerZero]);

  const getColor = () => {
    if (
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds <= 10
    )
      return "red";
    return "rgb(20, 134, 71)";
  };

  return (
    <Box {...props}>
      <Flex
        sx={{
          gap: "20px",
          padding: "10px",
          backgroundColor: "#DDE8E2",
          marginBottom: "10px",
          borderRadius: "6px",
          height: "70px",
          alignItems: "center",
        }}
      >
        <Flex
          sx={{
            width: "40%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            url={`/images/main/${img}`}
            sx={{ width: lottoType == 1 ? "42px" : "58px", height: "42px" }}
          />
        </Flex>
        <Flex
          sx={{
            width: "58%",
            paddingLeft: "calc(6px + 5%)",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <CustomText
            sx={{ fontSize: "0.9em", fontWeight: "bold", color: "#000" }}
          >
            {name}
          </CustomText>
          <CustomText sx={{ cursor: "pointer", color: getColor() }}>
            {timeLeft.hours.toString().padStart(2, "0")}:
            {timeLeft.minutes.toString().padStart(2, "0")}:
            {timeLeft.seconds.toString().padStart(2, "0")}
          </CustomText>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Menu;
