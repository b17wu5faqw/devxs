"use client"

import React, { useState, useEffect, useMemo, useRef } from "react";
import KyHienTaiHeader from "@/view/page/sicbo/Common/KyHienTaiHeader";
import CustomText from "@/components/text/CustomText";
import PopupInfoMobile from "@/components/modal/PopupInfoMobile";
import PopupSuccess from "@/components/modal/PopupSuccess";
import PopupSuccessQuota from "@/components/modal/PopupSuccessQuota";
import PopupError from "@/components/modal/PopupError";
import LoXien from "@/components/game-input/LoXien";
import LoTruot from "@/components/game-input/LoTruot";
import Flex from "@/components/utils/Flex";
import { Box } from "@mui/material";
import { baseColors } from "@/utils/colors";
import { useCurrentDraw, useListLastDraw, useBetTypes, useInvalidateSicboQueries, SicboCurrentDraw, SicboLastDraw, SicboBetType } from "@/hooks/useSicbo";
import HuongDanSection from "./Common/HuongDanSection";

type SubType = {
    id: number;
    name: string;
    rate: string;
    price_rate: string;
    prize_rate: string;
    title: string;
    help: string;
    description: string;
    example: string;
    max_bet: number;
    max_number: number;
};

export interface DrawType {
    id?: number;
    draw_no?: string;
    end_time?: string;
    name?: string;
}

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
}

const renderDiceImages = (optionCode: string) => {
    const images: JSX.Element[] = [];
    const diceImgPath = "https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/";

    const createDice = (type: 'W' | 'R', count: number, keyPrefix: string) => {
        for (let i = 0; i < count; i++) {
            images.push(
                <img
                    key={`${keyPrefix}-${i}`}
                    src={`${diceImgPath}img_dice${type}.svg`}
                    className="block relative w-[34px] h-[33px] mt-[6px] mr-[2px] ml-[2px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer"
                    alt={`dice ${type}`}
                />
            );
        }
    };

    switch (optionCode) {
        case "ODDS_04":
            createDice('W', 4, '04');
            break;
        case "ODDS_13":
            createDice('W', 3, '13W');
            createDice('R', 1, '13R');
            break;
        case "ODDS_22":
            createDice('W', 2, '22W');
            createDice('R', 2, '22R');
            break;
        case "ODDS_40":
            createDice('R', 4, '40');
            break;
        case "ODDS_31":
            createDice('R', 3, '31R');
            createDice('W', 1, '31W');
            break;
        case "ODDS_44":
            // Replicating the 9 images from original HTML for ODDS_44, despite 4-dice game context
            images.push(
                <img key="44R1" src={`${diceImgPath}img_diceR.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="red dice" />,
                <img key="44R2" src={`${diceImgPath}img_diceR.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="red dice" />,
                <img key="44R3" src={`${diceImgPath}img_diceR.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="red dice" />,
                <img key="44R4" src={`${diceImgPath}img_diceR.svg`} className="block relative w-5 h-[19px] mt-3 mr-[5px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="red dice" />,
                <img key="44W1" src={`${diceImgPath}img_diceW.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="white dice" />,
                <img key="44W2" src={`${diceImgPath}img_diceW.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="white dice" />,
                <img key="44W3" src={`${diceImgPath}img_diceW.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="white dice" />,
                <img key="44W4" src={`${diceImgPath}img_diceW.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="white dice" />
            );
            break;
        default:
            break;
    }
    return images;
};

function XocDiaKUContent() {
    const {
        data: currentDrawData,
        isLoading: isCurrentDrawLoading,
        error: currentDrawError
    } = useCurrentDraw();

    const {
        data: lastDrawsData,
        isLoading: isLastDrawsLoading,
        error: lastDrawsError
    } = useListLastDraw();

    const {
        data: betTypesData,
        isLoading: isBetTypesLoading,
        error: betTypesError
    } = useBetTypes();

    const { invalidateAllSicboQueries } = useInvalidateSicboQueries();
    console.log('betTypesData', betTypesData)
    const [selectedChoice, setSelectedChoice] = useState<string>("");
    const [betChip, setBetChip] = useState<number>(0);
    const [totalChip, setTotalChip] = useState<number>(0);
    const [totalPrize, setTotalPrize] = useState<number>(0);
    const [duplicates, setDuplicates] = useState<any[]>([]);
    const [message, setMessage] = useState<string>("");

    const [currentDraw, setCurrentDraw] = useState<DrawType>({
        id: 1,
        draw_no: "XD250608385",
        end_time: "2024-12-31T23:59:59",
        name: "Xóc Đĩa KU"
    });

    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        if (currentDrawData && !isCurrentDrawLoading) {
            const drawData = currentDrawData.data || currentDrawData;

            setCurrentDraw({
                id: drawData.id,
                draw_no: drawData.draw_no,
                end_time: drawData.end_time,
                name: "Xóc Đĩa KU"
            });
        }
    }, [currentDrawData, isCurrentDrawLoading]);

    useEffect(() => {
        if (videoRef.current && videoLoaded) {
            const timer = setTimeout(() => {
                if (videoRef.current) {
                    const playPromise = videoRef.current.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error("Video play failed:", error);
                        });
                    }
                }
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [videoLoaded]);

    const handleVideoLoad = () => {
        setVideoLoaded(true);
    };
    
    const handleVideoEnded = () => {
        // Pause the video when it ends
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const recentDraws = useMemo(() => {
        if (lastDrawsData && !isLastDrawsLoading) {
            if (Array.isArray(lastDrawsData)) {
                return lastDrawsData.slice(0, 7);
            } else if (lastDrawsData.data && Array.isArray(lastDrawsData.data)) {
                return lastDrawsData.data.slice(0, 7);
            }
        }
        return [];
    }, [lastDrawsData, isLastDrawsLoading]);

    const subType: SubType = useMemo(() => {
        const betTypesArray = Array.isArray(betTypesData)
            ? betTypesData
            : (betTypesData?.data && Array.isArray(betTypesData.data))
                ? betTypesData.data
                : null;

        if (betTypesArray && betTypesArray.length > 0) {
            const sicboBetType = betTypesArray[0];
            return {
                id: sicboBetType.id,
                name: sicboBetType.name || "Xóc Đĩa KU",
                rate: sicboBetType.odds?.toString() || "2.8",
                price_rate: sicboBetType.odds?.toString() || "2.8",
                prize_rate: sicboBetType.odds?.toString() || "2.8",
                title: sicboBetType.name || "Xóc Đĩa KU",
                help: sicboBetType.description || "Dự đoán kết quả xóc đĩa",
                description: sicboBetType.description || "Game xóc đĩa truyền thống",
                example: "Chọn Chẵn/Lẻ hoặc số lượng đồng xu ngửa",
                max_bet: 10000,
                max_number: 4
            };
        }

        return {
            id: 1,
            name: "Xóc Đĩa KU",
            rate: "2.8",
            price_rate: "2.8",
            prize_rate: "2.8",
            title: "Xóc Đĩa KU",
            help: "Dự đoán kết quả xóc đĩa",
            description: "Game xóc đĩa truyền thống",
            example: "Chọn Chẵn/Lẻ hoặc số lượng đồng xu ngửa",
            max_bet: 10000,
            max_number: 4
        };
    }, [betTypesData]);

    const useCountdown = (
        targetTime: string | undefined,
        onComplete: () => void
    ) => {
        const [timeLeft, setTimeLeft] = useState<TimeLeft>({
            hours: 0,
            minutes: 0,
            seconds: 0,
        });

        useEffect(() => {
            if (!targetTime) return;

            const interval = setInterval(() => {
                const now = new Date().getTime();
                const target = new Date(targetTime).getTime();
                const difference = target - now;

                if (difference > 0) {
                    const hours = Math.floor(difference / (1000 * 60 * 60));
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                    setTimeLeft({ hours, minutes, seconds });
                } else {
                    setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                    onComplete();
                }
            }, 1000);

            return () => clearInterval(interval);
        }, [targetTime, onComplete]);

        return timeLeft;
    };

    const countdown = useCountdown(currentDraw?.end_time, () => {
        console.log("Countdown completed");
    });

    const handleClickChip = (num: number) => {
        setBetChip(prev => prev + num);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setBetChip(value);
    };

    useEffect(() => {
        if (selectedChoice && betChip > 0) {
            setTotalChip(betChip);
            setTotalPrize(betChip * parseFloat(subType?.prize_rate || "2.8"));
        } else {
            setTotalChip(0);
            setTotalPrize(0);
        }
    }, [selectedChoice, betChip, subType]);

    const handleCancel = () => {
        setSelectedChoice("");
        setBetChip(0);
    };

    const handleSubmit = async () => {
        console.log("Submit bet:", {
            selectedChoice,
            betChip,
            drawId: currentDrawData?.id || currentDraw.id
        });

        try {
            invalidateAllSicboQueries();
            setMessage("Đặt cược thành công!");
            setSelectedChoice("");
            setBetChip(0);
        } catch (error) {
            console.error("Error submitting bet:", error);
            setMessage("Đặt cược thất bại. Vui lòng thử lại!");
        }
    };

    const handleConfirm = async () => {
        console.log("Confirm bet");
    };

    const handleClose = async () => {
        console.log("Close popup");
    };

    const handleOptionSelect = (optionId: string) => {
        setSelectedChoice(optionId);
    };

    const handleChipClick = (amount: number) => {
        setBetChip(prev => prev + amount);
    };

    const handleClear = () => {
        setBetChip(0);
    };

    const getOptionIcon = (optionId: string) => {
        // Return appropriate icon based on option
        return "";
    };

    const getOptionName = (optionId: string) => {
        const optionNames: { [key: string]: string } = {
            "BIG": "Tài",
            "SMALL": "Xỉu",
            "ODD": "Lẻ",
            "EVEN": "Chẵn",
            "ODDS_04": "4 Trắng",
            "ODDS_13": "3 Trắng 1 Đỏ",
            "ODDS_22": "2 Trắng 2 Đỏ",
            "ODDS_40": "4 Đỏ",
            "ODDS_31": "3 Đỏ 1 Trắng",
            "ODDS_44": "4 Đỏ X 4 Trắng"
        };
        return optionNames[optionId] || optionId;
    };

    if (isCurrentDrawLoading || isLastDrawsLoading) {
        return (
            <Flex sx={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <CustomText>Đang tải dữ liệu...</CustomText>
            </Flex>
        );
    }

    if (currentDrawError || lastDrawsError) {
        return (
            <Flex sx={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <CustomText>Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</CustomText>
            </Flex>
        );
    }

    return (
        <div>
        <Flex
            sx={{
                width: "100%",
                height: "100%",
                flexDirection: "row",
                padding: "5px 5px 0 5px",
                alignItems: "flex-start",
                background: "#F3F3F3",
            }}
        >
            {/* Main content */}
            <Flex
                sx={{
                    flexDirection: "column",
                    flex: 1,
                    marginRight: "5px",
                }}
            >
                <Flex
                    sx={{
                        background: "#F3F3F3",
                        width: "800px",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <div className="flex items-start w-full bg-red-500 h-[302px]">
                        {/* Video player - replacing iframe */}
                        <div
                            style={{
                                width: "598px",
                                height: "302px",
                                backgroundColor: "#fff",
                                float: "left",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            <video
                                ref={videoRef}
                                src="https://cuvnae.gs5168.com/video/sicBoRWElec/sicBoRWElec.mp4"
                                style={{ 
                                    width: "100%", 
                                    height: "302px",
                                    objectFit: "cover",
                                    display: "block"
                                }}
                                onEnded={handleVideoEnded}
                                onLoadedData={handleVideoLoad}
                                controls={false}
                                playsInline
                                preload="auto"
                            />
                            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center gap-[10px] h-[50px] text-[22px] text-white">
                                Số kỳ
                                <a className="text-[#fec000]">{currentDraw.draw_no}</a>
                                &nbsp;
                                <span></span>
                            </div>
                        </div>

                        {/* Results section - Now using API data */}
                        <div className="block static w-[202px] border-0 bg-[#f3f3f3] text-black font-[Arial,微軟正黑體] text-base font-normal text-center opacity-100 overflow-visible float-left">
                            <div className="block static w-[202px] h-[35px] border-0 bg-[#4984bf] text-white font-[Arial,微軟正黑體] text-sm font-normal leading-[35px] text-center opacity-100 overflow-visible">
                                <span className="inline static border-0 bg-transparent text-white font-[Arial,微軟正黑體] text-sm font-normal leading-[35px] text-center opacity-100 overflow-visible">
                                    Kết quả
                                </span>
                            </div>
                            <div className="block static w-[202px] border-0 bg-white text-black font-[Arial,微軟正黑體] text-base font-normal text-center opacity-100 overflow-hidden">
                                <table id="tbRecentResult" cellPadding="0" cellSpacing="1" className="table static w-[202px] h-[263.5px] my-[1px] mx-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-visible border-separate border-spacing-[1px]">
                                    <tbody className="table-row-group static w-[200px] border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-visible align-middle border-separate border-spacing-[1px]">
                                        {recentDraws.map((draw: SicboLastDraw, index: number) => (
                                            <tr     
                                            key={draw.id || index} 
                                            className={`w-[200px] border-0 ${index % 2 === 0 ? 'bg-[#f3f3f3]' : 'bg-white'} flex items-center`}>
                                                <td className="w-[50px] h-[36.5px] flex items-center justify-center border-r border-r-white">
                                                    {draw.draw_no || `178${index}`}
                                                </td>
                                                <td className="w-[149px] h-[36.5px] flex items-center justify-center gap-[5px]">
                                                    {draw.result && typeof draw.result === 'string' && draw.result.includes(',') ? 
                                                        draw.result.split(',').map((dice: string, diceIndex: number) => (
                                                            <img
                                                                key={diceIndex}
                                                                src={`https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_dice${dice}.svg`}
                                                                className="w-[29.7969px] h-[29.0312px]"
                                                                alt={`Dice ${dice}`}
                                                            />
                                                        ))
                                                        : renderDrawResult(draw.result)
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <KyHienTaiHeader
                        currentDrawNo={currentDraw.draw_no || "XD250608385"}
                        timeLeft={countdown}
                        todayOpened={Array.isArray(lastDrawsData)
                            ? lastDrawsData.length
                            : Array.isArray(lastDrawsData?.data)
                                ? lastDrawsData.data.length
                                : 385}
                        todayRemaining={177}
                        showSeconds={true}
                        width="100%"
                    />

                    {/* Đặt cược Section */}
                    <div className="static w-[780px] h-[270px] mt-[5px] mr-[5px] ml-[5px] pt-0 pr-[5px] pb-[10px] pl-[5px] border-0 bg-white text-[#106eb6] text-[13px] font-normal text-left float-left">
                        <HuongDanSection
                            guide={betTypesData?.data?.[0]?.description || "Dự đoán hột xúc xắc mở ra tài xỉu lẻ chẵn và đỏ trắng"}
                            exampleDesc={betTypesData?.data?.[0]?.example || "Đặt cược con số 12</br>\nCon số mở thưởng: hậu nhị ***12 (trình tự vị trí con số \ngiống nhau)</br>\nNhư vậy bạn đã trúng tiền thưởng hàng số hậu nhị"}
                            helpDesc={betTypesData?.data?.[0]?.help || "Nhập 2 con số bằng tay để tạo thành 1 tổ hợp, tất cả con số đã chọn phải trùng khớp với con số mở thưởng từ hàng chục, hàng đơn vị đồng thời trình tự con số phải như nhau, như vậy thì bạn đã trúng giải."}
                        />

                        {/* Main betting area */}
                        <div className="block relative w-[780px] h-[232px] border border-[#c4c4c4] bg-[#efefef] text-[#106eb6] text-[13px] font-normal text-left">
                            {/* Left dice combinations */}
                            <ul className="block static w-[187px] h-[225px] ml-[5px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left float-left">
                                {betTypesData?.data?.filter((item: SicboBetType) => ["ODDS_04", "ODDS_13", "ODDS_22"].includes(item.code)).map((option: SicboBetType) => (
                                    <li
                                        key={option.id}
                                        id={`aK35_${option.code.split('_')[1]}`}
                                        className="flex relative h-[70px] mt-[5px] border border-[#ccc] rounded-[5px] bg-gradient-to-b from-white to-[#f3f3f3] text-[#106eb6] text-[13px] font-normal text-left cursor-pointer flex-wrap justify-center group hover:from-[#FFCDCF] hover:to-[#FFCDCF]"
                                        onClick={() => handleOptionSelect(option.code)}
                                    >
                                        {renderDiceImages(option.code)}
                                        <span className="block relative w-[185px] h-[24.5px] border-0 bg-transparent text-red-500 text-[17px] font-bold text-center cursor-pointer float-right">
                                            {option.prize_rate}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Center betting options */}
                            <ul className="flex static w-[383px] h-[226px] ml-[5px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left float-left flex-row flex-wrap justify-around">
                                {betTypesData?.data?.filter((item: SicboBetType) => ["BIG", "SMALL", "ODD", "EVEN"].includes(item.code)).map((option: SicboBetType) => (
                                    <li
                                        key={option.id}
                                        id={`aK36_${option.id}`}
                                        className="flex relative w-[187px] h-[108px] mt-[5px] border border-[#ccc] rounded-[5px] bg-gradient-to-b from-white to-[#f3f3f3] text-[#106eb6] text-[13px] font-normal text-left cursor-pointer float-left flex-row flex-nowrap justify-around items-center group hover:from-[#FFCDCF] hover:to-[#FFCDCF] hover:border-[#EB132D] hover:text-[#EB132D]"
                                        onClick={() => handleOptionSelect(option.code)}
                                    >
                                        <span className={`block relative ${option.name === "Tài" ? 'w-[43.3594px]' : option.name === "Xỉu" ? 'w-[46.6719px]' : option.name === "Lẻ" ? 'w-[35.0156px]' : 'w-[75px]'} h-[34px] ml-[15px] border-0 bg-transparent text-[#106eb6] text-[30px] font-bold text-left cursor-pointer group-hover:text-[#EB132D]`}>
                                            {option.name}
                                        </span>
                                        <span className="block relative w-[57.5625px] h-[27px] mr-[20px] ml-[20px] border-0 bg-transparent text-red-500 text-[23px] font-bold text-left cursor-pointer float-right">
                                            {option.prize_rate}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Right dice combinations */}
                            <ul className="block static w-[187px] h-[225px] ml-[5px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left float-left">
                                {betTypesData?.data?.filter((item: SicboBetType) => ["ODDS_40", "ODDS_31", "ODDS_44"].includes(item.code)).map((option: SicboBetType) => (
                                    <li
                                        key={option.id}
                                        id={`aK35_${option.code.split('_')[1]}`}
                                        className="flex relative w-[187px] h-[70px] mt-[5px] border border-[#ccc] rounded-[5px] bg-gradient-to-b from-white to-[#f3f3f3] text-[#106eb6] text-[13px] font-normal text-left cursor-pointer flex-wrap justify-center group hover:from-[#FFCDCF] hover:to-[#FFCDCF] hover:border-[#EB132D] hover:text-[#EB132D]"
                                        onClick={() => handleOptionSelect(option.code)}
                                    >
                                        {renderDiceImages(option.code)}
                                        <span className="block relative w-[185px] h-[24.5px] border-0 bg-transparent text-red-500 text-[17px] font-bold text-center cursor-pointer float-right">
                                            {option.prize_rate}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Flex>
            </Flex>

            {/* Right sidebar */}
            <Box sx={{ width: "200px", backgroundColor: baseColors.white }}>
                <Flex
                    sx={{
                        backgroundColor: "#4984bf",
                        height: "35px",
                        lineHeight: "35px",
                        color: "#fff",
                        fontSize: "14px",
                        padding: "0 10px",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <CustomText sx={{ fontSize: "14px", color: "#fff" }}>
                        Danh sách đơn cược
                    </CustomText>
                </Flex>
                <Box>
                    <Box
                        sx={{
                            backgroundColor: "#f3f3f3",
                            padding: "8px 0",
                            color: "#0073de",
                            textAlign: "center",
                            borderBottom: "1px solid #cccccc",
                            width: "100%",
                        }}
                    >
                        <CustomText sx={{ fontSize: "16px", color: "#0073de" }}>
                            {subType?.title || "Xóc Đĩa KU"}
                        </CustomText>
                    </Box>
                    <Box sx={{ height: "442px", padding: "8px" }}>
                        <CustomText>Lựa chọn</CustomText>
                        <Box sx={{ color: "#f00", fontSize: "16px", fontWeight: "600" }}>
                            {getOptionName(selectedChoice)}
                        </Box>
                    </Box>
                </Box>
                <div className="bg-[#b3d2f2] border-b-[1px] border-b-[#7b9fc5] p-[5px_10px]">
                    <div className="text-sm">
                        Đơn cược：<span className="color_blue">{selectedChoice ? 1 : 0}</span>
                    </div>
                    <div className="relative flex items-center gap-2">
                        <label className="text-sm">
                            Tiền cược：
                            <input
                                value={betChip}
                                onChange={handleChange}
                                className="w-[58px] h-[30px] rounded-[3px] px-[7px] border border-[#fff] bg-white"
                            />
                        </label>
                        <span className="text-[#fe0000] text-sm">X{subType?.rate || "2.8"}</span>
                    </div>
                    <div className="bg-white border boder-[#ccc] my-2">
                        <div className="relative">
                            <div className="chipWraps">
                                <span className="chip_close"></span>
                                <div id="divAllChip" className="allChipBox">
                                    <div className="chipBoxItem">
                                        <div
                                            onClick={() => handleClickChip(1)}
                                            className="chip_Text icon_chip_1"
                                        >
                                            <span>1</span>
                                        </div>
                                        <div
                                            onClick={() => handleClickChip(5)}
                                            className="chip_Text icon_chip_5"
                                        >
                                            <span>5</span>
                                        </div>
                                        <div
                                            onClick={() => handleClickChip(10)}
                                            className="chip_Text icon_chip_10"
                                        >
                                            <span>10</span>
                                        </div>
                                    </div>
                                    <div className="chipBoxItem">
                                        <div
                                            onClick={() => handleClickChip(100)}
                                            className="chip_Text icon_chip_100"
                                        >
                                            <span>100</span>
                                        </div>
                                        <div
                                            onClick={() => handleClickChip(500)}
                                            className="chip_Text icon_chip_500"
                                        >
                                            <span>500</span>
                                        </div>
                                        <div
                                            onClick={() => handleClickChip(1000)}
                                            className="chip_Text icon_chip_1000"
                                        >
                                            <span>1000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-black h-[30px] leading-[30px] text-sm">
                        T.tiền cược：
                        <span>{totalChip}</span>
                    </div>
                </div>
                <div className="bg-[#b3d2f2] border-t-[1px] border-t-[#fff] h-[110px] p-[8px_10px]">
                    <div>
                        <span>Tỉ lệ :</span>
                        <span className="color_red">{subType?.prize_rate || "2.8"}</span>
                    </div>
                    <div>
                        Tiền thắng：<span className="color_blue">{totalPrize}</span>
                    </div>
                    <div className="text-sm flex gap-2">
                        <button
                            onClick={() => handleCancel()}
                            className="bg-[#898989] text-white text-center w-[60px] h-[35px] m-[5px_0px_2px] rounded-[3px]"
                        >
                            Hủy
                        </button>
                        <button
                            disabled={
                                !selectedChoice || betChip === 0 ||
                                (countdown.hours === 0 &&
                                    countdown.minutes === 0 &&
                                    countdown.seconds === 0)
                            }
                            onClick={() => handleSubmit()}
                            className="disabled:bg-[#898989] bg-[#336aab] text-white text-center w-[110px] h-[35px] m-[5px_0px_2px] rounded-[3px]"
                        >
                            Xác nhận gửi đi
                        </button>
                    </div>
                </div>
            </Box>

            {/* Modals */}
            <PopupInfoMobile duplicates={duplicates} onConfirm={handleClose} />
            <PopupSuccess />
            <PopupSuccessQuota message={message} />
            <PopupError message={message} />
            <LoXien currentDraw={currentDraw} />
            <LoTruot currentDraw={currentDraw} />
        </Flex>
        {/* Kết quả gần đây Section */}
        <div className="w-full mt-4">
            <table cellPadding="0" cellSpacing="0" className="w-full h-[185px] border-0 bg-[#f3f3f3] text-black text-base font-normal text-start overflow-visible border-separate">
                <tbody className="w-full h-[185px] border-0 text-black text-base font-normal text-start overflow-visible align-middle border-separate">
                    <tr className="w-full h-[35px] border-0 text-black text-base font-normal text-start overflow-visible align-middle border-separate">
                        <th align="left" className="w-1/2 h-[35px] pl-[10px] border-0 text-[#336aab] text-sm font-bold leading-[35px] overflow-visible align-middle border-separate">
                            <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-left">
                                <span className="text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible">Xóc Đĩa KU</span>
                                <span className="text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible">Điểm số</span>
                            </div>
                            <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-right">
                                <a className="block w-[125px] h-[27px] mt-[5px] mr-[5px] border-t-[3px] border-t-[#4984c0] border-r-0 border-b-0 border-l-0 bg-white text-[#4984c0] text-sm font-bold text-center leading-[27px] overflow-visible float-left cursor-pointer">
                                    Điểm số
                                </a>
                                <a className="block w-[125px] h-[30px] mt-[5px] mr-[2px] border-0 bg-[#cccccc] text-black text-sm font-bold text-center leading-[31px] overflow-visible float-left cursor-pointer">
                                    Thống kê
                                </a>
                            </div>
                        </th>
                        <th align="left" className="w-1/2 h-[35px] pl-[10px] border-0 text-[#336aab] text-sm font-bold leading-[35px] overflow-visible align-middle border-separate">
                            <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-left">
                                <span className="text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible">Xóc Đĩa KU</span>
                                <span className="text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible">Kèo Đôi</span>
                            </div>
                            <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-right">
                                <a className="block w-[120px] h-[27px] mt-[5px] border-t-[3px] border-t-[#4984c0] border-r-0 border-b-0 border-l-0 bg-white text-[#4984c0] text-sm font-bold text-center leading-[27px] overflow-visible float-left cursor-pointer">
                                    Kèo Đôi
                                </a>
                            </div>
                        </th>
                    </tr>
                    <tr className="w-full h-[150px] border-0 text-black text-base font-normal text-start overflow-visible align-middle border-separate bg-red-500">
                        <td valign="top" className="h-[150px] border-t-0 border-r-[2px] border-r-[#f3f3f3] border-b-0 border-l-0 bg-white text-black text-base font-normal text-start overflow-visible align-top border-separate">
                            <table className="table-fixed w-[493px] h-[139px] mt-[5px] ml-[2px] border-t border-t-[#ccc] border-l border-l-[#ccc] border-r-0 border-b-0 text-black text-base font-normal text-center overflow-visible float-left box-border">
                                <tbody className="table-row-group w-full h-[138px] border-0 text-black text-base font-normal text-center overflow-visible align-middle box-content">
                                    {/* Row 1 */}
                                    <tr className="table-row w-full h-[23px] border-0 text-black text-base font-normal text-center overflow-visible align-middle">
                                        {Array.from({ length: 21 }).map((_, index) => (
                                            <td key={`r1c${index+1}`} className="table-cell relative w-[22px] h-[22px] border-r border-r-[#ccc] border-b border-b-[#ccc] bg-[#f3f3f3] text-black text-xs font-normal text-center overflow-visible align-middle cursor-pointer">
                                                {index === 0 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">4</span>
                                                )}
                                                {index === 1 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
                                                        <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_RWball.svg" className="block w-[22px] h-[22px] border-0 text-black text-base font-normal text-center leading-[23px] overflow-clip cursor-pointer" alt="decorative" />
                                                    </span>
                                                )}
                                                {index === 2 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">3</span>
                                                )}
                                                {index === 3 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
                                                        <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_RWball.svg" className="block w-[22px] h-[22px] border-0 text-black text-base font-normal text-center leading-[23px] overflow-clip cursor-pointer" alt="decorative" />
                                                    </span>
                                                )}
                                                {index === 4 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">3</span>
                                                )}
                                                {index === 5 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                                {index === 7 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
                                                        <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_RWball.svg" className="block w-[22px] h-[22px] border-0 text-black text-base font-normal text-center leading-[23px] overflow-clip cursor-pointer" alt="decorative" />
                                                    </span>
                                                )}
                                                {index === 8 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">3</span>
                                                )}
                                                {index === 9 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                                {index === 14 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">4</span>
                                                )}
                                                {index === 15 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                                {index === 19 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    
                                    {/* Row 2 */}
                                    <tr className="table-row w-full h-[23px] border-0 text-black text-base font-normal text-center overflow-visible align-middle">
                                        {Array.from({ length: 21 }).map((_, index) => (
                                            <td key={`r2c${index+1}`} className="table-cell relative w-[22px] h-[22px] border-r border-r-[#ccc] border-b border-b-[#ccc] bg-[#f3f3f3] text-black text-xs font-normal text-center overflow-visible align-middle cursor-pointer">
                                                {index === 1 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
                                                        <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_RWball.svg" className="block w-[22px] h-[22px] border-0 text-black text-base font-normal text-center leading-[23px] overflow-clip cursor-pointer" alt="decorative" />
                                                    </span>
                                                )}
                                                {index === 2 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">3</span>
                                                )}
                                                {index === 8 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                                {index === 17 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">3</span>
                                                )}
                                                {index === 20 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    
                                    {/* Row 3 */}
                                    <tr className="table-row w-full h-[23px] border-0 text-black text-base font-normal text-center overflow-visible align-middle">
                                        {Array.from({ length: 21 }).map((_, index) => (
                                            <td key={`r3c${index+1}`} className="table-cell relative w-[22px] h-[22px] border-r border-r-[#ccc] border-b border-b-[#ccc] bg-[#f3f3f3] text-black text-xs font-normal text-center overflow-visible align-middle cursor-pointer">
                                                {index === 1 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
                                                        <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_RWball.svg" className="block w-[22px] h-[22px] border-0 text-black text-base font-normal text-center leading-[23px] overflow-clip cursor-pointer" alt="decorative" />
                                                    </span>
                                                )}
                                                {index === 16 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    
                                    {/* Row 4 */}
                                    <tr className="table-row w-full h-[23px] border-0 text-black text-base font-normal text-center overflow-visible align-middle">
                                        {Array.from({ length: 21 }).map((_, index) => (
                                            <td key={`r4c${index+1}`} className="table-cell relative w-[22px] h-[22px] border-r border-r-[#ccc] border-b border-b-[#ccc] bg-[#f3f3f3] text-black text-xs font-normal text-center overflow-visible align-middle cursor-pointer">
                                                {index === 5 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    
                                    {/* Row 5 */}
                                    <tr className="table-row w-full h-[23px] border-0 text-black text-base font-normal text-center overflow-visible align-middle">
                                        {Array.from({ length: 21 }).map((_, index) => (
                                            <td key={`r5c${index+1}`} className="table-cell relative w-[22px] h-[22px] border-r border-r-[#ccc] border-b border-b-[#ccc] bg-[#f3f3f3] text-black text-xs font-normal text-center overflow-visible align-middle cursor-pointer">
                                                {index === 10 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">3</span>
                                                )}
                                                {index === 19 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    
                                    {/* Row 6 */}
                                    <tr className="table-row w-full h-[23px] border-0 text-black text-base font-normal text-center overflow-visible align-middle">
                                        {Array.from({ length: 21 }).map((_, index) => (
                                            <td key={`r6c${index+1}`} className="table-cell relative w-[22px] h-[22px] border-r border-r-[#ccc] border-b border-b-[#ccc] bg-[#f3f3f3] text-black text-xs font-normal text-center overflow-visible align-middle cursor-pointer">
                                                {index === 2 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">3</span>
                                                )}
                                                {index === 13 && (
                                                    <span className="block w-[22px] h-[22px] border border-[#ccc] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible box-border cursor-pointer">3</span>
                                                )}
                                                {index === 20 && (
                                                    <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">3</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    );
}

function renderDrawResult(result: any) {
    if (!result) return null;

    try {
        if (typeof result === 'string' && result.includes(',')) {
            const diceResults = result.split(',');
            return diceResults.map((dice, index) => (
                <img
                    key={index}
                    src={`https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_dice${dice}.svg`}
                    className="inline static w-[29.7969px] h-[29.0312px] mt-[3px] mr-[5px] mb-0 ml-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-clip align-baseline border-separate border-spacing-[1px]"
                    alt={`Dice ${dice}`}
                />
            ));
        }
   
        if (result.result && typeof result.result === 'string' && result.result.includes(',')) {
            const diceResults = result.result.split(',');
            return diceResults.map((dice: string, index: number) => (
                <img
                    key={index}
                    src={`https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_dice${dice}.svg`}
                    className="inline static w-[29.7969px] h-[29.0312px] mt-[3px] mr-[5px] mb-0 ml-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-clip align-baseline border-separate border-spacing-[1px]"
                    alt={`Dice ${dice}`}
                />
            ));
        }

        const resultData = result.result ? result.result : result;
        const diceResults = Array.isArray(resultData) ? resultData :
            typeof resultData === 'string' ?
                resultData.split('').map(r => parseInt(r)) :
                [1, 1, 1, 1]; // Fallback

        return diceResults.map((dice, index) => (
            <img
                key={index}
                src={`https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_dice${dice === 1 ? 'R' : 'W'}.svg`}
                className="inline static w-[29.7969px] h-[29.0312px] mt-[3px] mr-[5px] mb-0 ml-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-clip align-baseline border-separate border-spacing-[1px]"
                alt="dice icon"
            />
        ));
    } catch (error) {
        return [0, 0, 0, 0].map((_, index) => (
            <img
                key={index}
                src={`https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg`}
                className="inline static w-[29.7969px] h-[29.0312px] mt-[3px] mr-[5px] mb-0 ml-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-clip align-baseline border-separate border-spacing-[1px]"
                alt="dice icon"
            />
        ));
    }
}

export default XocDiaKUContent; 