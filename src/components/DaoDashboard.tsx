import { BN } from '@polkadot/util';
import Image from 'next/image';
import Link from 'next/link';

import type { BadgeVariant } from '@/components/Badge';
import Badge from '@/components/Badge';
import DestroyDao from '@/components/DestroyDao';
import StatusCard from '@/components/StatusCard';
import useGenesisStore from '@/stores/genesisStore';
import TrendingUp from '@/svg/trending-up.svg';

type ProposalStatus = 'running' | 'rejected' | 'pending' | 'finished';

const ProposalStatusBadgeMap: Record<ProposalStatus, BadgeVariant> = {
  running: 'none',
  rejected: 'danger',
  pending: 'warning',
  finished: 'success',
};

const ProposalRow = ({
  title,
  time,
  status = 'running',
}: {
  title?: string;
  time?: { d: number; h: number; m: number };
  status?: ProposalStatus;
}) => {
  return (
    <div className='flex min-w-0 items-center gap-4'>
      <p className='truncate'>{title}</p>
      <div className='ml-auto flex items-center text-xs'>
        <div className='mr-4 flex items-center gap-2'>
          Ends
          <div className='flex gap-2'>
            <div className='flex h-6 items-center bg-base-card px-2'>
              {time?.d}d
            </div>
            :
            <div className='flex h-6 items-center bg-base-card px-2'>
              {time?.h}h
            </div>
            :
            <div className='flex h-6 items-center bg-base-card px-2'>
              {time?.m}m
            </div>
          </div>
        </div>
        <Badge
          variant={ProposalStatusBadgeMap[status]}
          className='text-xs capitalize'>
          {status}
        </Badge>
      </div>
    </div>
  );
};

const DaoDashboard = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const daoTokenBalance = useGenesisStore((s) => s.daoTokenBalance);

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
                  daoTokenBalance?.isZero() ||
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
                !daoTokenBalance?.gt(new BN(0))
                  ? 'disable-link'
                  : ''
              }`}>
              <button
                className={`btn-primary btn w-[180px]`}
                disabled={
                  !currentWalletAccount ||
                  daoTokenBalance?.isZero() ||
                  !daoTokenBalance?.gt(new BN(0))
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
      <div className='mt-2 flex w-full gap-2'>
        <div className='w-72 space-y-2'>
          <StatusCard
            header='Token Holders'
            value={200}
            footer={
              <>
                <Image
                  src={TrendingUp}
                  width={18}
                  height={18}
                  alt='Trending Up'
                />
                <div className='text-primary'>2%</div>
                vs last week
              </>
            }
          />
          <StatusCard
            header='Open Proposals'
            value={428}
            footer={
              <>
                <Image
                  src={TrendingUp}
                  width={18}
                  height={18}
                  alt='Trending Up'
                />
                <div className='text-primary'>1%</div>
                vs last week
              </>
            }
          />
        </div>
        <div className='container min-w-0 space-y-2 p-8'>
          <div className='flex'>
            <span className='text-sm font-bold uppercase'>
              Latest Proposals
            </span>
            <span className='ml-auto font-medium'>See All</span>
          </div>
          <div className='space-y-4'>
            {Array(5)
              .fill(null)
              .map((i, index) => (
                <ProposalRow
                  key={index}
                  title='Proposal Title Lorem ipsum dolor sit amet Proposal Title Lorem ipsum
                dolor sit ame...'
                  status='finished'
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DaoDashboard;
