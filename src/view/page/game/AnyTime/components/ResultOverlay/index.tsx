import React from 'react';

interface ResultOverlayProps {
  isVisible: boolean;
  winningCodes: string[];
  revealedCodes: string[];
  isAnimating: boolean;
  onClose?: () => void;
}

const ResultOverlay: React.FC<ResultOverlayProps> = ({
  isVisible,
  winningCodes,
  revealedCodes,
  isAnimating,
  onClose
}) => {
  if (!isVisible) return null;
  
  const positionLabels = ['C.ngàn', 'Ngàn', 'Trăm', 'Chục', 'Đ.vị'];
  
  const displayCodes = revealedCodes.length === 5 ? revealedCodes : Array(5).fill('k');

  return (
    <div 
      id="divMaskATP" 
      className="w-full h-full bg-black/45 fixed left-0 right-0 top-[170px] bottom-0 z-10 select-none text-white"
      style={{ display: 'table' }}
    >
      <div className="table-cell align-middle pb-[174px]">
        <div className="table w-[349px] mx-auto bg-black/70 shadow-[0_0_0_5px_rgba(255,255,255,0.7)] p-[10px] rounded-[5px]">
          <div id="divAtOpenCard" className="relative h-[117px]">
            {displayCodes.map((code, index) => (
              <div 
                key={index} 
                className={`absolute ${
                  index === 0 ? 'left-0' :
                  index === 1 ? 'left-[20.5%]' :
                  index === 2 ? 'left-[40.8%]' :
                  index === 3 ? 'right-[20.5%]' :
                  'right-0'
                }`}
              >
                <span className="block w-[60px] text-center text-base mb-1 text-white">{positionLabels[index]}</span>
                <img
                  id={`imgCard_${index}`}
                  src={
                    code
                        ? `https://cuvnws.canhujiamy.com/images/graph/ball/anyTimePoker/img_anyTime${code}.svg`
                        : "https://cuvnws.canhujiamy.com/images/graph/ball/anyTimePoker/img_anyTimeBack.svg"
                  }
                  alt={`Card ${code || 'back'}`}
                  className="w-[60px] h-auto"
                  onError={(e) => {
                    e.currentTarget.src = "https://cuvnws.canhujiamy.com/images/graph/ball/anyTimePoker/img_anyTimeBack.svg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultOverlay;
