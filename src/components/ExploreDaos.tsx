import { useEffect } from 'react';

import DaoCards from '@/components/DaoCards';
import useGenesisStore from '@/stores/genesisStore';

const ExploreDaos = () => {
  const daos = useGenesisStore((s) => s.daos);
  const fetchDaos = useGenesisStore((s) => s.fetchDaos);
  // const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  // const daosOwnedByWallet = useGenesisStore((s) => s.daosOwnedByWallet);
  // const updateDaosOwnedByWallet = useGenesisStore(
  //   (s) => s.updateDaosOwnedByWallet
  // );

  useEffect(() => {
    fetchDaos();
    // eslint-disable-next-line
  },[])

  return (
    <div className='container mb-20 flex min-h-[600px] flex-col py-5 px-6'>
      <div className='flex h-16 justify-between'>
        <div className='flex'>
          <span className='mx-1 flex items-center justify-center'>[Icon] </span>
          <h3>Explore</h3>
        </div>
        <div>
          <input
            className='input-primary input w-72 text-sm'
            placeholder='[icon] Search DAO name or DAO ID'></input>
        </div>
      </div>
      <div className='my-2 flex justify-center'>
        {!daos ? null : <DaoCards daos={Object.values(daos)} />}
      </div>
      <div className='mb-4 flex justify-center p-2'>Loading more...</div>
    </div>
  );
};

export default ExploreDaos;
