import React from 'react';

interface RightGameSectionProps {
    gameKind?: string;
    onBallClick?: (ballNumber: number, digital: number) => void;
    onClearClick?: () => void;
    onAddClick?: () => void;
    selectedCount?: number;
}

const RightGameSection: React.FC<RightGameSectionProps> = ({
    gameKind = "166",
    onBallClick,
    onClearClick,
    onAddClick,
    selectedCount = 0
}) => {
    return (
        <div 
            data-area="StarBack2" 
            className="h-[199px] border-0 text-black   text-base font-normal text-left overflow-visible z-0 opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all"
        >
            {/* Tens Row (Chục) */}
            <div 
                data-digital="2" 
                className="AT_row vn static h-[40px] border-0 text-black text-base font-normal text-left leading-[40px] overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all flex items-center justify-between"
            >
                <span className="h-[40px] pl-[5px] border-0 text-[rgb(0,89,171)] text-[13px] font-bold text-center leading-[40px] overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all">
                    Chục
                </span>
                
                {/* Tens digit balls (0-9) */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <div
                        key={`tens-${number}`}
                        data-atball={number}
                        className="AT_rowCircle block relative w-[27px] h-[27px] m-[5px_3px] border border-[rgb(207,207,207)] rounded-full text-black text-base font-bold text-center leading-[29px] overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all cursor-pointer"
                        onClick={() => onBallClick?.(number, 2)}
                    >
                        {number}
                    </div>
                ))}
            </div>

            {/* Units Row (Đơn vị) */}
            <div 
                data-digital="1" 
                className="AT_row AT_rowBlue vn static h-[40px] border-0 bg-[rgb(242,249,255)] text-black text-base font-normal text-left leading-[40px] overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all flex items-center justify-between"
            >
                <span className="h-[40px] pl-[5px] border-0 text-[rgb(0,89,171)] text-[13px] font-bold text-center leading-[40px] overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all">
                    Đơn vị
                </span>
                
                {/* Units digit balls (0-9) */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <div
                        key={`units-${number}`}
                        data-atball={number}
                        className="AT_rowCircle block relative w-[27px] h-[27px] m-[5px_3px] border border-[rgb(207,207,207)] rounded-full text-black text-base font-bold text-center leading-[29px] overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none transition-all cursor-pointer"
                        onClick={() => onBallClick?.(number, 1)}
                    >
                        {number}
                    </div>
                ))}
            </div>

            {/* Button Wrapper */}
            <div className="btn_wraps block static h-[119px] border-0 bg-[rgb(245,245,245)] text-black text-base font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                {/* Input Area with Scroll */}
                <div className="scrollbar-macosx scroll-textarea block relative w-[300px] h-[105px] m-[7px_6px] border border-[rgb(196,196,196)] text-black text-base font-normal text-left overflow-hidden opacity-100 visible float-left box-border flex-row flex-nowrap flex-none transition-all">
                    <div className="scroll-content block relative w-full h-[103px] border-0 text-black text-base font-normal text-left overflow-hidden opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                        <textarea
                            id={`inputArea_${gameKind}`}
                            className="inputArea scrollbar-macosx block relative w-full h-[103px] p-[5px] border-0 bg-white text-black text-[13.3333px] font-normal text-left whitespace-pre-wrap overflow-hidden overflow-y-scroll opacity-100 visible float-left box-border flex-row flex-nowrap flex-none transition-all cursor-text"
                            placeholder="Nhập số bằng tay, nhập ít nhất 2 con số để tạo thành 1 tổ hợp."
                        />
                    </div>
                    
                    {/* Scroll Elements */}
                    <div className="scroll-element scroll-x absolute w-full min-w-full border-0 text-black text-base font-normal text-left overflow-visible z-[99] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                        <div className="scroll-element_outer block absolute left-[2px] w-full h-full border-0 text-black text-base font-normal text-left overflow-visible z-[99] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                            <div className="scroll-element_size block absolute left-[-4px] w-full h-full border-0 text-black text-base font-normal text-left overflow-visible z-[99] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all" />
                            <div className="scroll-element_track absolute w-full h-full border-0 text-black text-base font-normal text-left overflow-visible z-[99] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all" />
                            <div className="scroll-bar block absolute top-[-12px] w-[96px] h-[12px] min-w-[10px] border-0 rounded-[7px] bg-[rgb(136,136,136)] text-black text-base font-normal text-left overflow-visible z-[99] opacity-0 visible box-content flex-row flex-nowrap flex-none transition-opacity duration-200 cursor-pointer" />
                        </div>
                    </div>
                    
                    <div className="scroll-element scroll-y absolute h-full min-h-full border-0 text-black text-base font-normal text-left overflow-visible z-[99] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                        <div className="scroll-element_outer block absolute top-[2px] w-full h-full border-0 text-black text-base font-normal text-left overflow-visible z-[99] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all">
                            <div className="scroll-element_size block absolute top-[-4px] w-full h-full border-0 text-black text-base font-normal text-left overflow-visible z-[99] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all" />
                            <div className="scroll-element_track absolute w-full h-full border-0 text-black text-base font-normal text-left overflow-visible z-[99] opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all" />
                            <div className="scroll-bar block absolute left-[-3px] w-[3px] h-[96px] border-0 rounded-[7px] bg-[rgb(136,136,136)] text-black text-base font-normal text-left overflow-visible z-[99] opacity-0 visible box-content flex-row flex-nowrap flex-none transition-opacity duration-200 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Button Box */}
                <div className="btn_Box block static w-[75px] h-[109px] m-[6px_6px_0px_2px] border-0 text-black text-base font-normal text-left overflow-visible opacity-100 visible float-right box-content flex-row flex-nowrap flex-none transition-all">
                    
                    {/* Clear Button */}
                    <a 
                        className="btn_clear block static w-[75px] h-[31px] border-0 rounded-[5px] bg-[rgb(137,137,137)] text-white text-[14px] font-normal text-center leading-[31px] overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all cursor-pointer"
                        onClick={onClearClick}
                    >
                        Xóa
                    </a>
                    
                    {/* Add Button */}
                    <a 
                        id={`btnAddList_${gameKind}`}
                        className="btn_addmenu block static w-[75px] h-[31px] mt-[8px] border-0 rounded-[5px] bg-[rgb(137,137,137)] text-white text-[14px] font-normal text-center leading-[31px] overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all cursor-pointer"
                        onClick={onAddClick}
                    >
                        Thêm
                    </a>
                    
                    {/* Info Bar */}
                    <a className="inforBar block static w-[75px] h-[31px] mt-[8px] border border-[rgb(197,197,197)] rounded-[5px] bg-white text-black text-[14px] font-normal text-center leading-[31px] overflow-visible opacity-100 visible box-border flex-row flex-nowrap flex-none transition-all">
                        <span 
                            id={`spnStrSgHint_${gameKind}`} 
                            className="t_blue inline static border-0 text-[rgb(0,126,255)] text-[14px] font-normal text-center leading-[31px] overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-none transition-all"
                        >
                            {selectedCount}
                        </span>
                        {" đơn"}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RightGameSection; 