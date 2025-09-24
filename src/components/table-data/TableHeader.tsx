import React from 'react';

interface TableHeaderProps {
  title: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ title }) => {
  return (
    <div className="bg-[#2c5b93] text-white px-4 text-center">
      <h2 className="text-lg font-medium text-[13px]">{title}</h2>
    </div>
  );
};

export default TableHeader;