import React, { useState } from 'react';

interface RightHeaderProps {
    activeTab?: string;
    onTabChange?: (tabKind: string) => void;
}

const RightHeader: React.FC<RightHeaderProps> = ({
    activeTab = "StarBack2",
    onTabChange
}) => {
    const [selectedTab, setSelectedTab] = useState(activeTab);

    const gameTabs = [
        { kind: "StarBack2", label: "Hậu nhị" },
        { kind: "Star1", label: "1 hàng số" },
        { kind: "Bsoe", label: "Kèo đôi" },
        { kind: "Baccarat", label: "Baccarat" },
        { kind: "Special", label: "Đặc biệt" }
    ];

    const handleTabClick = (tabKind: string) => {
        setSelectedTab(tabKind);
        onTabChange?.(tabKind);
    };

    return (
        <div 
            className="flex items-center h-[34px] pl-[7px] border-0 text-white text-base font-normal text-left overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-none flex-grow-0 flex-shrink align-baseline"
        >
            {gameTabs.map((tab) => (
                <span
                    key={tab.kind}
                    data-kind={tab.kind}
                    className={`relative inline-block text-nowrap h-[34px] px-[5px] ${
                        selectedTab === tab.kind 
                            ? 'text-[rgb(255,234,0)] on after:content-[""] after:absolute after:bottom-0 after:left-[5px] after:right-[5px] after:h-[3px] after:bg-[rgb(255,234,0)]' 
                            : 'text-white'
                    } text-[14px] font-normal text-left leading-[34px] overflow-visible opacity-100 visible flex-row flex-nowrap flex-none flex-grow-0 flex-shrink cursor-pointer align-baseline hover:text-[rgb(255,234,0)]`}
                    onClick={() => handleTabClick(tab.kind)}
                >
                    {tab.label}
                </span>
            ))}
        </div>
    );
};

export default RightHeader; 