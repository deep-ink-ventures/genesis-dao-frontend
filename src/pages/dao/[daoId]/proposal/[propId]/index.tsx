import { BN, formatBalance } from '@polkadot/util';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { statusColors } from '@/components/ProposalCard';
import WalletConnect from '@/components/WalletConnect';
import type { ProposalDetail } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import { fakeProposals } from '@/stores/placeholderValues';
import arrowLeft from '@/svg/arrow-left.svg';
import MainLayout from '@/templates/MainLayout';
import { getProposalEndTime } from '@/utils/index';

const Proposal = () => {
  const router = useRouter();
  const { daoId } = router.query;
  // const [curBlockNum, setCurBlockNum] = useState(42056)
  const currentBlockNumber = 42450;
  const [voteSelection, setVoteSelection] = useState<
    'In Favor' | 'Against' | null
  >(null);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const daoTokenBalance = useGenesisStore((s) => s.daoTokenBalance);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const p = fakeProposals[0] as ProposalDetail;

  const updateIsStartModalOpen = useGenesisStore(
    (s) => s.updateIsStartModalOpen
  );

  const dhm = getProposalEndTime(currentBlockNumber, p.birthBlock, 14400);
  // const fetchBlockNumber = useGenesisStore((s) =>s.fetchBlockNumber)

  const handleStartModal = () => {
    updateIsStartModalOpen(true);
  };

  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const fetchDaoTokenBalanceFromDB = useGenesisStore(
    (s) => s.fetchDaoTokenBalanceFromDB
  );
  formatBalance.setDefaults({ decimals: 0, unit: `${currentDao?.daoId}` });
  const inFavorVotes = p.inFavor;
  const againstVotes = p.against;
  const totalVotes = inFavorVotes.add(againstVotes);
  const inFavorPercentage = inFavorVotes.mul(new BN(100)).div(totalVotes);
  const againstPercentage = againstVotes.mul(new BN(100)).div(totalVotes);

  const handleReturnToDashboard = () => {
    router.push(`/dao/${daoId as string}/proposals`);
  };

  const handleVoteSelection = (e: any) => {
    console.log(e.target.textContent === 'In Favor');
    if (e.target.textContent === 'In Favor') {
      setVoteSelection('In Favor');
    } else if (e.target.textContent === 'Against') {
      setVoteSelection('Against');
    }
  };

  useEffect(() => {
    if (daoId) {
      fetchDaoFromDB(daoId as string);
    }
  }, [daoId, fetchDaoFromDB]);

  useEffect(() => {
    if (currentDao?.daoAssetId && currentWalletAccount) {
      fetchDaoTokenBalanceFromDB(
        currentDao?.daoAssetId,
        currentWalletAccount.address
      );
    }
  }, [currentDao, currentWalletAccount, fetchDaoTokenBalanceFromDB]);

  // useEffect(() => {
  //   fetchBlockNumber()
  // })

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO - Create a DAO'>
      <div
        className='mt-5 flex w-[65px] items-center justify-between hover:cursor-pointer hover:underline'
        onClick={handleReturnToDashboard}>
        <Image src={arrowLeft} width={13} height={7} alt='arrow-left' />
        <div>Back</div>
      </div>
      <div className='mt-5 flex min-h-[500px] justify-between gap-x-4'>
        <div className='container flex min-h-[640px] basis-3/4 p-4'>
          <div className='flex flex-col gap-y-3'>
            <div className='flex justify-between'>
              <div className='mr-4'>
                <p className='text-sm'>{p?.proposalId}</p>
                <h3 className='text-lg'>{p?.proposalName}</h3>
              </div>
              <div className='flex'>
                <div className='mr-4 flex gap-2'>
                  Ends
                  <div className='flex gap-2'>
                    <div className='h-6 bg-base-card px-2'>{dhm.d}d</div>:
                    <div className='h-6 bg-base-card px-2'>{dhm.h}h</div>:
                    <div className='h-6 bg-base-card px-2'>{dhm.m}m</div>
                  </div>
                </div>
                <div
                  className={`rounded-lg ${
                    statusColors[`${p?.status}`]
                  } h-7 rounded-3xl py-1 px-3 text-center text-sm`}>
                  {p?.status}
                </div>
              </div>
            </div>
            <div>
              <p className='max-w-[600px] truncate break-words rounded-xl border-[0.3px] border-neutral-focus p-4'>
                <span className='font-semibold '>Discussion Link:</span>
                <span className='ml-2 text-sm underline'>
                  <a
                    href={p.link}
                    target='_blank'
                    rel='external nofollow noreferrer'>
                    {p.link}
                  </a>
                </span>
              </p>
            </div>
            <div className='break-words text-sm'>{p?.description}</div>
          </div>
        </div>
        <div className='flex min-h-[640px] min-w-[300px] basis-1/4 flex-col items-center gap-y-4'>
          <div className='container flex flex-col items-center justify-center gap-y-2 p-4'>
            <p className='mb-1 text-center text-xl'>Your Voting Power</p>
            <div className='flex h-[80px] w-[240px] items-center justify-between rounded-xl bg-base-50 px-4'>
              <div className='px-5 text-center text-sm'>
                {!currentWalletAccount?.address ? (
                  <p className='text-primary'>Connect Wallet To View Tokens</p>
                ) : (
                  <div className='flex flex-col'>
                    <p>You have</p>
                    <p>
                      {' '}
                      {formatBalance(daoTokenBalance || new BN(0), {
                        withZero: false,
                        forceUnit: `${daoId}`,
                      })}{' '}
                      tokens
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='container flex min-w-[250px] flex-col items-center justify-center gap-y-2 rounded-xl p-4'>
            <p className='text-xl font-semibold text-primary'>Cast Your Vote</p>
            {currentWalletAccount ? (
              <div className='flex flex-col gap-y-2'>
                <div
                  className={`btn-vote flex min-w-[250px] items-center justify-center rounded-3xl border-2 border-neutral-focus bg-transparent hover:cursor-pointer hover:bg-neutral-focus hover:text-primary-content ${
                    voteSelection === 'In Favor'
                      ? ' border-success font-semibold text-success outline  hover:bg-transparent hover:text-success'
                      : 'text-white'
                  } ${voteSelection === 'Against' ? 'brightness-50' : ''}`}
                  onClick={(e) => {
                    handleVoteSelection(e);
                  }}>
                  {/* <Image
                    src={thumbUp}
                    height={16}
                    width={16}
                    alt='thumb-up'
                    className='mr-2'
                  /> */}
                  In Favor
                </div>
                <div
                  className={`btn-vote flex min-w-[250px] items-center justify-center rounded-3xl border-2 border-neutral-focus bg-transparent hover:cursor-pointer hover:bg-neutral-focus hover:text-primary-content ${
                    voteSelection === 'Against'
                      ? 'border-secondary text-secondary outline hover:bg-transparent hover:text-secondary'
                      : 'text-white '
                  } ${voteSelection === 'In Favor' ? 'brightness-50' : ''}`}
                  onClick={(e) => {
                    handleVoteSelection(e);
                  }}>
                  {/* <Image
                    src={thumbDown}
                    height={16}
                    width={16}
                    alt='thumb-down'
                    className={`mr-2 vote-down`}
                  /> */}
                  Against
                </div>
              </div>
            ) : null}
            <div>
              {currentWalletAccount ? (
                <button className='btn-primary btn min-w-[250px]'>Vote</button>
              ) : (
                <WalletConnect
                  text={'Connect To Vote'}
                  onClose={handleStartModal}
                />
              )}
            </div>
          </div>
          <div className='justify-content container flex min-w-[250px] flex-col items-center gap-y-3 p-4'>
            <p className='text-xl'>Voting Progress</p>
            <div className='flex w-[100%] flex-col pr-6'>
              <div className='relative mb-2 flex w-full justify-between'>
                <div
                  className={`h-7 bg-[#403945]`}
                  style={{ width: `${inFavorPercentage.toString()}%` }}>
                  <div className='absolute p-1 text-sm'>In Favor</div>
                </div>
                <p>{`${inFavorPercentage.toString()}% `}</p>
              </div>
              <div className='relative mb-2 flex w-full justify-between'>
                <div
                  className={`h-7 bg-[#403945]`}
                  style={{ width: `${againstPercentage.toString()}%` }}>
                  <div className='absolute p-1 text-sm'>
                    <p className=''>Against</p>
                  </div>
                </div>
                <p>{`${againstPercentage.toString()}%`}</p>
              </div>
            </div>
          </div>
          <div className='justify-content container flex min-w-[250px] flex-col items-center gap-y-3 p-4'>
            <p className='text-xl'>Report</p>
            <p className='text-sm'>
              {`If you find this proposal does not align with the organization's
              goals and priorities, you can report the proposal as faulty and
              council members will investigate this proposal`}
            </p>
            <button className='btn'>Report This Proposal As Faulty</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Proposal;
