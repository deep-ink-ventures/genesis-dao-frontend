import DaoCard from '@/components/DaoCard';
import Spinner from '@/components/Spinner';

import type { BasicDaoInfo } from '../stores/genesisStore';
import { truncateMiddle } from '../utils/index';

const DaoCards = ({ daos }: { daos: BasicDaoInfo[] | null }) => {
  return daos && daos.length > 0 ? (
    <>
      <div className='mx-auto flex flex-wrap justify-center px-2 '>
        {daos.map((dao) => {
          return (
            <DaoCard
              key={dao.daoId}
              daoId={dao.daoId}
              daoName={dao.daoName}
              owner={truncateMiddle(dao.daoOwnerAddress)}
            />
          );
        })}
      </div>
    </>
  ) : (
    <div>
      <Spinner />
    </div>
  );
};

export default DaoCards;
