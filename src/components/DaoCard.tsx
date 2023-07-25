import Image from 'next/image';
import Link from 'next/link';

import useGenesisStore from '@/stores/genesisStore';
import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';

interface DaoCardProps {
  daoId: string;
  daoName: string;
  daoOwnerAddress: string;
  daoAssetId: number | null;
  imageUrl: string | null;
  setupComplete: boolean;
}

const DaoCard = (props: DaoCardProps) => {
  const [currentWalletAccount] = useGenesisStore((s) => [
    s.currentWalletAccount,
  ]);
  const displayImage = () => {
    if (!props.imageUrl) {
      return (
        <>
          <Image
            src={placeholderImage}
            alt='placeholder'
            height={60}
            width={60}
          />
          <div className='absolute'>
            <Image src={mountain} alt='mountain' width={30} height={17}></Image>
          </div>
        </>
      );
    }
    return (
      <>
        <img
          src={props.imageUrl}
          alt={`${props.daoName} logo image`}
          height={60}
          width={60}
          className='rounded-full'
        />
      </>
    );
  };

  return (
    <div
      className={`card z-0 m-1 h-40 w-36 break-words text-center shadow-xl hover:cursor-pointer md:h-60 md:w-56`}>
      <Link href={`/dao/${encodeURIComponent(props.daoId)}`}>
        {currentWalletAccount?.address === props.daoOwnerAddress ? (
          <div className='absolute left-40 top-3 rounded-[15px] bg-primary px-2 py-1 text-xs'>
            admin
          </div>
        ) : null}
        <div className='card-body text-center'>
          <div className='mb-2 hidden items-center justify-center md:flex'>
            {displayImage()}
          </div>
          <div className='md:overflow-visible'>
            <h4
              className={`z-10 inline-block w-[150px] truncate text-base-content mix-blend-normal ${
                props.daoName?.length > 20 ? 'text-sm' : ''
              }`}>
              {props.daoName}
            </h4>
            <p className='text-sm text-accent'>{`DAO ID: ${props.daoId}`}</p>
          </div>
          <p className='mt-5 hidden text-sm underline underline-offset-2 md:block'>{`See more >`}</p>
        </div>
      </Link>
    </div>
  );
};

export default DaoCard;
