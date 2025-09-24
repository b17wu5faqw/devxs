import React from 'react';
import TableHeader from '@/components/table-data/TableHeader';


export interface TableData {
    rows: Array<Array<string | number>>;
  }

interface LotteryTableSectionProps {
  title: string;
  data: TableData[];
}

const LotteryTableSection: React.FC<LotteryTableSectionProps> = ({ title, data }) => {
  return (
    <div className="bg-white shadow-sm overflow-hidden">
      <TableHeader title={title} />
      
      <div className="overflow-x-auto">
        {data.map((table, tableIndex) => (
          <ul key={tableIndex} className="w-full list-none p-0 m-0">
            {table.rows.map((row, rowIndex) => (
              <li 
                key={rowIndex} 
                className={`
                  flex flex-row
                  ${rowIndex === 0 ? "bg-[#dddddd]" : "bg-white"}
                `}
              >
                {row.map((cell, cellIndex) => (
                  <div 
                    key={cellIndex}
                    className={`
                      flex-1
                      border border-gray-300 
                      px-2 py-2 
                      text-center
                      text-[13px]
                      ${cellIndex === 0 ? "bg-gray-100" : ""}
                    `}
                    style={{
                      flexBasis: cell === "" ? "auto" : undefined,
                      flexGrow: row.length === 1 && cellIndex === 0 ? 1 : undefined
                    }}
                  >
                    {typeof cell === 'string' && (cell.match(/^\d/) || cell.includes('.')) ? (
                      <span className="text-red-600">{cell}</span>
                    ) : (
                      cell
                    )}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default LotteryTableSection;