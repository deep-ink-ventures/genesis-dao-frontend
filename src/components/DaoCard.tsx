import Image from 'next/image';
import Link from 'next/link';

import mountain from '@/svg/mountain.svg';
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
      className={`dao-card card z-0 m-1 h-60 w-56 break-words text-center shadow-xl hover:cursor-pointer`}>
      <Link href={`/dao/${encodeURIComponent(props.daoId)}`}>
        <div className='card-body text-center'>
          <div className='dao-image mb-2 flex items-center justify-center hover:hidden'>
            <Image
              src={placeholderImage}
              alt='placeholder'
              height={60}
              width={60}
            />
            <div className='absolute'>
              <Image
                src={mountain}
                alt='mountain'
                width={30}
                height={17}></Image>
            </div>
          </div>
          <div className='overflow-visible'>
            <h4 className='z-10 text-base-content mix-blend-normal'>
              {props.daoName}
            </h4>
            <p className='text-sm text-accent'>{`DAO ID: ${props.daoId}`}</p>
          </div>
          <p className='mt-5 text-sm underline underline-offset-2'>{`See more >`}</p>
        </div>
      </Link>
    </div>
  );
};

export default DaoCard;
