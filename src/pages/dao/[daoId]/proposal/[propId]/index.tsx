import { BN, formatBalance } from '@polkadot/util';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';

import { statusColors } from '@/components/ProposalCard';
import Spinner from '@/components/Spinner';
import WalletConnect from '@/components/WalletConnect';
import { DAO_UNITS } from '@/config';
import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';
import arrowLeft from '@/svg/arrow-left.svg';
import MainLayout from '@/templates/MainLayout';
import { getProposalEndTime } from '@/utils/index';

const Proposal = () => {
  const router = useRouter();
  const { daoId, propId } = router.query;

  const [voteSelection, setVoteSelection] = useState<
    'In Favor' | 'Against' | null
  >(null);

  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const daoTokenBalance = useGenesisStore((s) => s.daoTokenBalance);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const currentProposal = useGenesisStore((s) => s.currentProposal);
  const currentBlockNumber = useGenesisStore((s) => s.currentBlockNumber);
  const p = currentProposal;

  const fetchOneProposalDB = useGenesisStore((s) => s.fetchOneProposalDB);
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const fetchDaoTokenBalanceFromDB = useGenesisStore(
    (s) => s.fetchDaoTokenBalanceFromDB
  );
  const updateDaoPage = useGenesisStore((s) => s.updateDaoPage);
  const dhmMemo = useMemo(() => {
    return p?.birthBlock && currentBlockNumber
      ? getProposalEndTime(currentBlockNumber, p.birthBlock, 14400)
      : { d: 0, h: 0, m: 0 };
  }, [p, currentBlockNumber]);

  const inFavorPercentageMemo = useMemo(() => {
    const inFavorVotes = p?.inFavor || new BN(0);
    const againstVotes = p?.against || new BN(0);
    const totalVotes = inFavorVotes.add(againstVotes);
    const inFavorPercentage = inFavorVotes.isZero()
      ? new BN(0)
      : inFavorVotes.mul(new BN(100)).div(totalVotes);

    return inFavorPercentage.toString();
  }, [p]);

  const againstPercentageMemo = useMemo(() => {
    const inFavorVotes = p?.inFavor || new BN(0);
    const againstVotes = p?.against || new BN(0);
    const totalVotes = inFavorVotes.add(againstVotes);
    const againstPercentage = againstVotes.isZero()
      ? new BN(0)
      : againstVotes.mul(new BN(100)).div(totalVotes);
    return againstPercentage.toString();
  }, [p]);

  const { makeVoteTxn, sendBatchTxns } = useGenesisDao();

  const updateIsStartModalOpen = useGenesisStore(
    (s) => s.updateIsStartModalOpen
  );

  const handleStartModal = () => {
    updateIsStartModalOpen(true);
  };

  const handleVote = () => {
    if (!p?.proposalId) {
      return;
    }
    let txns = [];
    if (voteSelection === 'In Favor') {
      txns = makeVoteTxn([], p?.proposalId, true);
    } else if (voteSelection === 'Against') {
      txns = makeVoteTxn([], p?.proposalId, false);
    }

    sendBatchTxns(txns, 'Voted Successfully', 'Vote Transaction Failed', () => {
      setVoteSelection(null);
      setTimeout(() => {
        fetchOneProposalDB(daoId as string, propId as string);
      }, 2000);
    });
  };

  const handleReturnToDashboard = () => {
    updateDaoPage('proposals');
    router.push(`/dao/${daoId as string}/`);
  };

  const handleVoteSelection = (e: any) => {
    if (e.target.textContent === 'In Favor') {
      setVoteSelection('In Favor');
    } else if (e.target.textContent === 'Against') {
      setVoteSelection('Against');
    }
  };

  useEffect(() => {
    if (daoId && propId) {
      const timer = setTimeout(() => {
        fetchOneProposalDB(daoId as string, propId as string);
        fetchDaoFromDB(daoId as string);
        // eslint-disable-next-line
        return () => clearTimeout(timer);
      }, 500);
    }
  }, [daoId, propId]);

  useEffect(() => {
    if (currentDao?.daoAssetId && currentWalletAccount) {
      fetchDaoTokenBalanceFromDB(
        currentDao?.daoAssetId,
        currentWalletAccount.address
      );
    }
  }, [currentDao, currentWalletAccount, fetchDaoTokenBalanceFromDB]);

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
        <div className='container flex min-h-[640px] basis-3/4 justify-center p-6'>
          {!currentProposal ? (
            <div className='mt-10'>
              {' '}
              <Spinner />
            </div>
          ) : (
            <div className='flex w-full flex-col gap-y-3'>
              <div className='flex justify-between'>
                <div className='mr-4'>
                  <p className='text-sm'>{p?.proposalId}</p>
                  <h3 className='text-2xl'>{p?.proposalName}</h3>
                </div>
                <div className='flex'>
                  <div className='mr-4 flex gap-2'>
                    Ends
                    <div className='flex gap-2'>
                      <div className='h-6 bg-base-card px-2'>{dhmMemo.d}d</div>:
                      <div className='h-6 bg-base-card px-2'>{dhmMemo.h}h</div>:
                      <div className='h-6 bg-base-card px-2'>{dhmMemo.m}m</div>
                    </div>
                  </div>
                  <div
                    className={`rounded-lg ${
                      !p?.status ? '' : statusColors[`${p?.status}`]
                    } h-7 rounded-3xl py-1 px-3 text-center text-sm`}>
                    {p?.status}
                  </div>
                </div>
              </div>
              <div>
                <p className='w-full truncate break-words rounded-xl border-[0.3px] border-neutral-focus p-4'>
                  <span className='font-semibold '>Discussion Link:</span>
                  <span className='ml-2 text-sm underline'>
                    <a
                      href={p?.link || ''}
                      target='_blank'
                      rel='external nofollow noreferrer'>
                      {p?.link || ''}
                    </a>
                  </span>
                </p>
              </div>
              <div className='description-display'>
                {ReactHtmlParser(p?.description || '')}
              </div>
            </div>
          )}
        </div>
        <div className='flex min-h-[640px] min-w-[300px] basis-1/4 flex-col items-center gap-y-4'>
          <div className='container flex flex-col items-center justify-center gap-y-2 p-4'>
            <p className='mb-1 text-center text-xl'>Your Voting Power</p>
            <div className='flex h-[80px] w-[240px] items-center justify-center rounded-xl bg-base-50 px-4'>
              <div className='px-5 text-center text-sm'>
                {!currentWalletAccount?.address ? (
                  <p className=''>Connect Wallet To View Tokens</p>
                ) : (
                  <div className='flex flex-col'>
                    <p>You have</p>
                    <p>
                      {' '}
                      {formatBalance(
                        daoTokenBalance?.div(new BN(DAO_UNITS)) || new BN(0),
                        {
                          withZero: false,
                          forceUnit: `${daoId}`,
                        }
                      )}{' '}
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
                <button
                  className='btn-primary btn min-w-[250px]'
                  onClick={handleVote}>
                  Vote
                </button>
              ) : (
                <WalletConnect
                  text={'Connect To Vote'}
                  onClose={handleStartModal}
                />
              )}
            </div>
          </div>
          <div className='container flex min-w-[250px] flex-col items-center gap-y-3 p-4'>
            <p className='text-xl'>Voting Progress</p>
            <div className='flex w-[100%] flex-col pr-6'>
              <div className='relative mb-2 flex w-full justify-between'>
                <div
                  className={`h-7 bg-[#403945]`}
                  style={{ width: `${inFavorPercentageMemo}%` }}>
                  <div className='absolute p-1 text-sm'>
                    In Favor (
                    {p?.inFavor
                      ? p.inFavor.div(new BN(DAO_UNITS)).toString()
                      : new BN(0).toString()}
                    )
                  </div>
                </div>
                <p className='ml-1'>{`${inFavorPercentageMemo}% `}</p>
              </div>
              <div className='relative mb-2 flex w-full justify-between'>
                <div
                  className={`h-7 bg-[#403945]`}
                  style={{ width: `${againstPercentageMemo}%` }}>
                  <div className='absolute p-1 text-sm'>
                    <p className=''>
                      Against (
                      {p?.against
                        ? p.against.div(new BN(DAO_UNITS)).toString()
                        : new BN(0).toString()}
                      )
                    </p>
                  </div>
                </div>
                <p className='ml-1'>{`${againstPercentageMemo}%`}</p>
              </div>
            </div>
          </div>
          <div className='container flex min-w-[250px] flex-col items-center gap-y-3 p-4'>
            <p className='text-xl'>Report</p>
            <p className='text-sm'>
              {`If you find this proposal does not align with the organization's
              goals and priorities, you can report the proposal as faulty and
              council members will investigate this proposal`}
            </p>
            <button className='btn-disabled btn'>
              Report This Proposal As Faulty
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Proposal;
