import Image from 'next/image';

import arrowLeft from '@/svg/arrow-left.svg';
import arrowRight from '@/svg/arrow-right.svg';

interface PaginationProps {
  pageSize: number;
  totalCount?: number;
  onPageChange?: (currentPage: number, offset: number) => void;
  currentPage?: number;
}

const Pagination = (props: PaginationProps) => {
  const { currentPage = 1, pageSize = 0, totalCount = 0, onPageChange } = props;

  const maxPageSize = Math.min(pageSize, totalCount);
  const lastItemIndex = currentPage * maxPageSize;
  const firstItemIndex = Math.min(
    lastItemIndex - maxPageSize + 1,
    lastItemIndex,
    totalCount
  );

  const handleNextClick = () => {
    if (onPageChange) {
      const nextOffset = (currentPage + 1) * maxPageSize;
      onPageChange(
        currentPage + 1,
        Math.min(nextOffset - maxPageSize + 1, nextOffset)
      );
    }
  };

  const handPreviousClick = () => {
    if (onPageChange) {
      const nextOffset = (currentPage - 1) * maxPageSize;
      onPageChange(
        currentPage - 1,
        Math.min(nextOffset - maxPageSize + 1, nextOffset)
      );
    }
  };

  return (
    <div id='pagination' className='flex items-center justify-end gap-2'>
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
