import React from 'react';

interface LiveGameSectionProps {
    gameId?: string;
    videoId?: string;
    gameKind?: string;
    onVolumeToggle?: () => void;
    onViewToggle?: () => void;
    onLineChange?: (line: string) => void;
    onRankClick?: () => void;
}

const LiveGameSection: React.FC<LiveGameSectionProps> = ({
    gameId = "1",
    videoId = "1",
    gameKind = "166",
    onVolumeToggle,
    onViewToggle,
    onLineChange,
    onRankClick
}) => {
    return (
        <div className="LiveArea block relative h-[199px] border-0 text-black text-base font-normal text-left overflow-hidden opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all">
            {/* Live Video Container */}
            <div 
                id={`divLiveVideo_${gameId}`} 
                className="LiveVideo block absolute w-[380px] h-[199px] border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
            >
                {/* Loading Screen */}
                <div 
                    id={`divLiveLoading_${gameId}`} 
                    className="loadVideo absolute w-full h-full border-0 bg-black text-black text-base font-normal text-left overflow-visible z-0 opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                >
                    <div className="table static w-full h-full border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                        <div className="loadVideo_in table-cell relative px-[20%] border-0 text-black text-base font-normal text-center overflow-visible z-[1] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all align-middle">
                            <div className="bg_loadVideo block relative w-[140px] h-[70px] mx-auto border-0 text-black text-base font-normal text-center overflow-visible z-0 opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                                <img 
                                    className="loadVideo_logo block absolute w-[60%] h-[60%] border-0 text-black text-base font-normal text-center overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all" 
                                    src="https://cuvncw.yuehanzkj.com/images/graph/common/logoLightLoading.png" 
                                    alt="Loading"
                                />
                            </div>
                            <div 
                                id={`loadVideo_text_${gameId}_1`} 
                                className="loadVideo_text block static mt-[5px] border-0 text-white text-[14.4px] font-normal text-center overflow-visible z-0 opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                                style={{
                                    textShadow: 'rgba(255, 255, 255, 0.3) 0px 0px 1px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 10px'
                                }}
                            >
                                Đang tải video
                            </div>
                            <div 
                                id={`loadVideo_text_${gameId}_2`} 
                                className="loadVideo_text static mt-[5px] border-0 text-white text-[14.4px] font-normal text-center overflow-visible z-0 opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                                style={{
                                    textShadow: 'rgba(255, 255, 255, 0.3) 0px 0px 1px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 10px'
                                }}
                            >
                                Video đang chuyển đường truyền
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game Video Item */}
                <div 
                    id={`divGameVideoItem_${gameId}`} 
                    className="block static w-[380px] border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                >
                    {/* Video Controls */}
                    <div 
                        id={`videoCtrl_${gameKind}`} 
                        className="videoCtrl flex absolute top-[199px] -bottom-[40px] w-[380px] h-[40px] border-0 text-black text-base font-normal text-left overflow-visible z-[2] opacity-100 visible box-content flex-row flex-nowrap justify-between flex-none"
                        style={{ transition: '0.2s ease-in-out' }}
                    >
                        {/* Left Controls */}
                        <div className="vcLeft flex static w-[190px] h-[40px] border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                            <div 
                                className="btn_volControl mute block relative w-[50px] h-[40px] border-0 text-black text-base font-normal text-left overflow-visible z-0 opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all cursor-pointer"
                                onClick={onVolumeToggle}
                            ></div>
                            <div 
                                id={`view_${gameKind}`} 
                                className="btn_view btn_zoomOut block relative w-[50px] h-[40px] border-0 text-black text-base font-normal text-left overflow-visible z-0 opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all cursor-pointer"
                                onClick={onViewToggle}
                            ></div>
                        </div>

                        {/* Right Controls */}
                        <div className="vcRight flex static w-[190px] h-[40px] border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-end flex-none transition-all">
                            <div 
                                className="btn_webLine block relative w-[50px] h-[40px] border-0 text-black text-base font-normal text-left overflow-visible z-0 opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all cursor-pointer"
                                onClick={() => onLineChange?.('webLine')}
                            ></div>
                            <div 
                                className="btn_rank block relative w-[50px] h-[40px] border-0 text-black text-base font-normal text-left overflow-visible z-0 opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all cursor-pointer"
                                onClick={onRankClick}
                            ></div>
                        </div>
                    </div>

                    {/* Maintenance Mask */}
                    <div 
                        id={`divMaintainMask_${gameKind}`} 
                        className="LiveMaintainShow absolute w-full h-full border-0 text-black text-base font-normal text-left overflow-visible z-[2] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                    ></div>

                    {/* Live Info */}
                    <div 
                        id={`LiveInfo_${gameKind}`} 
                        className="liveInfo block absolute bottom-[199px] left-[380px] border-0 bg-[rgb(204,204,204)] text-black text-base font-normal text-center overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                    >
                        {/* Result Box */}
                        <div 
                            id={`divResultBox_${gameKind}`} 
                            className="AnyTimeBall block absolute top-[5px] -bottom-[30px] -left-[150px] w-[150px] h-[25px] border-0 text-black text-base font-normal text-center overflow-visible z-[1] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                        >
                            {/* Ball List */}
                            <div className="liveBall_list block static w-[25px] h-[25px] px-[2.5px] border-0 text-black text-base font-normal text-center overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all">
                                <img 
                                    id={`imgBall_${gameKind}_4`} 
                                    src="https://cuvncw.yuehanzkj.com/images/graph/ball/anyTimePoker/img_ATP8.svg" 
                                    className="block static w-[25px] h-[25px] border-0 text-black text-base font-normal text-center overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                                />
                            </div>
                            <div className="liveBall_list block static w-[25px] h-[25px] px-[2.5px] border-0 text-black text-base font-normal text-center overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all">
                                <img 
                                    id={`imgBall_${gameKind}_3`} 
                                    src="https://cuvncw.yuehanzkj.com/images/graph/ball/anyTimePoker/img_ATP9.svg" 
                                    className="block static w-[25px] h-[25px] border-0 text-black text-base font-normal text-center overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                                />
                            </div>
                            <div className="liveBall_list block static w-[25px] h-[25px] px-[2.5px] border-0 text-black text-base font-normal text-center overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all">
                                <img 
                                    id={`imgBall_${gameKind}_2`} 
                                    src="https://cuvncw.yuehanzkj.com/images/graph/ball/anyTimePoker/img_ATP7.svg" 
                                    className="block static w-[25px] h-[25px] border-0 text-black text-base font-normal text-center overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                                />
                            </div>
                            <div className="liveBall_list block static w-[25px] h-[25px] px-[2.5px] border-0 text-black text-base font-normal text-center overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all">
                                <img 
                                    id={`imgBall_${gameKind}_1`} 
                                    src="https://cuvncw.yuehanzkj.com/images/graph/ball/anyTimePoker/img_ATP3.svg" 
                                    className="block static w-[25px] h-[25px] border-0 text-black text-base font-normal text-center overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                                />
                            </div>
                            <div className="liveBall_list block static w-[25px] h-[25px] px-[2.5px] border-0 text-black text-base font-normal text-center overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all">
                                <img 
                                    id={`imgBall_${gameKind}_0`} 
                                    src="https://cuvncw.yuehanzkj.com/images/graph/ball/anyTimePoker/img_ATP2.svg" 
                                    className="block static w-[25px] h-[25px] border-0 text-black text-base font-normal text-center overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                                />
                            </div>
                        </div>
                      
                    </div>
                </div>

                {/* Video Canvas */}
                <canvas 
                    id={`video-canvas_${gameId}`} 
                    className="video static w-full h-full border-0 text-black text-base font-normal text-left overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                ></canvas>

                {/* SLDP Player */}
                <div 
                    id={`sldp-player_${gameId}`} 
                    className="style_anyTimePoker block static w-[380px] h-[199px] pb-[140px] border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                    style={{ transform: 'matrix(1.51, 0, 0, 1, 0, 0)' }}
                >
                    <div className="sldp_player_wrp sldp_player_wrp_video inline-block relative w-[380px] h-[199px] border-0 bg-black text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                        <video 
                            src="blob:https://cuvncw.yuehanzkj.com/81ceb2c5-ea9b-41a5-bbc6-0da73033bd85" 
                            className="inline static w-[380px] h-[199px] border-0 text-black text-base font-normal text-left overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                        ></video>
                    </div>
                </div>

                {/* Video Block */}
                <div 
                    id={`divBlock_${gameId}`} 
                    className="videoblock table absolute w-[380px] h-[199px] border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                ></div>

                {/* Mute Block */}
                <div 
                    id={`divMuteBlock_${gameId}`} 
                    className="muteBlock absolute w-full h-full border-0 bg-black bg-opacity-60 text-white text-base font-normal leading-[200px] text-center overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                >
                    Vui lòng nhấn vào màn hình để bật tiếng!
                </div>
            </div>

            {/* Live Movie */}
            <div 
                id={`divLiveMovie_${gameId}`} 
                className="LiveVideo absolute w-[380px] h-[199px] border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
            >
                <iframe 
                    id={`ifrMoive_${gameId}`} 
                    src="about:blank" 
                    name="frame" 
                    scrolling="no" 
                    className="block static w-full h-full border-0 text-black text-base font-normal text-left overflow-clip opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                ></iframe>
            </div>
        </div>
    );
};

export default LiveGameSection; 