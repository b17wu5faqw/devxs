import React, { useEffect } from 'react';
import { TabSectionProps, TabType } from './types';

const TabSection: React.FC<TabSectionProps> = ({
  activeTab,
  onTabChange,
  lastDrawResults,
  addToSessionLog
}) => {

  const getMoveIcon = (move: string) => {
    const iconMap: { [key: string]: string } = {
      'BUA': '/images/oantuti/icon_stone.svg',
      'KEO': '/images/oantuti/icon_scissors.svg',
      'BAO': '/images/oantuti/icon_paper.svg',
      'STONE': '/images/oantuti/icon_stone.svg',
      'SCISSORS': '/images/oantuti/icon_scissors.svg',
      'PAPER': '/images/oantuti/icon_paper.svg'
    };
    return iconMap[move] || '/images/oantuti/icon_stone.svg';
  };

  const getWinnerText = (winner: string) => {
    switch (winner) {
      case 'CAI': return 'Cái';
      case 'CON': return 'Con';
      case 'HOA': return 'Hòa';
      default: return winner;
    }
  };

  const getWinnerColor = (winner: string) => {
    switch (winner) {
      case 'CAI': return 'text-red-400';
      case 'CON': return 'text-green-400';
      case 'HOA': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black-900">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => onTabChange(TabType.COMBINATION)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === TabType.COMBINATION
            ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
        >
          Tổ hợp
        </button>
        <button
          onClick={() => onTabChange(TabType.STATISTICS)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === TabType.STATISTICS
            ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
        >
          Thống kê
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === TabType.COMBINATION && (
          <div>
            <div className="text-lg font-bold text-white mb-4">
              Lịch sử kết quả
            </div>

            {lastDrawResults && lastDrawResults.length > 0 ? (
              <div className="space-y-2">
                {lastDrawResults.slice(0, 10).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {/* Draw number */}
                      <div className="text-sm font-medium text-gray-300">
                        #{result.draw_no || 'N/A'}
                      </div>

                      {/* Dealer vs Player */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <img
                            src={getMoveIcon(result.dealer)}
                            alt="Dealer"
                            className="w-5 h-5"
                          />
                          <span className="text-xs text-gray-400">Cái</span>
                        </div>

                        <span className="text-xs text-gray-500">VS</span>

                        <div className="flex items-center space-x-1">
                          <img
                            src={getMoveIcon(result.player)}
                            alt="Player"
                            className="w-5 h-5"
                          />
                          <span className="text-xs text-gray-400">Con</span>
                        </div>
                      </div>
                    </div>

                    {/* Winner */}
                    <div className={`text-sm font-bold ${getWinnerColor(result.winner)}`}>
                      {getWinnerText(result.winner)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Chưa có dữ liệu kết quả
              </div>
            )}
          </div>
        )}

        {activeTab === TabType.STATISTICS && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Cái thắng */}
              <div className="bg-red-900 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-1">Cái thắng</div>
                <div className="text-2xl font-bold text-red-400">
                  {lastDrawResults?.filter(r => r.winner === 'CAI').length || 0}
                </div>
              </div>

              {/* Con thắng */}
              <div className="bg-green-900 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-1">Con thắng</div>
                <div className="text-2xl font-bold text-green-400">
                  {lastDrawResults?.filter(r => r.winner === 'CON').length || 0}
                </div>
              </div>

              {/* Hòa */}
              <div className="bg-yellow-900 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-1">Hòa</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {lastDrawResults?.filter(r => r.winner === 'HOA').length || 0}
                </div>
              </div>

              {/* Tổng số */}
              <div className="bg-blue-900 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-1">Tổng số</div>
                <div className="text-2xl font-bold text-blue-400">
                  {lastDrawResults?.length || 0}
                </div>
              </div>
            </div>

            {/* Move Statistics */}
            <div className="mt-6">
              <div className="text-md font-semibold text-white mb-3">
                Thống kê theo nước đi
              </div>

              <div className="space-y-2">
                {['BUA', 'KEO', 'BAO'].map((move) => (
                  <div key={move} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <img
                        src={getMoveIcon(move)}
                        alt={move}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium text-white">{move}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {lastDrawResults?.filter(r => r.dealer === move || r.player === move).length || 0} lần
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSection; 