import Image from 'next/image';
import { useEffect, useState } from 'react';

import arrowLeft from '@/svg/arrow-left.svg';
import arrowRight from '@/svg/arrow-right.svg';

interface PaginationProps {
  pageSize: number;
  totalCount?: number;
  onPageChange?: (offset: number) => void;
}

const Pagination = (props: PaginationProps) => {
  const { pageSize, totalCount = 0, onPageChange } = props;

  const [currentPage, setCurrentPage] = useState(1);

  const maxPageSize = Math.min(pageSize, totalCount);
  const lastItemIndex = currentPage * maxPageSize;
  const firstItemIndex = Math.min(
    lastItemIndex - maxPageSize + 1,
    lastItemIndex
  );

  useEffect(() => {
    if (onPageChange) {
      onPageChange(firstItemIndex - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstItemIndex]);

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const handPreviousClick = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className='flex items-center justify-end gap-2'>
      <span className='text-xs'>{`Showing ${firstItemIndex} to ${Math.min(
        lastItemIndex,
        totalCount
      )} of ${totalCount}`}</span>
      <div className='flex gap-1'>
        <button
          className='rounded-sm border-[0.02rem] border-neutral-focus p-2'
          onClick={handPreviousClick}
          disabled={currentPage === 1}>
          <Image src={arrowLeft} alt='Arrow Left' width={5} height={5} />
        </button>
        <button
          className='rounded-sm border-[0.02rem] border-neutral-focus p-2'
          onClick={handleNextClick}
          disabled={lastItemIndex >= totalCount}>
          <Image src={arrowRight} alt='Arrow Right' width={5} height={5} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
