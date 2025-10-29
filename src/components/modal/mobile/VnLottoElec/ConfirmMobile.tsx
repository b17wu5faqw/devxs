import {MODAL} from "@/constant/modal";
import {useAuthStore} from "@/stores/authStore";
import useModalStore from "@/stores/modalStore";
import {Box, Dialog, Grow} from "@mui/material";
import {memo, useCallback, useEffect, useState} from "react";
import ButtonConfirm from "@/components/button/ButtonConfirm";
import {ChipButton} from "@/components/button/CustomButton";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import FlexReverse from "@/components/utils/FlexReverse";
import ButtonCancel from "@/components/button/ButtonCancel";

interface PopupConfirmProps {
    drawName: string;
    drawId: number;
    drawNo: string;
    subtypeId: number;
    title: string;
    inputType: number;
    numbers: string[];
    betChip: number;
    totalChip: number;
    rate: number;
    prizeRate: number;
    totalPrize: number;
    maxBet: number;
    disabled?: boolean;
    externalOpen?: boolean;
    drawCount: number;
    externalOnClose?: () => void;
    onConfirm: (totalChip: number, betChip: number, drawCount: number) => void;
}

const ConfirmMobile: React.FC<PopupConfirmProps> = ({
                                                             drawName,
                                                             drawId,
                                                             drawNo,
                                                             subtypeId,
                                                             inputType,
                                                             title,
                                                             numbers,
                                                             betChip: initialBetChip,
                                                             totalChip: initialTotalChip,
                                                             rate,
                                                             prizeRate,
                                                             maxBet,
                                                             totalPrize: initialTotalPrice,
                                                             disabled,
                                                             drawCount: initialDrawCount,
                                                             externalOpen,
                                                             externalOnClose,
                                                             onConfirm,
                                                         }) => {
    const [betChip, setBetChip] = useState(initialBetChip || 0);
    const [totalChip, setTotalChip] = useState(initialTotalChip || 0);
    const [totalPrize, setTotalPrize] = useState(initialTotalPrice || 0);
    const [drawCount, setDrawCount] = useState(initialDrawCount || 1);
    const [showKeypad, setShowKeypad] = useState(false);

    const isOpenGlobal = useModalStore((state) =>
        state.isModalOpen(MODAL.LOTTO_ELEC_CONFIRM)
    );
    const {accessToken} = useAuthStore();
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);

    const isOpen = externalOpen !== undefined ? externalOpen : isOpenGlobal;

    const handleClose = () => {
        if (externalOnClose) {
            externalOnClose();
        } else {
            closeModal();
        }
    };

    const handleClickChip = (num: number) => {
        setBetChip((prev) => {
            const newValue = prev + num;
            if (maxBet && newValue > maxBet) {
                return maxBet;
            }
            return newValue;
        });
    };

    const handleChange = (e: any) => {
        const newValue = e.target.value;
        if (newValue === "") {
            setBetChip(0);
            return;
        }

        const numValue = Number(newValue);
        if (!isNaN(numValue)) {
            if (maxBet && numValue > maxBet) {
                setBetChip(maxBet);
            } else {
                setBetChip(numValue);
            }
        }
    };

    const handleChangeDraw = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            if (newValue === "") {
                setDrawCount(1);
                return;
            }
            const numValue = Number(newValue);
            if (!isNaN(numValue)) {
                setDrawCount(Math.max(1, Math.min(50, numValue)));
            }
        },
        [setDrawCount]
    );

    const handleKeypadClick = (val: string) => {
        if (val === "←") {
            setDrawCount((prev) => {
                const newVal = prev.toString().slice(0, -1);
                return newVal === "" ? 0 : parseInt(newVal);
            });
        } else {
            setDrawCount((prev) => {
                const newVal = parseInt(prev.toString() + val);
                if (isNaN(newVal) || newVal <= 0) return 1;
                if (newVal > 20) return 20;
                return newVal;
            });
        }
    };

    const handleConfirm = () => {
        const validDrawCount = !drawCount || drawCount === 0 ? 1 : drawCount;
        onConfirm(totalChip, betChip, validDrawCount);
        setBetChip(0);
        setDrawCount(1);
        setShowKeypad(false);
    };

    useEffect(() => {
        setTotalChip(
            betChip * (rate ? Number(rate) : 1) * Number(numbers.length) * drawCount
        );
    }, [betChip, numbers, drawCount, rate]);

    useEffect(() => {
        setTotalPrize(betChip * (prizeRate ? Number(prizeRate) : 0) * drawCount);
    }, [betChip, prizeRate, drawCount]);

    useEffect(() => {
        if (initialBetChip !== undefined && initialBetChip !== betChip) {
            setBetChip(initialBetChip);
        }
    }, [initialBetChip]);

    const formatNumbersForDisplay = (
        numbers: string[],
        inputType?: number
    ): string => {
        return numbers.join(", ");
    };

    return (
        <Dialog
            PaperProps={{
                sx: {
                    borderRadius: "8px",
                    width: {xs: "100vw", md: "310px"},
                    maxHeight: {xs: "100dvh", md: "90vh"},
                    background:
                        "linear-gradient(137.93deg, rgba(97,206,255,.024) 7.21%,#f6faff 49.31%,rgba(97,206,255,.024) 96.05%),#fff",
                    position: "relative",
                    overflow: "hidden",
                },
            }}
            open={isOpen}
            TransitionComponent={Grow}
            onClose={handleClose}
        >
            <FlexReverse
                sx={{
                    width: "100%",
                    height: "100%",
                    overflowX: "hidden",
                    overflowY: "auto",
                    position: "relative",
                }}
            >
                <CustomText
                    sx={{
                        fontSize: "16px",
                        fontWeight: "500",
                        textAlign: "center",
                        color: "#fff",
                        padding: "10px",
                        backgroundColor: "#206B61",
                    }}
                >
                    {drawName} Kỳ{" "}
                    <span className="text-[#fff600] font-bold">{drawNo}</span>
                </CustomText>
                <Flex
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: "10px",
                        top: "5px",
                        background: "url(/images/main/icon_close.png) no-repeat center",
                        backgroundSize: "auto 55%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        opacity: "0.8",
                    }}
                />
                <Box>
                    <CustomText
                        sx={{
                            fontSize: "1em",
                            fontWeight: "600",
                            textAlign: "center",
                            padding: "2% 0",
                            color: "#6077a1",
                        }}
                    >
                        {title}
                    </CustomText>
                    <hr/>
                    <Box
                        sx={{
                            paddingLeft: "6.5%",
                            paddingTop: "2%",
                            paddingBottom: "2%",
                            paddingRight: "6.5%",
                            width: "100%",
                        }}
                    >
                        <CustomText
                            sx={{
                                fontSize: "0.9em",
                                fontWeight: "500",
                                textAlign: "left",
                                color: "#0078ff",
                                lineHeight: "1.4",
                            }}
                        >
                            {formatNumbersForDisplay(
                                numbers,
                                inputType === 5 ? 5 : undefined
                            )}
                        </CustomText>
                    </Box>
                    <hr/>
                    <Flex
                        sx={{
                            position: "relative",
                            justifyContent: "space-between",
                            alignItems: "center",
                            lineHeight: "40px",
                            padding: "2% 3.5%",
                            fontSize: "0.95em",
                            gap: "5px",
                        }}
                    >
                        <label className="text-sm flex items-center gap-2">
                            Tiền cược：
                            <input
                                value={betChip}
                                onChange={handleChange}
                                disabled={disabled}
                                style={{
                                    height: "2.2em",
                                    fontSize: "1em",
                                    textAlign: "center",
                                    width: "45px",
                                    border: "1px solid #b3b3b3",
                                    borderRadius: "4px",
                                    padding: "0 5px",
                                    fontWeight: "normal",
                                    backgroundColor: disabled ? "#f0f0f0" : "#fff",
                                    cursor: disabled ? "not-allowed" : "text",
                                }}
                            />
                        </label>
                        <label className="text-sm flex items-center gap-2">
                            Kỳ liên tiếp：
                            <input
                                value={drawCount}
                                onFocus={() => setShowKeypad(true)}
                                onBlur={() => setDrawCount(1)}
                                readOnly
                                style={{
                                    height: "2.2em",
                                    fontSize: "1em",
                                    width: "45px",
                                    border: "1px solid #b3b3b3",
                                    borderRadius: "4px",
                                    padding: "0 5px",
                                    fontWeight: "600",
                                    textAlign: 'center',
                                    backgroundColor: disabled ? "#f0f0f0" : "#fff",
                                    cursor: disabled ? "not-allowed" : "text",
                                }}
                            />
                        </label>
                    </Flex>

                    {showKeypad && (
                        <Box sx={{
                            padding: "10px"
                        }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(6, 1fr)",
                                    border: "1px solid #2682d5",
                                    borderRadius: "6px",
                                }}
                            >
                                {["1", "2", "3", "4", "5", "←", "6", "7", "8", "9", "0"].map((key) => (
                                    <Box
                                        key={key}
                                        onClick={() => handleKeypadClick(key)}
                                        sx={{
                                            textAlign: "center",
                                            padding: "5px 0",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            color: "#2682d5",
                                            fontSize: "1.1em",
                                            fontWeight: "600",
                                            borderRight: "1px solid #2682d5",
                                            "&:first-child": {
                                                borderRadius: "6px 0 0 0",
                                                borderBottom: "1px solid #2682d5"
                                            },
                                            "&:nth-of-type(2)": {borderBottom: "1px solid #2682d5"},
                                            "&:nth-of-type(3)": {borderBottom: "1px solid #2682d5"},
                                            "&:nth-of-type(4)": {borderBottom: "1px solid #2682d5"},
                                            "&:nth-of-type(5)": {borderBottom: "1px solid #2682d5"},
                                            "&:nth-of-type(6)": {
                                                borderRadius: "0 6px 0 0",
                                                borderBottom: "1px solid #2682d5",
                                                borderRight: "0"
                                            },
                                            "&:nth-of-type(7)": {borderRadius: "0 0 0 6px"},
                                            "&:after": {borderRight: "1px solid #2682d5"},
                                        }}
                                    >
                                        {key}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Flex sx={{border: "1px solid #d9d9d9"}}>
                        <ChipButton
                            onClick={() => handleClickChip(1)}
                            disabled={disabled}
                            sx={{
                                background: "url(/images/main/icon_chip1.png) no-repeat center",
                                backgroundSize: "auto 80%",
                                opacity: disabled ? 0.5 : 1,
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            1
                        </ChipButton>
                        <ChipButton
                            onClick={() => handleClickChip(10)}
                            disabled={disabled}
                            sx={{
                                background:
                                    "url(/images/main/icon_chip10.png) no-repeat center",
                                backgroundSize: "auto 80%",
                                opacity: disabled ? 0.5 : 1,
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            10
                        </ChipButton>
                        <ChipButton
                            onClick={() => handleClickChip(100)}
                            disabled={disabled}
                            sx={{
                                background:
                                    "url(/images/main/icon_chip100.png) no-repeat center",
                                backgroundSize: "auto 80%",
                                opacity: disabled ? 0.5 : 1,
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            100
                        </ChipButton>
                        <ChipButton
                            onClick={() => handleClickChip(500)}
                            disabled={disabled}
                            sx={{
                                background:
                                    "url(/images/main/icon_chip500.png) no-repeat center",
                                backgroundSize: "auto 80%",
                                opacity: disabled ? 0.5 : 1,
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            500
                        </ChipButton>
                        <ChipButton
                            onClick={() => handleClickChip(0)}
                            disabled={disabled}
                            sx={{
                                background:
                                    "url(/images/main/icon_chip1k.png) no-repeat center",
                                backgroundSize: "auto 80%",
                                opacity: disabled ? 0.5 : 1,
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            1K
                        </ChipButton>
                        <ChipButton
                            onClick={() => handleClickChip(0)}
                            disabled={disabled}
                            sx={{
                                background:
                                    "url(/images/main/icon_chip_heart.png) no-repeat center",
                                backgroundSize: "auto 80%",
                                opacity: disabled ? 0.5 : 1,
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            ♥
                        </ChipButton>
                    </Flex>
                    <Flex>
                        <CustomText
                            sx={{
                                fontSize: "14px",
                                fontWeight: "600",
                                textAlign: "left",
                                padding: "4px 10px",
                            }}
                        >
                            Số lựa chọn :{" "}
                            <span className="text-[#3287e4]">{numbers.length}</span>
                        </CustomText>
                        <CustomText
                            sx={{
                                fontSize: "14px",
                                fontWeight: "600",
                                textAlign: "left",
                                padding: "4px 10px",
                            }}
                        >
                            Số kỳ: <span className="text-[#3287e4]">{drawCount}</span>
                        </CustomText>
                    </Flex>
                    <Flex>
                        <CustomText
                            sx={{
                                fontSize: "14px",
                                fontWeight: "600",
                                textAlign: "left",
                                padding: "4px 10px",
                            }}
                        >
                            Tiền cược/lựa chọn:{" "}
                            <span className="text-[#f00]">{betChip.toLocaleString()}</span>
                        </CustomText>
                        <CustomText
                            sx={{
                                fontSize: "14px",
                                fontWeight: "600",
                                textAlign: "left",
                                padding: "4px 10px",
                            }}
                        >
                            Tổng tiền:{" "}
                            <span className="text-[#f00]">{totalChip.toLocaleString()}</span>
                        </CustomText>
                    </Flex>
                    <Flex>
                        <CustomText
                            sx={{
                                fontSize: "14px",
                                fontWeight: "600",
                                textAlign: "left",
                                padding: "4px 10px",
                            }}
                        >
                            Tỉ lệ trung bình :{" "}
                            <span className="text-[#f00]">{prizeRate}</span>
                        </CustomText>
                        <CustomText
                            sx={{
                                fontSize: "14px",
                                fontWeight: "600",
                                textAlign: "left",
                                padding: "4px 10px",
                            }}
                        >
                            Tiền thắng:{" "}
                            <span className="text-[#000]">{totalPrize.toLocaleString()}</span>
                        </CustomText>
                    </Flex>
                </Box>
                <Flex sx={{gap: "10px", justifyContent: "center", padding: "10px"}}>
                    <ButtonCancel
                        sx={{borderRadius: "3px", width: "40%"}}
                        onClick={() => {
                            setBetChip(0);
                            setDrawCount(1);
                        }}
                    >
                        Xóa
                    </ButtonCancel>
                    <ButtonConfirm
                        disabled={disabled || betChip <= 0 || numbers.length === 0}
                        onClick={handleConfirm}
                        sx={{borderRadius: "3px", width: "60%", color: "#fff"}}
                    >
                        {disabled && betChip > 0 ? "Đang xử lý..." : "Xác nhận"}
                    </ButtonConfirm>
                </Flex>
            </FlexReverse>
        </Dialog>
    );
};

export default memo(ConfirmMobile);
