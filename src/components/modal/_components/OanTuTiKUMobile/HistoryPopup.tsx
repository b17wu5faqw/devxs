import React, { useState } from 'react';
import { Dialog, Grow } from '@mui/material';

interface HistoryItem {
  id: number;
  draw_no: string;
  dealer: string;
  player: string;
  winner: string;
  date: string;
  time: string;
}

interface HistoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  historyData?: HistoryItem[];
}

const HistoryPopup: React.FC<HistoryPopupProps> = ({
  isOpen,
  onClose,
  historyData = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data nếu không có dữ liệu thật
  const mockData: HistoryItem[] = [
    {
      id: 1,
      draw_no: "20240101001",
      dealer: "BUA",
      player: "KEO",
      winner: "CAI",
      date: "01/01/2024",
      time: "14:30:15"
    },
    {
      id: 2,
      draw_no: "20240101002",
      dealer: "BAO",
      player: "BUA",
      winner: "CON",
      date: "01/01/2024",
      time: "14:30:45"
    },
    {
      id: 3,
      draw_no: "20240101003",
      dealer: "KEO",
      player: "KEO",
      winner: "HOA",
      date: "01/01/2024",
      time: "14:31:15"
    }
  ];

  const displayData = historyData.length > 0 ? historyData : mockData;
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = displayData.slice(startIndex, startIndex + itemsPerPage);

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

  const getMoveName = (move: string) => {
    const nameMap: { [key: string]: string } = {
      'BUA': 'Búa',
      'KEO': 'Kéo',
      'BAO': 'Bao',
      'STONE': 'Búa',
      'SCISSORS': 'Kéo',
      'PAPER': 'Bao'
    };
    return nameMap[move] || move;
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
      case 'CAI': return 'text-red-400 bg-red-900/20';
      case 'CON': return 'text-blue-400 bg-blue-900/20';
      case 'HOA': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      TransitionComponent={Grow}
      transitionDuration={300}
      PaperProps={{
        sx: {
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          margin: 0,
          borderRadius: 0,
          backgroundColor: '#1a1a1a',
          color: 'white'
        }
      }}
    >
      <div className="flex flex-col h-full bg-gray-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-xl font-bold text-white">Lịch sử Oẳn tù tì KU</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            title="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="grid grid-cols-6 gap-2 p-3 text-sm font-medium text-gray-300">
              <div className="text-center">Kỳ</div>
              <div className="text-center">Cái</div>
              <div className="text-center">Con</div>
              <div className="text-center">Kết quả</div>
              <div className="text-center">Ngày</div>
              <div className="text-center">Giờ</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {currentData.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {currentData.map((item) => (
                  <div key={item.id} className="grid grid-cols-6 gap-2 p-3 hover:bg-gray-800 transition-colors">
                    {/* Kỳ */}
                    <div className="text-center text-sm text-gray-300">
                      {String(item.draw_no ?? '').slice(-4) || '-'}
                    </div>

                    {/* Cái */}
                    <div className="flex flex-col items-center space-y-1">
                      <img 
                        src={getMoveIcon(item.dealer)} 
                        alt={getMoveName(item.dealer)}
                        className="w-6 h-6"
                      />
                      <span className="text-xs text-gray-400">{getMoveName(item.dealer)}</span>
                    </div>

                    {/* Con */}
                    <div className="flex flex-col items-center space-y-1">
                      <img 
                        src={getMoveIcon(item.player)} 
                        alt={getMoveName(item.player)}
                        className="w-6 h-6"
                      />
                      <span className="text-xs text-gray-400">{getMoveName(item.player)}</span>
                    </div>

                    {/* Kết quả */}
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getWinnerColor(item.winner)}`}>
                        {getWinnerText(item.winner)}
                      </span>
                    </div>

                    {/* Ngày */}
                    <div className="text-center text-sm text-gray-300">
                      {item.date}
                    </div>

                    {/* Giờ */}
                    <div className="text-center text-sm text-gray-300">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-lg mb-2">Không có dữ liệu</div>
                  <div className="text-sm">Chưa có lịch sử trò chơi</div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-700 bg-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Trang {currentPage} / {totalPages} (Tổng {displayData.length} kết quả)
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Trước
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default HistoryPopup; 