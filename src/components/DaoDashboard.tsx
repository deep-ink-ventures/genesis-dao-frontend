import { BN } from '@polkadot/util';
import Link from 'next/link';

import DestroyDao from '@/components/DestroyDao';
import useGenesisStore from '@/stores/genesisStore';

const DaoDashboard = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const daoTokenBalance = useGenesisStore((s) => s.daoTokenBalance);
  return (
    <div className='flex flex-col gap-y-4'>
      <div>
        <h1>{currentDao?.daoName}</h1>
      </div>
      <div>
        <p>{currentDao?.descriptionShort}</p>
      </div>
      <div>
        <div className='flex flex-wrap gap-x-4'>
          {currentDao?.setupComplete ||
          currentWalletAccount?.address !==
            currentDao?.daoOwnerAddress ? null : (
            <Link
              href={`/dao/${encodeURIComponent(
                currentDao?.daoId as string
              )}/customize`}
              className={`${!currentWalletAccount ? 'disable-link' : ''}`}>
              <button
                className={`btn-primary btn w-[180px]`}
                disabled={!currentWalletAccount}>
                Customize DAO
              </button>
            </Link>
          )}
          <Link
            href={`/dao/${encodeURIComponent(
              currentDao?.daoId as string
            )}/create-proposal`}
            className={`${
              !currentWalletAccount ||
              daoTokenBalance?.isZero() ||
              !currentDao?.setupComplete
                ? 'disable-link'
                : ''
            }`}>
            <button
              className={`btn-primary btn w-[180px]`}
              disabled={
                !currentWalletAccount ||
                !currentDao?.setupComplete ||
                !currentDao?.setupComplete
              }>
              Create Proposal
            </button>
          </Link>
          <Link
            href={`/dao/${encodeURIComponent(
              currentDao?.daoId as string
            )}/tokens`}
            className={`${
              !currentWalletAccount ||
              daoTokenBalance?.isZero() ||
              !daoTokenBalance?.lt(new BN(0))
                ? 'disable-link'
                : ''
            }`}>
            <button
              className={`btn-primary btn w-[180px]`}
              disabled={
                !currentWalletAccount ||
                daoTokenBalance?.isZero() ||
                !daoTokenBalance?.lt(new BN(0))
              }>
              Send Tokens
            </button>
          </Link>
          {currentDao &&
            currentWalletAccount?.address === currentDao.daoOwnerAddress && (
              <DestroyDao
                daoId={currentDao?.daoId}
                assetId={currentDao.daoAssetId}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default DaoDashboard;
