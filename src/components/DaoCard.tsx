import Image from 'next/image';
import Link from 'next/link';

import placeholderImage from '@/svg/placeholderImage.svg';

interface DaoCardProps {
  daoId: string;
  daoName: string;
  owner: string;
  assetId: number | null;
  owned: boolean;
}

const DaoCard = (props: DaoCardProps) => {
  return (
    <div
      className={`card z-0 m-1 h-60 w-56 break-words text-center shadow-xl hover:cursor-pointer hover:bg-neutral-focus`}>
      <Link href={`/dao/${encodeURIComponent(props.daoId)}`}>
        <div className='card-body text-center'>
          <p className='mb-2 flex items-center justify-center'>
            <Image
              src={placeholderImage}
              alt='placeholder'
              height={60}
              width={60}
            />
          </p>
          <h4 className='z-10 mb-1 text-base-content mix-blend-normal'>
            {props.daoName}
          </h4>
          <p className='text-sm text-accent'>{`DAO ID: ${props.daoId}`}</p>
          <p className='mt-5 text-sm underline underline-offset-2'>{`See more >`}</p>
        </div>
      </Link>
    </div>
  );
};

export default DaoCard;
