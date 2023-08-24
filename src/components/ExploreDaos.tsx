import Image from 'next/image';
import { useEffect, useState } from 'react';

import DaoCards from '@/components/DaoCards';
import Spinner from '@/components/Spinner';
import { useDebounce } from '@/hooks/useDebounce';
import { DaoService } from '@/services/daos';
import useGenesisStore from '@/stores/genesisStore';
import telescope from '@/svg/telescope.svg';
import type { DaoDetail } from '@/types/dao';
import { transformDaoToDaoDetail } from '@/utils/transformer';

const ExploreDaos = () => {
  const daosFromDB = useGenesisStore((s) => s.daosFromDB);
  const [fetchDaosFromDB, handleErrors] = useGenesisStore((s) => [
    s.fetchDaosFromDB,
    s.handleErrors,
  ]);

  const [daos, setDaos] = useState<DaoDetail[]>();

  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDaosFromDB();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  const fetchDaos = async () => {
    try {
      const response = await DaoService.list({
        limit: 50,
        ordering: 'id',
        search: debouncedSearchTerm,
      });

      if (response?.results?.length) {
        setDaos(response.results.map((dao) => transformDaoToDaoDetail(dao)));
      } else {
        setDaos(undefined);
      }
    } catch (ex) {
      handleErrors(new Error(ex));
    }
  };

  useEffect(() => {
    fetchDaos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const displayDaos = () => {
    if (!daos || daos?.length === 0) {
      return <div className='mt-5'>Sorry no DAOs found</div>;
    }
    return <DaoCards daos={daos} />;
  };

  return (
    <div
      className='container mb-6 flex min-h-[600px] flex-col px-6 py-5'
      id='explorer'>
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
            placeholder='Search DAO name or DAO ID'
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className='my-2 flex justify-center'>
        {!daosFromDB ? <Spinner /> : displayDaos()}
      </div>
    </div>
  );
};

export default ExploreDaos;
