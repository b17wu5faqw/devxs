import React from 'react';

interface ChatroomBarProps {
  className?: string;
}

const ChatroomBar: React.FC<ChatroomBarProps> = ({ className = '' }) => {
  return (
    <div 
      id="divChatroomBar" 
      className={`chatroom_bottom hasGift fixed bottom-0 h-[35px] min-[400px]:h-[46px] w-full bg-black z-10 flex items-center gap-2 ${className}`}
    >
      <div className="sendtop flex items-center w-fit pl-[1%] h-full">
        <a className="icon_gift block w-[25px] h-[25px] ml-[11px] float-left" style={{ display: 'block' }}>
          <div className="w-full h-full bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/icon_gift.svg')] bg-no-repeat bg-center bg-[length:100%_auto]"></div>
        </a>
        <a id="btn_ChatRoom" className="icon_liveChat w-[25px] h-[25px] ml-[12px] float-left">
          <div className="w-full h-full bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/icon_liveChat.svg')] bg-no-repeat bg-center bg-[length:100%_auto]"></div>
        </a>
      </div>
      <div className="sendMain table-cell align-middle relative w-[63%]">
        <div className="keyTextOff w-full h-[27px] hidden bg-[#e5e5e5] px-[30px_5px] rounded-[12px] box-border overflow-hidden text-black leading-[25px] text-base"></div>
        <input 
          className="keyText bg-[#e5e5e5] px-[8px] pr-[75px] rounded-[12px] leading-[21px] min-h-[34px] text-base overflow-hidden outline-none break-all" 
          contentEditable="plaintext-only" 
          tabIndex={-1} 
          placeholder="Cùng trò chuyện"
        />
        <div className="showIcon w-[35px] h-[27px] cursor-pointer absolute top-0 bottom-0 right-[40px] my-auto z-[5]">
          <div className="btn_showIcon icon_repeat w-[18px] h-[18px] absolute left-0 right-0 top-0 bottom-0 m-auto cursor-pointer bg-[url('/images/graph/common/icon_reapet.svg')] bg-no-repeat bg-top bg-[length:100%]"></div>
        </div>
        <div className="faceIcon w-[40px] h-[27px] cursor-pointer absolute top-0 bottom-0 right-0 my-auto z-[5]" data-kind="faceBtn">
          <div id="divBtnFace" data-kind="faceBtn" className="btn_faceIcon w-[18px] h-[18px] absolute left-0 right-0 top-0 bottom-0 m-auto cursor-pointer bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_faceIcon.svg')] bg-no-repeat bg-top bg-[length:100%]"></div>
        </div>
      </div>
      <div id="divSendMsg" className="sendBtn table-cell w-[15%] align-middle text-center">
        <div className="btn_sendChat noText w-[23px] h-[23px] inline-block m-auto align-middle opacity-100 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_talkSend_m.svg')] bg-no-repeat bg-[length:100%_auto]"></div>
      </div>
      <div id="divBtnReapet" className="repeatBtn hidden w-[15%] align-middle text-center">
        <div className="btn_reBet w-[23px] h-[23px] inline-block m-auto align-middle opacity-100 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/icon_reapet.svg')] bg-no-repeat bg-center bg-[length:90%_auto]"></div>
      </div>
      <div id="divChatRoomAlert" className="sendBtn_Prompt absolute bottom-[37px] right-[0.5%] ml-[0.5%] py-[5px] px-[8px] border-0 rounded-[5px] bg-[#3678b7] text-white text-[0.8em] leading-[1.3em] text-left z-[7] hidden"></div>
    </div>
  );
};

export default ChatroomBar;