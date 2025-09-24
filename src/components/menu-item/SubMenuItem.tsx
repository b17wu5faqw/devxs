"use client";
import { Box, BoxProps } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/utils/Flex";
import { baseColors } from "@/utils/colors";
import CustomText from "@/components/text/CustomText";
import { useMenuStore } from "@/stores/useMenuStore";
import { getHotMenu } from "@/apis/menu";
import { useRouter } from "next/navigation";

interface Props extends BoxProps {
  id: string;
  name: string;
  time: string;
  active: boolean;
  regionId: number;
  lottoType: number;
  onTimeExpired: () => void;
}

function SubMenuItem({
  id,
  name,
  time,
  active,
  regionId,
  lottoType,
  onTimeExpired,
  ...props
}: Props) {
  const router = useRouter();
  const { setScheduleId, setTypeId, setActiveSubMenu } = useMenuStore();
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(time));

  function calculateTimeLeft(target: string) {
    const targetDate = new Date(target);

    // Check if the date is valid
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
        onTimeExpired?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onTimeExpired]);

  const selectMenu = (scheduleId: number) => {
    setScheduleId(scheduleId);
    setTypeId(lottoType);
    // if (lottoType == 2) {
    //   router.push(`/game/VnLottoElec/${id}`);
    // } else {
    //   setScheduleId(scheduleId);
    //   setTypeId(lottoType);
    // }
  };

  const getColor = (active: boolean) => {
    if (
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds <= 10
    )
      return "red";
    if (active) return "#007fff";
    return "#888";
  };

  return (
    <Box {...props}>
      <Flex
        sx={{
          background: baseColors.white,
          borderBottom: "1px solid #e5e5e5",
          color: baseColors.black1,
          justifyContent: "between",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": {
            background: baseColors.yellow,
          },
        }}
        className={active ? "active" : ""}
        onClick={() => {
          setActiveSubMenu(Number(id));
          selectMenu(Number(id));
        }}
      >
        <CustomText
          fw="600"
          sx={{
            position: "relative",
            display: "block",
            float: "left",
            textAlign: "center",
            width: "50px",
            height: "28px",
            color: "rgba(0,0,0,0)",
            background: active
              ? "url(/images/main/icon_checkR.svg)no-repeat center"
              : "transparent",
            backgroundSize: "30%",
          }}
        >
          .
        </CustomText>
        <CustomText
          sx={{
            flex: "1",
            fontSize: "13px",
            color: active ? "#007fff" : "#555",
          }}
        >
          {name}
        </CustomText>
        <CustomText
          sx={{
            fontSize: "12px",
            float: "right",
            marginRight: "10px",
            lineHeight: "27px",
            cursor: "pointer",
            color: getColor(active),
          }}
        >
          {timeLeft.hours.toString().padStart(2, "0")}:
          {timeLeft.minutes.toString().padStart(2, "0")}:
          {timeLeft.seconds.toString().padStart(2, "0")}
        </CustomText>
      </Flex>
    </Box>
  );
}

export default SubMenuItem;
