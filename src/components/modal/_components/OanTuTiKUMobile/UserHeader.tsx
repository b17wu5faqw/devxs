import React, { useEffect } from 'react';
import { UserHeaderProps, GamePhase } from './types';
import useBalanceStore from '@/stores/balanceStore';

const UserHeader: React.FC<UserHeaderProps> = ({
  currentDraw,
  countdown,
  gamePhase,
  onVideoToggle,
  onBalanceClick
}) => {
  const balanceUser = useBalanceStore((s) => s.balance);
  const formatDrawNo = (drawNo: string | undefined) => {
    if (!drawNo) return 'N/A';

    if (/^\d+$/.test(drawNo)) {
      return drawNo;
    }

    return drawNo.length > 4 ? drawNo.slice(-4) : drawNo;
  };

  return (
    <div id="divUserHeader" className="headerPage_down showVideo table static w-full h-[39px] px-[12.8906px] border-0 bg-[rgb(16,31,26)] bg-repeat bg-[0%_0%] text-black text-base font-[Arial,微軟正黑體] font-normal text-center leading-[38px] overflow-visible box-border flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[215px_19.5px] transition-all animate-none outline-none align-baseline border-separate">
      <div className="header_phase table-cell static w-[141.469px] h-[39px] border-0 bg-repeat bg-[0%_0%] text-white text-[21.6px] font-[Arial,微軟正黑體] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[70.7344px_19.5px] transition-all animate-none outline-none align-middle border-separate">
        <div
          id="divBetBtn_Video"
          className="btn_Camera block static w-[45px] h-[38px] border-0 bg-[url('https://cuvnin.gs6168.com/images/graph/common/btn_camera_on.svg')] bg-[length:auto_80%] bg-no-repeat bg-[50%_50%] text-white text-[21.6px] font-[Arial,微軟正黑體] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible hover:opacity-80 float-left box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[22.5px_19px] transition-all animate-none cursor-pointer outline-none align-middle border-separate"
          onClick={onVideoToggle}
          title="Chuyển đổi camera"
        ></div>
        <span id="liGid" className="header_phaseNum inline static mr-[3px] border-0 bg-repeat bg-[0%_0%] text-[#FF0000] text-[21.6px] font-[Arial,微軟正黑體] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[0px_0px] transition-all animate-none outline-none align-baseline border-separate">
          <span className="inline static border-0 bg-repeat bg-[0%_0%] text-white text-[21.6px] font-[Arial,微軟正黑體] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[0px_0px] transition-all animate-none outline-none align-baseline border-separate">
            Kỳ
          </span> {formatDrawNo(currentDraw?.draw_no)}
          <span className="inline static border-0 bg-repeat bg-[0%_0%] text-[#FF0000] text-[21.6px] font-[Arial,微軟正黑體] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[0px_0px] transition-all animate-none outline-none align-baseline border-separate"></span>
        </span>
      </div>

      <div id="divCountDownBet" className="header_time table-cell static w-[125.297px] h-[39px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-[Arial,微軟正黑體] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[62.6484px_19.5px] transition-all animate-none outline-none align-middle border-separate">
        <div className="timeBox flex static w-[125.297px] h-[38px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-[Arial,微軟正黑體] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-center items-center flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[62.6484px_19px] transition-all animate-none outline-none align-baseline border-separate">
          <span id="spnBetMM" className={`timeT flex static w-[46px] h-[38px] border-0 bg-[url('https://cuvnin.gs6168.com/images/graph/common/bg_time.svg')] bg-[length:91%] bg-no-repeat bg-[50%_50%] text-[30.72px] font-[Arial,微軟正黑體] font-bold text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-center items-center flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[23px_19px] transition-all animate-none outline-none align-baseline border-separate ${(countdown?.seconds || 0) <= 10 && gamePhase === GamePhase.DEFAULT ? 'text-[#FF0000]' : 'text-black'}`}>
            {gamePhase === GamePhase.SHOWING_RESULT ? '00' : String(countdown?.minutes || 0).padStart(2, '0')}
          </span>
          <span className={`white_t flex static w-[18px] h-[38px] border-0 bg-repeat bg-[0%_0%] text-[30.72px] font-[Arial,微軟正黑體] font-bold text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-center items-center flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[9px_19px] transition-all animate-none outline-none align-baseline border-separate ${(countdown?.seconds || 0) <= 10 && gamePhase === GamePhase.DEFAULT ? 'text-[#FF0000]' : 'text-white'}`}> : </span>
          <span id="spnBetSS" className={`timeT flex static w-[46px] h-[38px] border-0 bg-[url('https://cuvnin.gs6168.com/images/graph/common/bg_time.svg')] bg-[length:91%] bg-no-repeat bg-[50%_50%] text-[30.72px] font-[Arial,微軟正黑體] font-bold text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-center items-center flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[23px_19px] transition-all animate-none outline-none align-baseline border-separate ${(countdown?.seconds || 0) <= 10 && gamePhase === GamePhase.DEFAULT ? 'text-[#FF0000]' : 'text-black'}`}>
            {gamePhase === GamePhase.SHOWING_RESULT ? '00' : String(countdown?.seconds || 0).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div
        id="fonBalance"
        className="header_money showArrow flex relative w-[38.0312px] h-[38px] pr-[15px] border-0 bg-repeat bg-[0%_0%] text-[rgb(255,228,0)] text-[21.6px] font-[Arial,微軟正黑體] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible hover:opacity-80 float-right box-content flex-row flex-nowrap justify-center items-baseline flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[26.5156px_19px] transition-all animate-none cursor-pointer outline-none align-middle border-separate"
        onClick={onBalanceClick}
        title="Số dư tài khoản"
      >$ {balanceUser}</div>
    </div>
  );
};

export default UserHeader; 