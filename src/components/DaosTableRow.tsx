import useExtrinsics from '@/hooks/useExtrinsics';
import useGenesisStore from '@/stores/genesisStore';

interface DaosTableRowInfo {
  daoId: string;
  daoName: string;
}

const DaosTableRow = (props: DaosTableRowInfo) => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const { destroyDao } = useExtrinsics();

  const handleDestroy = (daoId: string) => {
    if (!currentWalletAccount) {
      console.log('please connect wallet');
    } else {
      destroyDao(currentWalletAccount, daoId);
    }
  };
  return (
    <tr className='hover hover:cursor-pointer'>
      <td>{props.daoName}</td>
      <td>{props.daoId}</td>
      <td>
        <button
          className='btn-accent btn'
          onClick={() => {
            handleDestroy(props.daoId);
          }}>
          Destroy
        </button>
      </td>
    </tr>
  );
};

export default DaosTableRow;
