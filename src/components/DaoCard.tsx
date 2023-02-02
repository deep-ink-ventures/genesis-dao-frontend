import Link from 'next/link';

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
      className={`card m-1 w-60 break-words bg-slate-800 text-center text-sm shadow-xl hover:cursor-pointer hover:bg-slate-700
      ${!props.owned ? `bg-slate-800` : `bg-blue-800`} `}>
      <Link href={`/dao/${encodeURIComponent(props.daoId)}`}>
        <div className='card-body text-center'>
          <h1 className='mb-1 text-2xl font-bold'>{props.daoName}</h1>
          <p>{`DAO ID: ${props.daoId}`}</p>
          <p>{`Owner: ${props.owner}`}</p>
          <p>{`Asset ID: ${props.assetId ? props.assetId : 'N/A'}`}</p>
          <p>You can check out this dao</p>
        </div>
      </Link>
    </div>
  );
};

export default DaoCard;
