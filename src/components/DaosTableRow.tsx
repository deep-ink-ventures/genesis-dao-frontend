interface DaosTableRowInfo {
  daoId: string;
  daoName: string;
}

const DaosTableRow = (props: DaosTableRowInfo) => {
  return (
    <tr className='hover hover:cursor-pointer'>
      <td>{props.daoName}</td>
      <td>{props.daoId}</td>
      <td>
        <button className='btn-primary btn'>Destroy</button>
      </td>
    </tr>
  );
};

export default DaosTableRow;
