interface DaoCardProps {
  daoId: string;
  daoName: string;
  owner: string;
}

const DaoCard = (props: DaoCardProps) => {
  const handleClick = () => {
    console.log('click dao');
  };

  return (
    <div
      className='card m-1 w-96 break-words bg-slate-800 text-center text-sm shadow-xl hover:cursor-pointer hover:bg-slate-700'
      onClick={handleClick}>
      <div className='card-body text-center'>
        <h1 className='mb-1 text-2xl font-bold'>{props.daoName}</h1>
        <p>{`ID: ${props.daoId}`}</p>
        <p>{`Owner: ${props.owner}`}</p>
        <p>You can check out this dao</p>
      </div>
    </div>
  );
};

export default DaoCard;
