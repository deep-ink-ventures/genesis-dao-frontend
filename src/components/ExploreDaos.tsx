import Image from 'next/image';
import { useEffect } from 'react';

import DaoCards from '@/components/DaoCards';
import Spinner from '@/components/Spinner';
import useGenesisStore from '@/stores/genesisStore';
import telescope from '@/svg/telescope.svg';

const ExploreDaos = () => {
  const daos = useGenesisStore((s) => s.daos);
  const fetchDaos = useGenesisStore((s) => s.fetchDaos);

  useEffect(() => {
    fetchDaos();
    // eslint-disable-next-line
  },[])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDaos();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDaos();
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <div className='container mb-20 flex min-h-[600px] flex-col py-5 px-6'>
      <div className='mb-5 flex h-16 flex-wrap justify-between px-2 md:mb-0'>
        <div className='mb-3 flex items-center md:mb-0'>
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
        {!daos ? <Spinner /> : <DaoCards daos={Object.values(daos)} />}
      </div>
    </div>
  );
};

export default ExploreDaos;
