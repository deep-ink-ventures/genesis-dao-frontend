import { BN } from '@polkadot/util';
import cn from 'classnames';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import type { BadgeVariant } from '@/components/Badge';
import Badge from '@/components/Badge';
import StatusCard from '@/components/StatusCard';
import type { AssetHolding } from '@/services/assets';
import { AssetsHoldingsService } from '@/services/assets';
import { ProposalsService } from '@/services/proposals';
import useGenesisStore from '@/stores/genesisStore';
import type { ProposalDetail } from '@/types/proposal';
import { ProposalStatus } from '@/types/proposal';
import { getProposalEndTime } from '@/utils';

import TransferAssetModal from './TransferAssetModal';

const ProposalStatusBadgeMap: Record<ProposalStatus, BadgeVariant> = {
  Active: 'none',
  Counting: 'warning',
  Accepted: 'success',
  Rejected: 'danger',
  Faulty: 'danger',
};

const ProposalRow = ({ proposal }: { proposal: ProposalDetail }) => {
  const [currentBlockNumber, currentDao] = useGenesisStore((s) => [
    s.currentBlockNumber,
    s.currentDao,
  ]);

  const dhmMemo = useMemo(() => {
    return proposal?.birthBlock &&
      currentBlockNumber &&
      currentDao?.proposalDuration
      ? getProposalEndTime(
          currentBlockNumber,
          proposal?.birthBlock,
          currentDao?.proposalDuration
        )
      : { d: 0, h: 0, m: 0 };
  }, [proposal, currentBlockNumber, currentDao?.proposalDuration]);

  return (
    <div className='flex min-w-0 items-center gap-4'>
      <p className='truncate'>{proposal.proposalName}</p>
      <div className='ml-auto flex items-center text-xs'>
        {proposal.status === ProposalStatus.Active && (
          <div className='mr-4 flex items-center gap-2'>
            Ends
            <div className='flex gap-2'>
              <div className='flex h-6 items-center bg-base-card px-2'>
                {dhmMemo?.d}d
              </div>
              :
              <div className='flex h-6 items-center bg-base-card px-2'>
                {dhmMemo?.h}h
              </div>
              :
              <div className='flex h-6 items-center bg-base-card px-2'>
                {dhmMemo?.m}m
              </div>
            </div>
          </div>
        )}
        <div className='w-16'>
          {proposal.status != null && (
            <Badge
              variant={ProposalStatusBadgeMap[proposal.status]}
              className='ml-auto w-fit text-xs capitalize'>
              {proposal.status}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

const DaoDashboard = () => {
  const [currentWalletAccount, updateDaoPage, txnProcessing] = useGenesisStore(
    (s) => [s.currentWalletAccount, s.updateDaoPage, s.txnProcessing]
  );
  const currentDao = useGenesisStore((s) => s.currentDao);
  const daoTokenBalance = useGenesisStore((s) => s.daoTokenBalance);

  const [assetHolding, setAssetHolding] = useState<AssetHolding>();
  const [isTransferTokensVisible, setIsTransferTokensVisible] = useState(false);

  const [latestProposals, setLatestProposals] = useState<
    ProposalDetail[] | null
  >();

  useEffect(() => {
    if (currentDao?.daoId) {
      ProposalsService.listProposals({
        dao_id: currentDao.daoId,
        limit: 5,
        ordering: '-id',
      }).then((result) => {
        setLatestProposals(result.mappedData);
      });
      if (currentDao.daoAssetId) {
        AssetsHoldingsService.listAssetHoldings({
          assetId: currentDao.daoAssetId.toString(),
          ownerId: currentWalletAccount?.address,
        }).then((result) => {
          setAssetHolding(result?.results?.[0]);
        });
      }
    }
  }, [
    currentDao?.daoAssetId,
    currentDao?.daoId,
    currentWalletAccount?.address,
  ]);

  const hasNoDaoTokenBalance =
    !currentWalletAccount ||
    daoTokenBalance?.isZero() ||
    !daoTokenBalance?.gt(new BN(0));

  return (
    <>
      <div className='container w-full space-y-4 p-6'>
        <div>
          <h1>{currentDao?.daoName}</h1>
        </div>
        <div>
          <p>{currentDao?.descriptionShort}</p>
        </div>
        <div>
          <div className='mt-16 flex flex-wrap gap-x-4'>
            {currentDao?.setupComplete ||
            currentWalletAccount?.address !==
              currentDao?.daoOwnerAddress ? null : (
              <Link
                href={`/dao/${encodeURIComponent(
                  currentDao?.daoId as string
                )}/customize`}
                className={`${!currentWalletAccount ? 'disable-link' : ''}`}>
                <button
                  className={`btn btn-primary w-[180px]`}
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
                className={cn(`btn btn-primary w-[180px]`, {
                  loading: txnProcessing,
                })}
                disabled={
                  !currentWalletAccount ||
                  daoTokenBalance?.isZero() ||
                  !currentDao?.setupComplete
                }>
                Create Proposal
              </button>
            </Link>
            {assetHolding && !hasNoDaoTokenBalance && (
              <button
                onClick={() => setIsTransferTokensVisible(true)}
                className={cn(`btn btn-primary w-[180px]`, {
                  loading: txnProcessing,
                })}
                disabled={hasNoDaoTokenBalance}>
                Send Tokens
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='mt-2 flex w-full gap-2'>
        <div className='flex w-72 flex-col gap-2'>
          <StatusCard
            header='Token Holders'
            value={currentDao?.numberOfTokenHolders || 0}
          />
          <StatusCard
            header='Open Proposals'
            value={currentDao?.numberOfOpenProposals || 0}
          />
        </div>
        <div className='container min-w-0 p-8'>
          <div className='mb-8 flex'>
            <span className='text-sm font-bold uppercase'>
              Latest Proposals
            </span>
            <span
              className='ml-auto cursor-pointer font-medium hover:underline'
              onClick={() => updateDaoPage('proposals')}>
              See All
            </span>
          </div>
          <div className='space-y-4'>
            {latestProposals?.map((proposal, index) => (
              <ProposalRow
                key={`${index}-${proposal.proposalId}`}
                proposal={proposal}
              />
            ))}
          </div>
        </div>
      </div>
      {assetHolding && !hasNoDaoTokenBalance && (
        <TransferAssetModal
          assetHolding={assetHolding}
          daoId={currentDao?.daoId}
          daoImage={currentDao?.images?.small}
          open={isTransferTokensVisible}
          onClose={() => setIsTransferTokensVisible(false)}
        />
      )}
    </>
  );
};

export default DaoDashboard;
