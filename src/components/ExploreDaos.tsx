import Image from 'next/image';
import { useEffect } from 'react';

import DaoCards from '@/components/DaoCards';
import Spinner from '@/components/Spinner';
import useGenesisStore from '@/stores/genesisStore';
import telescope from '@/svg/telescope.svg';

const ExploreDaos = () => {
  const exploreDaos = useGenesisStore((s) => s.exploreDaos);
  const fetchDaosFromDB = useGenesisStore((s) => s.fetchDaosFromDB);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDaosFromDB();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  return (
    <div className='container mb-20 flex min-h-[600px] flex-col py-5 px-6'>
      <div className='mb-5 flex h-16 flex-col items-center justify-center px-2 md:mb-0 md:flex-row md:justify-between'>
        <div className='my-3 flex items-center md:mb-0'>
          <div className='mr-2'>
            <Image src={telescope} width={27} height={28} alt='building' />
          </div>
          <h3 className='flex items-center'>Explore</h3>
        </div>
        <div className='flex items-center'>
          <input
            id='search-input'
            className='input-primary input w-72 text-sm'
            placeholder='Search DAO name or DAO ID'></input>
        </div>
      </div>
      <div className='my-2 flex justify-center'>
        {!exploreDaos ? <Spinner /> : <DaoCards daos={exploreDaos} />}
      </div>
    </div>
  );
};

export default ExploreDaos;
