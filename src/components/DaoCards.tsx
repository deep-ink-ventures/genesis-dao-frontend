import DaoCard from '@/components/DaoCard';
import Spinner from '@/components/Spinner';

import type { DaoInfo } from '../stores/genesisStore';
import { truncateMiddle } from '../utils/index';

const DaoCards = ({ daos }: { daos: DaoInfo[] | null }) => {
  return daos && daos.length > 0 ? (
    <>
      <div className='mx-auto flex flex-wrap px-2'>
        {daos.map((dao) => {
          return (
            <DaoCard
              key={dao.daoId}
              daoId={dao.daoId}
              daoName={dao.daoName}
              assetId={dao.assetId}
              owner={truncateMiddle(dao.owner)}
              owned={dao.owned}
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
