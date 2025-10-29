import React from "react";
import { RpsLastDraw } from "@/hooks/useRps";

interface DiceRendererProps {
  lastDraw: RpsLastDraw | null;
  showAnimation?: boolean;
}

const DiceRenderer: React.FC<DiceRendererProps> = ({ lastDraw, showAnimation = false }) => {
  const renderIcon = (moveCode: string): string => {
    const iconMap: { [key: string]: string } = {
      'STONE': '/images/oantuti/icon_stone.svg',
      'ROCK': '/images/oantuti/icon_stone.svg',
      'SCISSORS': '/images/oantuti/icon_scissors.svg',
      'PAPER': '/images/oantuti/icon_paper.svg',
      'BUA': '/images/oantuti/icon_stone.svg',
      'KEO': '/images/oantuti/icon_scissors.svg',
      'BAO': '/images/oantuti/icon_paper.svg'
    };

    return iconMap[moveCode] || '/images/oantuti/icon_stone.svg';
  };

  if (!lastDraw) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Chưa có kết quả</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Kết quả phiên #{lastDraw.draw_no}
        </h3>
      </div>

      <div className="flex justify-center items-center gap-8 mb-4">
        {/* Cái (Dealer) */}
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 mb-2">Cái</div>
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <img 
              src={renderIcon(lastDraw.dealer)} 
              alt={lastDraw.dealer} 
              className="w-10 h-10"
            />
          </div>
          <div className="text-xs mt-1 font-semibold">
            {lastDraw.dealer === 'BUA' ? 'Búa' : lastDraw.dealer === 'KEO' ? 'Kéo' : 'Bao'}
          </div>
        </div>

        <div className="text-2xl font-bold text-gray-400">VS</div>

        {/* Con (Player) */}
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 mb-2">Con</div>
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <img 
              src={renderIcon(lastDraw.player)} 
              alt={lastDraw.player} 
              className="w-10 h-10"
            />
          </div>
          <div className="text-xs mt-1 font-semibold">
            {lastDraw.player === 'BUA' ? 'Búa' : lastDraw.player === 'KEO' ? 'Kéo' : 'Bao'}
          </div>
        </div>
      </div>

      {/* Winner announcement */}
      <div className="text-center">
        <div 
          className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
            lastDraw.winner === 'CAI' ? 'bg-red-500' : 
            lastDraw.winner === 'CON' ? 'bg-blue-500' : 
            'bg-green-500'
          }`}
        >
          {lastDraw.winner === 'CAI' ? '🎉 Cái Thắng!' : 
           lastDraw.winner === 'CON' ? '🎉 Con Thắng!' : 
           '🤝 Hòa!'}
        </div>
      </div>
    </div>
  );
};

export default DiceRenderer; 