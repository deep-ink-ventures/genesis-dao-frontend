import Image from 'next/image';

import coinsTransfer from '@/svg/coinsTransfer.svg';
import mountain from '@/svg/mountain.svg';
import openLink from '@/svg/openlink.svg';
import placeholderImage from '@/svg/placeholderImage.svg';

const AssetsTable = () => {
  return (
    <div className='w-full'>
      <div className='grid grid-cols-[50%_10%_10%_15%_15%] gap-2 space-x-2 px-4 py-3 text-sm font-normal text-neutral-focus'>
        <span>DAO NAME</span>
        <span>DAO ID</span>
        <span>Role</span>
        <span>Owned Tokens</span>
        <span>Actions</span>
      </div>
      <div className='space-y-2'>
        {Array(5)
          .fill({})
          .map((i, index) => (
            <div
              key={index}
              className='grid grid-cols-[50%_10%_10%_15%_15%] gap-2 space-x-2 rounded-lg border-[0.3px] border-solid
              border-neutral-focus px-4 py-3 text-sm font-normal text-neutral-focus
              '>
              <span className='flex items-center gap-2'>
                <div className='relative flex items-center justify-center'>
                  <Image
                    src={placeholderImage}
                    alt='placeholder'
                    height={40}
                    width={40}
                  />
                  <div className='absolute'>
                    <Image
                      src={mountain}
                      alt='mountain'
                      width={14}
                      height={14}
                    />
                  </div>
                </div>
                DAO NAME
              </span>
              <span className='my-auto'>DAO ID</span>
              <span className='my-auto'>
                <span className='badge text-xs text-base-100'>Admin</span>
              </span>
              <span className='my-auto'>30</span>
              <span className='my-auto flex gap-2'>
                <span className='rounded-full border border-solid border-neutral-focus p-2'>
                  <Image
                    src={coinsTransfer}
                    alt='transfer'
                    width={16}
                    height={16}
                    className='m-auto cursor-pointer'
                  />
                </span>
                <span className='rounded-full border border-solid border-neutral-focus p-2'>
                  <Image
                    src={openLink}
                    alt='open link'
                    width={16}
                    height={16}
                    className='m-auto cursor-pointer'
                  />
                </span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AssetsTable;
