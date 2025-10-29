import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../../../utils/FlexReverse";
import { useState } from "react";

function PopupLottoKUMenuMobile() {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.MENU_MOBILE)
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
  const [activeTab, setActiveTab] = useState("LIVE");

  const handleClose = () => {
    closeModal();
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleGameClick = (gameTitle: string, url: string) => {
    closeModal();
    openModal(MODAL.ANYTIME_KU_MOBILE, { gameTitle });
  };

  return (
    <>
      <style>
        {`
          .Game_menuT_Text {
            position: relative;
          }
          .Game_menuT_Text:before {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: #000;
            top: 50%;
            left: -8px;
            transform: translate(-100%, -50%);
          }
          
          /* Enhanced image quality styles */
          .{
            image-rendering: -webkit-optimize-contrast;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
            image-rendering: pixelated;
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            -ms-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-transform: translateZ(0);
            -moz-transform: translateZ(0);
            -ms-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-font-smoothing: subpixel-antialiased;
            -moz-osx-font-smoothing: auto;
            image-rendering: high-quality;
            image-rendering: -webkit-crisp-edges;
            image-rendering: -moz-crisp-edges;
            image-rendering: -o-crisp-edges;
            max-width: 100%;
            height: auto;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
          }
          
          .not([src*=".svg"]) {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
          
          .src*=".svg"] {
            image-rendering: auto;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        `}
      </style>
      <Dialog
        PaperProps={{
          sx: {
            borderRadius: "8px",
            width: { xs: "100vw", md: "348px" },
            maxHeight: { xs: "100dvh", md: "90vh" },
            background:
              "linear-gradient(137.93deg, rgba(97,206,255,.024) 7.21%,#f6faff 49.31%,rgba(97,206,255,.024) 96.05%),#fff",
            position: "relative",
            overflow: "unset",
            margin: "13.750px",
          },
        }}
        open={isOpen}
        TransitionComponent={Grow}
        onClose={handleClose}
      >
        <Box
          onClick={handleClose}
          sx={{
            background: "url(https://cuvncf.qiabbkj.com/images/graph/common/Pop_btn_close.svg) no-repeat center",
            position: "absolute",
            top: "-40px",
            right: "5px",
            width: "30px",
            height: "30px",
            backgroundSize: "100%",
            cursor: "pointer",
            opacity: "0.8",
          }}
        />
        <FlexReverse
          sx={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {/* Header with tabs */}
          <div className=" w-full h-[50px] border-0 bg-[#206B61] text-white text-base font-bold text-center leading-10 overflow-hidden rounded-t-[8px]">
            <ul className="w-full border-0 text-white text-base font-bold text-center leading-10 list-none grid grid-cols-3 h-full">
              <li 
                className={`relative h-10 border-0 text-white text-[19.2px] font-bold text-center leading-10 float-left cursor-pointer ${activeTab === 'LIVE' ? 'opacity-100' : 'opacity-80'}`}
                onClick={() => handleTabClick('LIVE')}
              >
                LIVE
                {activeTab === 'LIVE' && (
                  <span 
                    className="absolute left-0 right-0 bottom-[5px] mx-auto w-[64%] h-[3px] bg-white"
                  />
                )}
              </li>
              <li 
                className={`relative h-10 border-0 text-white text-[19.2px] font-bold text-center leading-10 float-left cursor-pointer ${activeTab === 'BCT / RNG' ? 'opacity-100' : 'opacity-80'}`}
                onClick={() => handleTabClick('BCT / RNG')}
              >
                BCT / RNG
                {activeTab === 'BCT / RNG' && (
                  <span 
                    className="absolute left-0 right-0 bottom-[5px] mx-auto w-[64%] h-[3px] bg-white"
                  />
                )}
              </li>
              <li 
                className={`relative h-10 border-0 text-white text-[19.2px] font-bold text-center leading-10 float-left cursor-pointer ${activeTab === 'Trang chủ' ? 'opacity-100' : 'opacity-80'}`}
                onClick={() => handleTabClick('Trang chủ')}
              >
                Trang chủ
                {activeTab === 'Trang chủ' && (
                  <span 
                    className="absolute left-0 right-0 bottom-[5px] mx-auto w-[64%] h-[3px] bg-white"
                  />
                )}
              </li>
            </ul>
          </div>

          {/* Content area */}
          <div className="block  w-full max-h-[396.9px] mb-3.5 px-2.5 border-0 rounded-b-lg bg-white text-black text-base text-center overflow-hidden overflow-y-auto">
            {activeTab === 'LIVE' && (
              <div className="block">
                {/* Lotto KU Section */}
                <div className="Game_menuT_Text block relative w-full h-4 mt-2.5 ml-8 text-black text-sm font-bold text-left">
                  Lotto KU
                </div>
                <div className="block  w-full">
                  {/* Lotto A */}
                  <div 
                    className="flex relative w-full h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                    onClick={() => handleGameClick('Lotto A', '/game/aspx/anyTime/AnyTime_m.aspx?gIndex=0')}
                  >
                    <div className="block relative w-[133.234px] h-[69px] border-0 text-sm text-center float-left">
                      <img 
                        src="https://cuvncf.qiabbkj.com/images/graph/common/bannerA.png" 
                        className="block w-[106.078px] h-[69px] mx-3.5 border-0 overflow-clip"
                        alt="Lotto A"
                        loading="eager"
                        decoding="sync"
                      />
                      <span className="absolute w-[70%] h-5 max-w-[100px] border-0 rounded-[30px] text-white text-[10.08px] text-center opacity-0 flex justify-start items-center">
                      </span>
                    </div>
                    <div className="block  w-[142.75px] h-10 pl-[21.8594px] border-0 text-sm text-center float-right">
                      <div className="table  w-[49.8594px] h-5 px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                        Lotto A
                      </div>
                      <div className="table  w-[44.0469px] h-5 px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                        <div className="block  w-[44.0469px] h-5 border-0 text-[#148647] text-sm text-left leading-5">
                          01 : 01
                        </div>
                        <div className=" mx-0.5 border-0 text-red-500 text-sm text-left leading-5 hidden">
                          Đóng
                        </div>
                      </div>
                      <div className=" h-5 mt-0.5 ml-1 py-[1%] px-[6%] border-2 border-[#ff9500] rounded-[15px] bg-black/70 text-[#ffbf00] text-[11.52px] text-left leading-5 whitespace-nowrap hidden">
                        <img src="https://cuvncf.qiabbkj.com/images/graph/main/icon_maintain_m.svg" className="inline w-3.5 mr-1.5 border-0 text-[11.52px] text-left leading-5 whitespace-nowrap overflow-clip align-top" alt="maintain" loading="eager" decoding="sync" />
                        <span className="inline  border-0 text-[#ffbf00] text-[11.52px] text-left leading-5 whitespace-nowrap"></span>
                      </div>
                    </div>
                  </div>

                  {/* Lotto C */}
                  <div 
                    className="flex relative w-full h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#d2d9f2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                    onClick={() => handleGameClick('Lotto C', '/game/aspx/anyTime/AnyTime_m.aspx?gIndex=2')}
                  >
                    <div className="block relative w-[133.234px] h-[69px] border-0 text-sm text-center float-left">
                      <img 
                        src="https://cuvncf.qiabbkj.com/images/graph/common/bannerC.png" 
                        className="block w-[106.078px] h-[69px] mx-3.5 border-0 overflow-clip"
                        alt="Lotto C"
                        loading="eager"
                        decoding="sync"
                      />
                      <span className="block absolute top-[49px] w-[93.25px] h-5 max-w-[100px] mx-5 ml-5 border-0 rounded-[30px] bg-[#7678cd] text-white text-[10.08px] text-center flex justify-start items-center">
                        <img src="https://cuvncf.qiabbkj.com/images/graph/main/icon_Ind.png" className="block absolute right-[73.25px] w-5 h-5 border-0 text-white text-[10.08px] text-center overflow-clip" alt="Indonesia" loading="eager" decoding="sync" />
                        <span className="flex  w-[83.9219px] h-5 ml-[9.3125px] border-0 text-white text-[10.08px] text-center justify-center items-center">
                          Ralin
                        </span>
                      </span>
                    </div>
                    <div className="block  w-[142.75px] h-[49.8438px] pl-[21.8594px] border-0 text-sm text-center float-right">
                      <div className="table  w-[50.3906px] h-5 px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                        Lotto C
                      </div>
                      <div className=" h-5 px-1 border-0 rounded-[50px] text-sm text-left leading-5 hidden">
                        <div className="block  border-0 text-red-500 text-sm text-left leading-5"></div>
                        <div className=" mx-0.5 border-0 text-red-500 text-sm text-left leading-5 hidden">
                          Đóng
                        </div>
                      </div>
                      <div className="table  w-[110.922px] h-[26.8438px] mt-0.5 ml-1 py-[1.42188px] px-[8.5625px] border-2 border-[#ff9500] rounded-[15px] bg-black/70 text-[#ffbf00] text-[11.52px] text-left leading-5 whitespace-nowrap">
                        <img src="https://cuvncf.qiabbkj.com/images/graph/main/icon_maintain_m.svg" className="inline w-3.5 h-3.5 mr-1.5 border-0 text-[11.52px] text-left leading-5 whitespace-nowrap overflow-clip align-top" alt="maintain" loading="eager" decoding="sync" />
                        <span className="inline  border-0 text-[#ffbf00] text-[11.52px] text-left leading-5 whitespace-nowrap">
                          04:00 ~ 04:30
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live KU Section */}
                <div className="Game_menuT_Text block relative w-full h-4 mt-2.5 ml-8 text-black text-sm font-bold text-left">
                  Live KU
                </div>
                <div className="block  w-full h-[80px]">
                  {/* Live A */}
                  <div 
                    className="flex relative w-full h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#ecd8dd] text-black text-sm text-center items-center z-[2] cursor-pointer"
                    onClick={() => handleGameClick('Live A', '/game/aspx/anyTimePoker/AnyTimePoker_m.aspx?gIndex=1')}
                  >
                    <div className="block relative w-[133.234px] h-[69px] border-0 text-sm text-center float-left">
                      <img 
                        src="https://cuvncf.qiabbkj.com/images/graph/common/bannerAtPoker_A.png" 
                        className="block w-[106.078px] h-[69px] mx-3.5 border-0 overflow-clip"
                        alt="Live A"
                        loading="eager"
                        decoding="sync"
                      />
                      <span className="block absolute top-[49px] w-[93.25px] h-5 max-w-[100px] mx-5 ml-5 border-0 rounded-[30px] bg-[#f55bb3] text-white text-[10.08px] text-center flex justify-start items-center">
                        <img src="https://cuvncf.qiabbkj.com/images/graph/main/icon_Vietnam.png" className="block absolute right-[73.25px] w-5 h-5 border-0 text-white text-[10.08px] text-center overflow-clip" alt="Vietnam" loading="eager" decoding="sync" />
                        <span className="flex  w-[83.9219px] h-5 ml-[9.3125px] border-0 text-white text-[10.08px] text-center justify-center items-center">
                          Uno
                        </span>
                      </span>
                    </div>
                    <div className="block  w-[142.75px] h-10 pl-[21.8594px] border-0 text-sm text-center float-right">
                      <div className="table  w-[42.6875px] h-5 px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                        Live A
                      </div>
                      <div className="table  w-[44.0469px] h-5 px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                        <div className="block  w-[44.0469px] h-5 border-0 text-[#148647] text-sm text-left leading-5">
                          00 : 34
                        </div>
                        <div className=" mx-0.5 border-0 text-red-500 text-sm text-left leading-5 hidden">
                          Đóng
                        </div>
                      </div>
                      <div className=" h-5 mt-0.5 ml-1 py-[1%] px-[6%] border-2 border-[#ff9500] rounded-[15px] bg-black/70 text-[#ffbf00] text-[11.52px] text-left leading-5 whitespace-nowrap hidden">
                        <img src="https://cuvncf.qiabbkj.com/images/graph/main/icon_maintain_m.svg" className="inline w-3.5 mr-1.5 border-0 text-[11.52px] text-left leading-5 whitespace-nowrap overflow-clip align-top" alt="maintain" loading="eager" decoding="sync" />
                        <span className="inline  border-0 text-[#ffbf00] text-[11.52px] text-left leading-5 whitespace-nowrap"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'BCT / RNG' && (
              <div className="block">
                {/* BCT Section */}
                <div className="Game_menuT_Text block relative mt-[3%] ml-[10%] text-black text-sm font-bold text-left">
                  BCT
                </div>
                <div className="block ">
                  {/* 1-M B */}
                  <div 
                    className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                    onClick={() => handleGameClick('1-M B', '/game/aspx/anyTimeBlock/AnyTimeBlock_m.aspx?gIndex=2&isOpen=true')}
                  >
                    <div className="block relative w-[42%] h-[80px] border-0 text-sm text-center float-left">
                      <img 
                        src="https://cuvncf.qiabbkj.com/images/graph/common/bannerAtBlockB.png" 
                        className="block h-[100%] w-auto border-0 overflow-clip mx-3.5"
                        alt="1-M B"
                        loading="eager"
                        decoding="sync"
                      />
                      <span className="absolute w-[70%] h-5 max-w-[100px] border-0 rounded-[30px] text-white text-[10.08px] text-center opacity-0 flex justify-start items-center">
                      </span>
                    </div>
                    <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                      <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                        1-M B
                      </div>
                      <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                        <div className="block  border-0 text-[#148647] text-sm text-left leading-5">
                          00 : 49
                        </div>
                        <div className=" mx-0.5 border-0 text-red-500 text-sm text-left leading-5 hidden">
                          Đóng
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1-M A */}
                  <div 
                    className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                    onClick={() => handleGameClick('1-M A', '/game/aspx/anyTimeBlock/AnyTimeBlock_m.aspx?gIndex=1&isOpen=true')}
                  >
                    <div className="block relative w-[42%] h-full border-0 text-sm text-center float-left">
                      <img 
                        src="https://cuvncf.qiabbkj.com/images/graph/common/bannerAtBlockA.png" 
                        className="block h-full w-auto border-0 overflow-clip mx-3.5"
                        alt="1-M A"
                        loading="eager"
                        decoding="sync"
                      />
                      <span className="absolute w-[70%] h-5 max-w-[100px] border-0 rounded-[30px] text-white text-[10.08px] text-center opacity-0 flex justify-start items-center">
                      </span>
                    </div>
                    <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                      <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                        1-M A
                      </div>
                      <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                        <div className="block  border-0 text-[#148647] text-sm text-left leading-5">
                          00 : 27
                        </div>
                        <div className=" mx-0.5 border-0 text-red-500 text-sm text-left leading-5 hidden">
                          Đóng
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RNG Section */}
                <div className="Game_menuT_Text block text-black text-sm font-bold text-left mt-[3%] ml-[10%]">
                  RNG
                </div>
                
                {/* 5D - 30 giây */}
                <div 
                  className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                  onClick={() => handleGameClick('5D - 30 giây', '/game/aspx/anyTimeElec/AnyTimeElec_m.aspx?gType=234')}
                >
                  <div className="relative w-[42%] h-full border-0 text-sm text-center flex items-center">
                    <img 
                      src="https://cuvncf.qiabbkj.com/images/graph/main/icon_AnyTimeElec_m.png" 
                      className="block w-auto h-[48.8px] mx-[33.313px] border-0 overflow-clip"
                      alt="5D - 30 giây"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                    <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                      5D - 30 giây
                    </div>
                    <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                      <div className="block  border-0 text-[#148647] text-sm text-left leading-5">
                        00 : 17
                      </div>
                      <div className=" border-0 text-sm text-left leading-5 hidden">
                        Đóng
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5D - 1 phút */}
                <div 
                  className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                  onClick={() => handleGameClick('5D - 1 phút', '/game/aspx/anyTimeElec/AnyTimeElec_m.aspx?gType=172')}
                >
                  <div className="relative w-[42%] h-full border-0 text-sm text-center flex items-center">
                    <img 
                      src="https://cuvncf.qiabbkj.com/images/graph/main/icon_AnyTimeElec_m.png" 
                      className="block w-auto h-[48.8px] mx-[33.313px] border-0 overflow-clip"
                      alt="5D - 1 phút"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                    <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                      5D - 1 phút
                    </div>
                    <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                      <div className="block  border-0 text-sm text-left leading-5">
                        00 : 00
                      </div>
                      <div className=" border-0 text-sm text-left leading-5 hidden">
                        Đóng
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Trang chủ' && (
              <div className="block">
                {/* Official Games */}
                <div 
                  className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                  onClick={() => handleGameClick('Xổ số Lào', '/game/aspx/thLottoLaodl/ThLottoLaodl_m.aspx')}
                >
                  <div className="flex items-center relative w-[42%] h-full border-0 text-sm text-center float-left">
                    <img 
                      src="https://cuvncf.qiabbkj.com/images/graph/main/icon_LaoLotto_pc.png" 
                      className="block border-0 overflow-clip h-[46px] mx-[45.609px]"
                      alt="Xổ số Lào"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                    <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                      Xổ số Lào
                    </div>
                    <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                      <span className="text-[#148647]">40</span>
                      <span>:</span>
                      <span className="text-[#148647]">52</span>
                      <span>:</span>
                      <span className="text-[#148647]">02</span>
                      <span className="hidden">Đóng</span>
                    </div>
                  </div>
                </div>

                {/* Đài Loan 3D */}
                <div 
                  className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                  onClick={() => handleGameClick('Đài Loan 3D', '/game/aspx/anyTime/AnyTimeK5_m.aspx?gIndex=7')}
                >
                  <div className="flex items-center relative w-[42%] h-full border-0 text-sm text-center float-left">
                    <img 
                      src="https://cuvncf.qiabbkj.com/images/graph/main/icon_menuAt28_Pop.png" 
                      className="block w-[36%] mx-[45.609px] h-[46px] border-0 overflow-clip"
                      alt="Đài Loan 3D"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                    <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                      Đài Loan 3D
                    </div>
                    <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                      <span className="text-[#148647]">40</span>
                      <span>:</span>
                      <span className="text-[#148647]">21</span>
                      <span>:</span>
                      <span className="text-[#148647]">52</span>
                      <span className="hidden">Đóng</span>
                    </div>
                  </div>
                </div>

                {/* Đài Loan 4D */}
                <div 
                  className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                  onClick={() => handleGameClick('Đài Loan 4D', '/game/aspx/anyTime/AnyTimeK5_m.aspx?gIndex=8')}
                >
                  <div className="flex items-center relative w-[42%] h-full border-0 text-sm text-center float-left">
                    <img 
                      src="https://cuvncf.qiabbkj.com/images/graph/main/icon_menuAt29_Pop.png" 
                      className="block w-[36%] mx-[45.609px] h-[46px] border-0 overflow-clip"
                      alt="Đài Loan 4D"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                    <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                      Đài Loan 4D
                    </div>
                    <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                      <span className="text-[#148647]">40</span>
                      <span>:</span>
                      <span className="text-[#148647]">21</span>
                      <span>:</span>
                      <span className="text-[#148647]">52</span>
                      <span className="hidden">Đóng</span>
                    </div>
                  </div>
                </div>

                {/* Trung Quốc 3D */}
                <div 
                  className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                  onClick={() => handleGameClick('Trung Quốc 3D', '/game/aspx/anyTime/AnyTimeK5_m.aspx?gIndex=0')}
                >
                  <div className="flex items-center relative w-[42%] h-full border-0 text-sm text-center float-left">
                    <img 
                      src="https://cuvncf.qiabbkj.com/images/graph/main/icon_menuAt21.png" 
                      className="block h-[46px] border-0 overflow-clip mx-[45.609px]"
                      alt="Trung Quốc 3D"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                    <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                      Trung Quốc 3D
                    </div>
                    <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                      <span className="text-[#148647]">17</span>
                      <span>:</span>
                      <span className="text-[#148647]">01</span>
                      <span>:</span>
                      <span className="text-[#148647]">52</span>
                      <span className="hidden">Đóng</span>
                    </div>
                  </div>
                </div>

                {/* Trung Quốc P3 */}
                <div 
                  className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                  onClick={() => handleGameClick('Trung Quốc P3', '/game/aspx/anyTime/AnyTimeK5_m.aspx?gIndex=1')}
                >
                  <div className="flex items-center relative w-[42%] h-full border-0 text-sm text-center float-left">
                    <img 
                      src="https://cuvncf.qiabbkj.com/images/graph/main/icon_menuAt22.png" 
                      className="block mx-[45.609px] h-[46px] border-0 overflow-clip"
                      alt="Trung Quốc P3"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                    <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                      Trung Quốc P3
                    </div>
                    <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                      <span className="text-[#148647]">17</span>
                      <span>:</span>
                      <span className="text-[#148647]">11</span>
                      <span>:</span>
                      <span className="text-[#148647]">52</span>
                      <span className="hidden">Đóng</span>
                    </div>
                  </div>
                </div>

                {/* Singapore 4D */}
                <div 
                  className="flex relative h-[80px] mt-2.5 border-t border-[#eeeeee] rounded-md bg-[#dde8e2] text-black text-sm text-center items-center z-[2] cursor-pointer"
                  onClick={() => handleGameClick('Singapore 4D', '/game/aspx/AnyTime4D/AnyTime4D_m.aspx')}
                >
                  <div className="flex items-center relative w-[42%] h-full border-0 text-sm text-center float-left">
                    <img 
                      src="https://cuvncf.qiabbkj.com/images/graph/main/icon_anyTime4D_m.svg" 
                      className="block w-[50%] mx-[45.609px] h-[46px] border-0 overflow-clip"
                      alt="Singapore 4D"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="block  w-[45%] pl-[calc(5%+6px)] border-0 text-sm text-center float-right">
                    <div className="table  px-1 border-0 text-sm font-bold text-left leading-5 whitespace-nowrap">
                      Singapore 4D
                    </div>
                    <div className="table  px-1 border-0 rounded-[50px] text-sm text-left leading-5">
                      <span className="text-[#148647]">14</span>
                      <span>:</span>
                      <span className="text-[#148647]">17</span>
                      <span>:</span>
                      <span className="text-[#148647]">02</span>
                      <span className="hidden">Đóng</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FlexReverse>
      </Dialog>
    </>
  );
}

export default PopupLottoKUMenuMobile; 