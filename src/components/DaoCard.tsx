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
      className='card w-96 bg-slate-800 shadow-xl hover:cursor-pointer hover:bg-slate-700'
      onClick={handleClick}>
      <div className='card-body'>
        <h2 className='card-title'>{`Name: ${props.daoName}`}</h2>
        <p>{`ID: ${props.daoId}`}</p>
        <p>{`Owner: ${props.owner}`}</p>
        <p>You can check out this dao</p>
      </div>
    </div>
  );
};

export default DaoCard;
