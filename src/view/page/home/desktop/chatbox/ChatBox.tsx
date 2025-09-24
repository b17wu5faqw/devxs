function ChatBox() {
    return (
        <div className="w-[245px] pt-[5px]">
            <div className="h-[860px] min-h-[617px] max-h-[784px] relative">
                <div className="bg-[#4984c0] h-[35px] leading-[35px] text-center text-white">
                    <span>Phòng chat</span>
                </div>
                <div className="chatroom_box">
                    <div className="chatroom_mask connecting">
                        <img src="/images/main/loading_2.gif"/>
                        <span>Số người đạt mức tối đa !<br/>Phòng chat đang bận<br/>vui lòng thử lại sau</span>
                    </div>
                    <div className="chatroomT">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;