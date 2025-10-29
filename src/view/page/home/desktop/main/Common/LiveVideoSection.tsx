import React, { useState } from 'react';

interface LiveVideoSectionProps {
    balls: Array<{
        tube: number;
        number: string;
        color: string;
    }>;
    isLeaderboardHovered: boolean;
    onLeaderboardHoverChange: (isHovered: boolean) => void;
}

const LiveVideoSection: React.FC<LiveVideoSectionProps> = ({
    balls,
    isLeaderboardHovered,
    onLeaderboardHoverChange
}) => {
    return (
        <div id="divLive" className="block relative w-[800px] pb-2 text-black text-base font-normal text-left opacity-100 overflow-visible transition-all">
            <div id="LiveAtShow" className="block relative w-[800px] h-[373px] bg-[#cccccc] text-black text-base font-normal text-center opacity-100 overflow-hidden transition-all">
                {/* Ball List */}
                <ul id="ulAtBallList" className="block absolute top-[275px] right-[117px] bottom-[60px] left-[318px] w-[365px] h-[38px] text-black text-base font-normal text-center z-[1] opacity-100 overflow-visible transition-all">
                    {balls.map((ball, index) => (
                        <li 
                            key={`ball_${index}`}
                            id={`liAtBall_${ball.tube - 1}`} 
                            className="block static w-[38px] h-[38px] mr-[35px] pr-[1px] text-black text-[21px] font-bold leading-[38px] text-center opacity-100 overflow-visible transition-all float-left bg-cover bg-no-repeat" 
                            style={{ 
                                backgroundImage: `url('https://cuvnae.gs5168.com/images/graph/ball/anyTimeLive/${ball.color}${ball.number}.png')`,
                                backgroundSize: "100%" 
                            }}
                        >
                        </li>
                    ))}
                </ul>

                {/* Video Wraps */}
                <div id="divVideoWraps" className="block absolute top-[3px] right-[3px] bottom-[30px] left-[160px] w-[360px] h-[75px] mx-[138.5px] border-[6px] border-solid border-[#2b2b2b] rounded-[3px] text-black text-base font-normal text-center z-[1] opacity-100 overflow-visible transition-all">
                    <div className="ball_content block static w-[349px] h-[63px] -mr-[1px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all">
                        {/* Ball Items */}
                        <div className="ball_item block relative w-[65px] h-[63px] mr-[6px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all float-left">
                            <div className="ball_itemT block absolute top-[37px] left-[39px] border-[13px] border-solid border-t-transparent border-b-black border-l-transparent border-r-transparent text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible transition-all">
                                <span className="float_T block absolute -right-[14px] -bottom-[13px] -left-[6.67px] w-[20.67px] h-[13px] text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible scale-[0.8] transition-all">C.N</span>
                            </div>
                            <div className="ballLine block absolute -right-[6px] left-[65px] w-[6px] h-[63px] bg-[#2b2b2b] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all"></div>
                        </div>
                        <div className="ball_item block relative w-[65px] h-[63px] mr-[6px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all float-left">
                            <div className="ball_itemT block absolute top-[37px] left-[39px] border-[13px] border-solid border-t-transparent border-b-black border-l-transparent border-r-transparent text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible transition-all">
                                <span className="float_T02 block absolute -right-[10px] -bottom-[13px] left-[1.33px] w-[8.67px] h-[13px] text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible scale-[0.8] transition-all">N</span>
                            </div>
                            <div className="ballLine block absolute -right-[6px] left-[65px] w-[6px] h-[63px] bg-[#2b2b2b] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all"></div>
                        </div>
                        <div className="ball_item block relative w-[65px] h-[63px] mr-[6px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all float-left">
                            <div className="ball_itemT block absolute top-[37px] left-[39px] border-[13px] border-solid border-t-transparent border-b-black border-l-transparent border-r-transparent text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible transition-all">
                                <span className="float_T02 block absolute -right-[10px] -bottom-[13px] left-[2.66px] w-[7.34px] h-[13px] text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible scale-[0.8] transition-all">T</span>
                            </div>
                            <div className="ballLine block absolute -right-[6px] left-[65px] w-[6px] h-[63px] bg-[#2b2b2b] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all"></div>
                        </div>
                        <div className="ball_item block relative w-[65px] h-[63px] mr-[6px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all float-left">
                            <div className="ball_itemT block absolute top-[37px] left-[39px] border-[13px] border-solid border-t-transparent border-b-black border-l-transparent border-r-transparent text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible transition-all">
                                <span className="float_T02 block absolute -right-[10px] -bottom-[13px] left-[1.33px] w-[8.67px] h-[13px] text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible scale-[0.8] transition-all">C</span>
                            </div>
                            <div className="ballLine block absolute -right-[6px] left-[65px] w-[6px] h-[63px] bg-[#2b2b2b] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all"></div>
                        </div>
                        <div className="ball_item block relative w-[65px] h-[63px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all float-left">
                            <div className="ball_itemT block absolute top-[37px] left-[39px] border-[13px] border-solid border-t-transparent border-b-black border-l-transparent border-r-transparent text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible transition-all">
                                <span className="float_T block absolute -right-[14px] -bottom-[13px] -left-[2.67px] w-[16.67px] h-[13px] text-white text-xs font-normal leading-[13px] text-center opacity-100 overflow-visible scale-[0.8] transition-all">ĐV</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance Mask */}
                <div id="divMaintainMask" className="static w-full h-full text-black text-base font-normal text-center opacity-100 overflow-visible transition-all bg-cover bg-no-repeat" style={{ backgroundImage: "url('https://cuvnae.gs5168.com/images/vn/anyTime/pic_EqMaintenance_VN_w800.jpg')" }}></div>

                {/* Live Loading */}
                <div id="divLiveLoading" className="table absolute w-[800px] h-[373px] bg-black text-black text-base font-normal text-center opacity-100 overflow-visible transition-all">
                    <div className="loadVideo_in table-cell static w-[480px] h-[373px] px-[160px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all align-middle">
                        <div className="bg_loadVideo block relative -top-[15px] bottom-[15px] w-[140px] h-[70px] mx-[170px] text-black text-base font-normal text-center z-0 opacity-100 overflow-visible transition-all">
                            <img className="loadVideo_logo block absolute w-[84px] h-[42px] m-[14px_28px] text-black text-base font-normal text-center opacity-100 overflow-clip transition-all" src="https://cuvnae.gs5168.com/images/graph/common/logoLightLoading.png" alt="Loading" />
                        </div>
                        <div id="loadVideo_text_1" className="loadVideo_text block relative -top-[15px] bottom-[15px] w-[480px] h-[18px] mt-[8px] text-white text-base font-normal text-center z-0 opacity-100 overflow-visible transition-all" style={{ textShadow: "rgba(255, 255, 255, 0.3) 0px 0px 1px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 10px" }}>
                            Đang tải video
                        </div>
                        <div id="loadVideo_text_2" className="loadVideo_text relative bottom-[15px] mt-[8px] text-white text-base font-normal text-center z-0 opacity-100 overflow-visible transition-all" style={{ textShadow: "rgba(255, 255, 255, 0.3) 0px 0px 1px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 10px" }}>
                            Video đang chuyển đường truyền
                        </div>
                    </div>
                </div>

                {/* Video Canvas */}
                <canvas id="video-canvas" className="video static w-[800px] h-[343px] text-black text-base font-normal text-center opacity-100 overflow-clip transition-all"></canvas>

                {/* SLDP Player */}
                <div id="sldp-player" className="block static w-[800px] h-[343px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all scale-y-[1.14]">
                    <div className="sldp_player_wrp sldp_player_wrp_video inline-block relative w-[800px] h-[345px] bg-black text-black text-base font-normal text-center opacity-100 overflow-visible transition-all">
                        <video src="blob:https://cuvnae.gs5168.com/d6c4bd5c-d80f-4044-8ef4-91b50fbdce80" className="inline static w-[800px] h-[345px] text-black text-base font-normal text-center opacity-100 overflow-clip transition-all"></video>
                    </div>
                </div>

                {/* Mute Block */}
                <div id="divMuteBlock" className="muteBlock absolute w-full h-full bg-black bg-opacity-60 text-white text-base font-normal leading-[340px] text-center opacity-100 overflow-visible transition-all">
                    Vui lòng nhấn vào màn hình để bật tiếng!
                </div>

                {/* Video Block */}
                <div id="divBlock" className="videoblock table absolute w-[800px] h-[373px] text-black text-base font-normal text-center opacity-100 overflow-visible transition-all"></div>
            </div>

            {/* Bottom Menu */}
            <div className="view_btmMenu block absolute top-[343px] bottom-[373px] w-[800px] h-[30px] bg-[#1e1e1e] text-black text-base font-normal text-left opacity-100 overflow-visible transition-all">
                {/* Video Change */}
                <div id="divVideoChg" className="view_chg block static h-[30px] px-[10px] border-r border-[#555555] text-white text-[15px] font-normal leading-[30px] text-left opacity-100 overflow-visible transition-all float-left w-[172px]">
                    <span className="block static w-[38.09px] h-[30px] mr-[8px] text-white text-[15px] font-normal leading-[30px] text-left opacity-100 overflow-visible transition-all float-left">Video</span>
                    <input type="button" data-chg="1" className="on inline-block static w-[50px] h-[20px] mt-[5px] rounded-[2px] bg-[#379bff] text-white text-[13.33px] font-normal leading-[20px] text-center opacity-100 overflow-clip transition-all cursor-pointer mr-1" value="Xa" />
                    <input type="button" data-chg="2" className="inline-block static w-[50px] h-[20px] mt-[5px] rounded-[2px] bg-[#656565] text-white text-[13.33px] font-normal leading-[20px] text-center opacity-100 overflow-clip transition-all cursor-pointer" value="Gần" />
                </div>

                {/* Live Line */}
                <div id="divLiveLine" className="view_line block static w-[198px] h-[30px] px-[10px] border-r border-[#555555] text-white text-[15px] font-normal leading-[30px] text-left opacity-100 overflow-visible transition-all float-left">
                    <img src="https://cuvnae.gs5168.com/images/graph/common/btn_webLine.svg" className="block static w-[22px] h-[22px] mt-[3px] mr-[5px] text-white text-[15px] font-normal leading-[30px] text-left opacity-45 overflow-clip transition-all float-left" alt="Line" />
                    <input type="button" data-line="vn01.bwo1777.com:8881" value="1" className="block static w-[20px] h-[20px] mt-[5px] ml-[5px] rounded-[2px] bg-[#656565] text-white text-base font-normal leading-[21px] text-center opacity-100 overflow-clip transition-all cursor-pointer float-left" />
                    <input type="button" data-line="vn02.bwo1777.com:8881" value="2" className="on block static w-[20px] h-[20px] mt-[5px] ml-[5px] rounded-[2px] bg-[#f5a13e] text-white text-base font-normal leading-[21px] text-center opacity-100 overflow-clip transition-all cursor-pointer float-left" />
                    <input type="button" data-line="vn03.bwo1777.com:8881" value="3" className="block static w-[20px] h-[20px] mt-[5px] ml-[5px] rounded-[2px] bg-[#656565] text-white text-base font-normal leading-[21px] text-center opacity-100 overflow-clip transition-all cursor-pointer float-left" />
                    <input type="button" data-line="vn04.bwo1777.com:8881" value="4" className="block static w-[20px] h-[20px] mt-[5px] ml-[5px] rounded-[2px] bg-[#656565] text-white text-base font-normal leading-[21px] text-center opacity-100 overflow-clip transition-all cursor-pointer float-left" />
                    <input type="button" data-line="vn05.bwo1777.com:8881" value="5" className="block static w-[20px] h-[20px] mt-[5px] ml-[5px] rounded-[2px] bg-[#656565] text-white text-base font-normal leading-[21px] text-center opacity-100 overflow-clip transition-all cursor-pointer float-left" />
                    <input type="button" data-line="vn06.bwo1777.com:8881" value="6" className="block static w-[20px] h-[20px] mt-[5px] ml-[5px] rounded-[2px] bg-[#656565] text-white text-base font-normal leading-[21px] text-center opacity-100 overflow-clip transition-all cursor-pointer float-left" />
                </div>

                {/* Sound Settings */}
                <div className="viewSet_Sound block static left-[398px] w-[43px] h-[29px] border-r border-[#555555] text-black text-base font-normal text-left opacity-100 overflow-visible transition-all float-left">
                    <ul id="ulSoundBtn" className="viewSet_L block static w-[42px] h-[29px] text-black text-base font-normal text-left opacity-100 overflow-visible transition-all float-right">
                        <li id="liCtrlVolume" className="flashSound list-item relative w-[42px] h-[29px] text-black text-base font-normal text-left opacity-100 overflow-visible transition-all cursor-pointer float-left">
                            <div className="icon_volume mute block absolute w-[22px] h-[22px] m-[3.5px_10px] bg-no-repeat bg-center opacity-45 overflow-visible transition-all cursor-pointer" style={{ backgroundImage: "url('https://cuvnae.gs5168.com/images/graph/common/btn_speaker_mute.svg')", backgroundSize: "100% 200%", backgroundPosition: "50% 100%" }}></div>
                        </li>
                    </ul>
                </div>

                {/* Phone */}
                <div className="view_phone static px-[10px] text-[#ffe200] text-base font-normal leading-[30px] text-left tracking-[2px] opacity-100 overflow-visible transition-all float-left"></div>

                {/* View Set */}
                <div
                    id="liLeaderboard"
                    className="leaderboard absolute right-3 h-[29px] text-black text-base font-normal text-left opacity-100 overflow-visible transition-all cursor-pointer flex items-center justify-center"
                    onMouseEnter={() => onLeaderboardHoverChange(true)}
                    onMouseLeave={() => onLeaderboardHoverChange(false)}
                >
                    <img src="https://cuvnae.gs5168.com/images/graph/common/btn_leaderboard.png" className="block w-[23px] h-[23px]" alt="leaderboard" />
                    {isLeaderboardHovered && (
                        <div className="t_btnName board absolute bottom-[30px] px-[5px] rounded-[4px] bg-white text-[#333333] text-xs font-normal leading-[23px] text-left z-[6] opacity-100 overflow-visible transition-all cursor-pointer whitespace-nowrap">
                            Xếp hạng
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveVideoSection; 