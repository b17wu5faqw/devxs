import React, { useState, useEffect } from 'react';

interface LeftHeaderProps {
    gameTitle?: string;
    currentRound?: string;
    onGameChange?: (gameKind: string) => void;
    countdown?: { minutes: number; seconds: number };
}

const LeftHeader: React.FC<LeftHeaderProps> = ({
    gameTitle = "Live A",
    currentRound = "0147",
    onGameChange,
    countdown = { minutes: 1, seconds: 24 }
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [timer, setTimer] = useState(countdown);

    const gameOptions = [
        { kind: "166", label: "Live A", hidden: true },
        { kind: "162", label: "Lotto A", hidden: true },
        { kind: "164", label: "Lotto C", hidden: false },
        { kind: "211", label: "1-M A", hidden: false },
        { kind: "212", label: "1-M B", hidden: false },
        { kind: "234", label: "5D - 30 giây", hidden: false },
        { kind: "172", label: "5D - 1 phút", hidden: true },
        { kind: "179", label: "Cầu Môn KU", hidden: false },
        { kind: "174", label: "F3 KU", hidden: false },
        { kind: "168", label: "PK10 KU", hidden: false },
        { kind: "156", label: "Đua xe KU", hidden: false },
        { kind: "233", label: "Đ.Ngựa-30S", hidden: false },
        { kind: "171", label: "Đ.Ngựa-1M", hidden: false },
        { kind: "175", label: "Ship KU", hidden: false },
        { kind: "214", label: "PK10 BCT", hidden: false }
    ];

    const handleGameSelect = (gameKind: string) => {
        setIsDropdownOpen(false);
        onGameChange?.(gameKind);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Timer countdown effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { minutes: prev.minutes - 1, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);



    return (
        <div className="h-[34px] px-[5px] border-r border-[rgb(142,200,254)] relative leading-6">
            {/* Game Title and Round Info - Left Side */}
            <div className="float-left flex items-center h-[28px]">
                <span className="text-[13px] text-white mr-[10px]">{gameTitle}</span>
                <span className="text-[13px] text-white mr-[5px]">Kỳ</span>
                <span className="text-[13px] text-[rgb(255,234,0)]">{currentRound}</span>
            </div>
            
            {/* Timer Display - Center */}
            <div className="absolute left-[50%] h-full transform -translate-x-1/2 flex items-center">
                <div 
                    className="block w-[40px] h-[28px] leading-[28px] text-center text-[24px] font-bold text-black"
                    style={{
                        background: "url(/images/common/bg_time.svg) no-repeat center",
                        backgroundSize: "100%"
                    }}
                >
                    {timer.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-white text-center w-[18px] h-[38px] font-bold text-[24px]">
                    :
                </div>
                <div 
                    className="block w-[40px] h-[28px] leading-[28px] text-center text-[24px] font-bold text-black"
                    style={{
                        background: "url(/images/common/bg_time.svg) no-repeat center",
                        backgroundSize: "100%"
                    }}
                >
                    {timer.seconds.toString().padStart(2, "0")}
                </div>
            </div>
            
            {/* Action Buttons - Right Side */}
            <div className="float-right flex items-center h-[28px] gap-[7px]">
                <input 
                    type="button" 
                    value="Vào" 
                    onClick={() => console.log('Enter game')}
                    className="w-[47px] h-[22px] px-[6px] py-[1px] border-0 rounded-[5px] bg-[rgb(0,147,83)] text-white text-[13.33px] leading-[22px] text-center cursor-pointer"
                />
                <input 
                    type="button" 
                    value="Đổi" 
                    onClick={toggleDropdown}
                    className="w-[47px] h-[22px] px-[6px] py-[1px] border-0 rounded-[5px] bg-[rgb(235,119,119)] text-white text-[13.33px] leading-[22px] text-center cursor-pointer"
                />
            </div>
            
            {/* Dropdown for game selection */}
            <div 
                className={`absolute top-[29px] left-[-5px] w-[380px] bg-opacity-80 text-white text-[14px] leading-6 z-[3] ${isDropdownOpen ? 'block' : 'hidden'}`} 
                data-table="166"
            >
                <ul className="pt-[12px] pr-[12px] clearfix">
                    {gameOptions.map((game) => (
                        <li 
                            key={game.kind}
                            className={`${game.hidden ? 'hidden' : 'w-[31%] h-[27px] mb-[8px] ml-[6px] border border-white rounded-[15px] text-center leading-[27px] float-left cursor-pointer hover:bg-white hover:bg-opacity-20'}`}
                            data-kind={game.kind}
                            onClick={() => handleGameSelect(game.kind)}
                        >
                            {game.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LeftHeader; 