import React from 'react';
import { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({
  onHomeClick,
  onResultsClick,
  onBetRecordClick,
  onMenuClick
}) => {
  return (
    <div className="header_top relative w-full h-[55px] border-b border-b-[rgb(53,66,62)] bg-[rgb(31,71,51)] text-black text-base font-arial text-center flex items-center justify-between">
      <div className="flex items-center justify-between">
        <div
          id="divBackUrl"
          className="btn_home block static w-[45px] h-[55px] ml-[5px] border-0 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_home.svg')] bg-[length:auto_55%] bg-no-repeat bg-center opacity-50 hover:opacity-100 float-left cursor-pointer transition-opacity duration-200"
          onClick={onHomeClick}
          title="Trang chủ"
        ></div>
        <div
          id="divBtn_Results"
          className="btn_lotteryResult block static w-[45px] h-[55px] border-0 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_lotteryResult.svg')] bg-[length:auto_56%] bg-no-repeat bg-center opacity-50 hover:opacity-100 float-left cursor-pointer transition-opacity duration-200"
          onClick={onResultsClick}
          title="Kết quả xổ số"
        ></div>
      </div>

      <div className="w-fit h-[35px] my-[10px] flex items-center justify-center gap-1 px-[10px] border border-[rgba(255,255,255,0.5)] rounded-[5px] text-white text-base font-arial leading-[35px] text-nowrap">
        Xóc Đĩa KU
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <div
          id="divBtnReportBet"
          className="btn_betRecord block static w-[45px] h-[55px] border-0 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_betRecord.svg')] bg-[length:auto_48%] bg-no-repeat bg-center opacity-50 hover:opacity-100 float-left cursor-pointer transition-opacity duration-200"
          onClick={onBetRecordClick}
          title="Lịch sử cược"
        ></div>
        <div
          className="btn_menu block static w-[45px] h-[55px] mr-[5px] border-0 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_menu.svg')] bg-[length:auto_48%] bg-no-repeat bg-center opacity-50 hover:opacity-100 float-left cursor-pointer transition-opacity duration-200"
          onClick={onMenuClick}
          title="Menu"
        ></div>
      </div>
    </div>
  );
};

export default Header; 