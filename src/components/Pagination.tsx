import Image from 'next/image';

import arrowLeft from '@/svg/arrow-left.svg';
import arrowRight from '@/svg/arrow-right.svg';

interface PaginationProps {
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: () => void;
}

const Pagination = (props: PaginationProps) => {
  const { currentPage = 0, pageSize = 0, totalCount } = props;

  const offset = currentPage * pageSize;

  return (
    <div className='flex items-center justify-end gap-2'>
      <span className='text-xs'>{`Showing ${offset} to ${
        offset + pageSize
      } of ${totalCount}`}</span>
      <div className='flex gap-1'>
        <button className='rounded-sm border-[0.02rem] border-neutral-focus p-2'>
          <Image src={arrowLeft} alt='Arrow Left' width={5} height={5} />
        </button>
        <button className='rounded-sm border-[0.02rem] border-neutral-focus p-2'>
          <Image src={arrowRight} alt='Arrow Right' width={5} height={5} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
