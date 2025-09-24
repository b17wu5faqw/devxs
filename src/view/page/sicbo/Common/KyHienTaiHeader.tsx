import React from 'react';
import { Box } from "@mui/material";
import Flex from "@/components/utils/Flex";
import CustomText from "@/components/text/CustomText";
import { baseColors } from "@/utils/colors";

interface KyHienTaiHeaderProps {
    currentDrawNo?: string;
    timeLeft: {
        hours: number;
        minutes: number;
        seconds: number;
    };
    todayOpened?: number;
    todayRemaining?: number;
    todayTotal?: number;
    showSeconds?: boolean;
    width?: string;
}

export default function KyHienTaiHeader({
    currentDrawNo = "250608385",
    timeLeft,
    todayOpened = 385,
    todayRemaining = 177,
    todayTotal = 0,
    showSeconds = true,
    width = "800px"
}: KyHienTaiHeaderProps) {
    return (
        <Flex
            sx={{
                background: "#4984bf",
                paddingX: "12px",
                fontSize: "14px",
                color: baseColors.white,
                height: "35px",
                maxHeight: "35px",
                width: width,
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Flex sx={{ alignItems: "center", gap: "24px" }}>
                <Flex sx={{ alignItems: "center" }}>
                    Kỳ hiện tại
                    <CustomText sx={{ paddingX: "4px", color: baseColors.white }}>
                        :
                    </CustomText>
                    <span className="text-[#ece42f]">{currentDrawNo}</span>
                </Flex>
                
                <Flex sx={{ alignItems: "center", gap: "4px" }}>
                    Đếm ngược：
                    {showSeconds ? (
                        <>
                            <CustomText
                                sx={{
                                    background: "url(/images/common/bg_time.svg) no-repeat center",
                                    display: "block",
                                    backgroundSize: "100%",
                                    width: "40px",
                                    height: "28px",
                                    lineHeight: "28px",
                                    color: baseColors.black,
                                    textAlign: "center",
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                }}
                            >
                                {timeLeft.hours.toString().padStart(2, "0")}
                            </CustomText>
                            <CustomText
                                sx={{
                                    color: "#fff",
                                    textAlign: "center",
                                    width: "18px",
                                    height: "38px",
                                    fontWeight: "bold",
                                    fontSize: "24px",
                                }}
                            >
                                :
                            </CustomText>
                            <CustomText
                                sx={{
                                    background: "url(/images/common/bg_time.svg) no-repeat center",
                                    display: "block",
                                    backgroundSize: "100%",
                                    width: "40px",
                                    height: "28px",
                                    lineHeight: "28px",
                                    color: baseColors.black,
                                    textAlign: "center",
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                }}
                            >
                                {timeLeft.minutes.toString().padStart(2, "0")}
                            </CustomText>
                            <CustomText
                                sx={{
                                    color: "#fff",
                                    textAlign: "center",
                                    width: "18px",
                                    height: "38px",
                                    fontWeight: "bold",
                                    fontSize: "24px",
                                }}
                            >
                                :
                            </CustomText>
                            <CustomText
                                sx={{
                                    background: "url(/images/common/bg_time.svg) no-repeat center",
                                    display: "block",
                                    backgroundSize: "100%",
                                    width: "40px",
                                    height: "28px",
                                    lineHeight: "28px",
                                    color: baseColors.black,
                                    textAlign: "center",
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                }}
                            >
                                {timeLeft.seconds.toString().padStart(2, "0")}
                            </CustomText>
                        </>
                    ) : (
                        <CustomText sx={{ color: baseColors.white, fontSize: "14px" }}>
                            {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')}
                        </CustomText>
                    )}
                </Flex>
            </Flex>

            <Flex sx={{ alignItems: "center", gap: "10px" }}>
                <Flex
                    sx={{
                        background: "#4984bf",
                        fontSize: "14px",
                        color: baseColors.white,
                        width: "fit-content",
                        alignItems: "center",
                    }}
                >
                    Hôm nay đã mở
                    <span className="text-[#ece42f] mx-1">{todayOpened}</span>kỳ,
                    còn lại
                    <span className="text-[#ece42f] mx-1">{todayRemaining}</span>kỳ
                </Flex>
            </Flex>
        </Flex>
    );
}