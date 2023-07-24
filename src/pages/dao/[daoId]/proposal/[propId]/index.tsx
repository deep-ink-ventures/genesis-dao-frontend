import { BN } from '@polkadot/util';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';

import FaultyModal from '@/components/FaultyModal';
import FaultyReportsModal from '@/components/FaultyReportsModal';
import Spinner from '@/components/Spinner';
import Tooltip from '@/components/Tooltip';
import { statusColors } from '@/components/TransactionBadge';
import WalletConnect from '@/components/WalletConnect';
import { DAO_UNITS } from '@/config';
import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';
import alert from '@/svg/alert.svg';
import arrowLeft from '@/svg/arrow-left.svg';
import ThumbDown from '@/svg/components/thumbdown';
import ThumbUp from '@/svg/components/thumbup';
import MainLayout from '@/templates/MainLayout';
import { ProposalStatus } from '@/types/proposal';
import { getProposalEndTime, uiTokens } from '@/utils';

const Proposal = () => {
  const router = useRouter();
  const { daoId, propId } = router.query;
  const [voteSelection, setVoteSelection] = useState<
    'In Favor' | 'Against' | null
  >(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStatusRefreshing, setIsStatusRefreshing] = useState(false);
  const [
    currentWalletAccount,
    daoTokenBalance,
    currentDao,
    p,
    currentBlockNumber,
    apiConnection,
    isFaultyModalOpen,
    currentProposalFaultyReports,
    txnProcessing,
    createApiConnection,
    fetchOneProposalDB,
    fetchDaoFromDB,
    fetchDaoTokenBalanceFromDB,
    updateDaoPage,
    updateBlockNumber,
    updateIsFaultyModalOpen,
    fetchProposalFaultyReports,
    updateIsFaultyReportsOpen,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.daoTokenBalance,
    s.currentDao,
    s.currentProposal,
    s.currentBlockNumber,
    s.apiConnection,
    s.isFaultyModalOpen,
    s.currentProposalFaultyReports,
    s.txnProcessing,
    s.createApiConnection,
    s.fetchOneProposalDB,
    s.fetchDaoFromDB,
    s.fetchDaoTokenBalanceFromDB,
    s.updateDaoPage,
    s.updateBlockNumber,
    s.updateIsFaultyModalOpen,
    s.fetchProposalFaultyReports,
    s.updateIsFaultyReportsOpen,
  ]);
  const { makeVoteTxn, sendBatchTxns, makeFinalizeProposalTxn } =
    useGenesisDao();

  const dhmMemo = useMemo(() => {
    return p?.birthBlock && currentBlockNumber && currentDao?.proposalDuration
      ? getProposalEndTime(
          currentBlockNumber,
          p.birthBlock,
          currentDao?.proposalDuration
        )
      : { d: 0, h: 0, m: 0 };
  }, [p, currentBlockNumber, currentDao?.proposalDuration]);

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

  const proposalIsRunning = useMemo(() => {
    if (
      (p?.birthBlock || 0) + (currentDao?.proposalDuration || 14400) >
      (currentBlockNumber || 0)
    ) {
      return true;
    }
    return false;
  }, [p, currentDao, currentBlockNumber]);

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

    sendBatchTxns(
      txns,
      `Voted ${voteSelection} Successfully`,
      'Vote Transaction Failed',
      () => {
        setVoteSelection(null);
        setIsRefreshing(true);
        setTimeout(() => {
          fetchOneProposalDB(daoId as string, propId as string);
        }, 6000);
        setTimeout(() => {
          setIsRefreshing(false);
        }, 6500);
      }
    );
  };

  const handleBack = () => {
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

  const handleFinalize = () => {
    if (!p?.proposalId) {
      return;
    }
    const txn = makeFinalizeProposalTxn([], p?.proposalId);

    sendBatchTxns(
      txn,
      'Finalized Proposal Successfully',
      'Transaction Failed',
      () => {
        setIsStatusRefreshing(true);
        setTimeout(() => {
          fetchOneProposalDB(daoId as string, propId as string);
        }, 6000);
        setTimeout(() => {
          setIsStatusRefreshing(false);
        }, 6500);
      }
    );
  };

  useEffect(() => {
    if (daoId && propId) {
      const timer = setTimeout(() => {
        fetchOneProposalDB(daoId as string, propId as string);
        fetchDaoFromDB(daoId as string);
        fetchProposalFaultyReports(propId as string);
        // eslint-disable-next-line
        return () => clearTimeout(timer);
      }, 200);
    }
  }, [
    daoId,
    propId,
    fetchOneProposalDB,
    fetchDaoFromDB,
    fetchProposalFaultyReports,
  ]);

  useEffect(() => {
    if (currentDao?.daoAssetId && currentWalletAccount) {
      fetchDaoTokenBalanceFromDB(
        currentDao?.daoAssetId,
        currentWalletAccount.address
      );
    }
  }, [currentDao, currentWalletAccount, fetchDaoTokenBalanceFromDB]);

  useEffect(() => {
    if (!currentBlockNumber) {
      return;
    }
    const timeout = setTimeout(() => {
      updateBlockNumber(currentBlockNumber + 1);
    }, 6000);
    // eslint-disable-next-line
    return () => clearTimeout(timeout);
  }, [currentBlockNumber, updateBlockNumber]);

  useEffect(() => {
    if (!apiConnection) {
      createApiConnection();
    }
    // eslint-disable-next-line
  }, []);

  const displayVoteButton = () => {
    if (!currentWalletAccount) {
      return (
        <WalletConnect text={'Connect To Vote'} onClose={handleStartModal} />
      );
    }

    if (!daoTokenBalance || !daoTokenBalance.gt(new BN(0))) {
      return (
        <button className='btn' disabled>
          {`You Can't Vote. No Tokens`}
        </button>
      );
    }

    return (
      <Tooltip
        placement='top'
        content={`Please note, that creating a proposal requires a one-time deposit of ${currentDao?.proposalTokenDeposit} tokens`}>
        <button className='btn-primary btn min-w-[250px]' onClick={handleVote}>
          Vote
        </button>
      </Tooltip>
    );
  };

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO - Create a DAO'>
      <div
        className='mt-5 flex w-[65px] items-center justify-between hover:cursor-pointer hover:underline'
        onClick={handleBack}>
        <Image src={arrowLeft} width={13} height={7} alt='arrow-left' />
        <div>Back</div>
      </div>
      <div className='mt-5 flex min-h-[500px] justify-between gap-x-4'>
        <div className='container flex min-h-[640px] basis-3/4 justify-center p-6'>
          {!p || p.proposalId !== propId ? (
            <div className='mt-10'>
              {' '}
              <Spinner />
            </div>
          ) : (
            <div className='flex w-full flex-col gap-y-3'>
              <div className='flex justify-between'>
                <div className='mr-4'>
                  <p className='text-sm'>Proposal ID: {p?.proposalId}</p>
                  <h3 className='text-2xl'>{p?.proposalName}</h3>
                </div>
                <div className='flex'>
                  {proposalIsRunning ? (
                    <div className='mr-4 flex gap-2'>
                      Ends in
                      <div className='flex gap-2'>
                        <div className='h-6 bg-base-card px-2'>
                          {dhmMemo.d}d
                        </div>
                        :
                        <div className='h-6 bg-base-card px-2'>
                          {dhmMemo.h}h
                        </div>
                        :
                        <div className='h-6 bg-base-card px-2'>
                          {dhmMemo.m}m
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='mr-4 flex flex-col'>
                      <p>Ended </p>
                    </div>
                  )}
                  {isStatusRefreshing ? (
                    <Spinner size='20' />
                  ) : (
                    <div
                      className={`rounded-lg ${
                        !p?.status ? '' : statusColors[`${p?.status}`]
                      } h-7 rounded-3xl px-3 py-1 text-center text-sm`}>
                      {p?.status}
                    </div>
                  )}
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
          {currentProposalFaultyReports &&
          currentProposalFaultyReports?.length > 0 ? (
            <div className='container flex min-h-[100px] flex-col items-center justify-center p-3 text-center'>
              <div className='mb-4 flex items-center'>
                <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-warning'>
                  <Image src={alert} height={24} width={24} alt='alert' />
                </div>
                <div className='w-[200px] text-left text-sm'>
                  This proposal has been reported as faulty by one or more DAO
                  members
                </div>
              </div>
              {currentWalletAccount &&
              (currentDao?.daoCreatorAddress === currentWalletAccount.address ||
                currentDao?.daoOwnerAddress ===
                  currentWalletAccount.address) ? (
                <div>
                  <button
                    className='btn-primary btn mb-2'
                    onClick={() => {
                      updateIsFaultyReportsOpen(true);
                    }}>
                    See Reports
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <FaultyReportsModal proposalId={propId as string} />

          {p?.status === ProposalStatus.Active && !proposalIsRunning ? (
            <div className='container flex min-h-[100px] flex-col items-center justify-center p-4 text-center'>
              <p>Please finalize proposal to update its status</p>
              <button
                className={`btn-primary btn my-3 ${
                  txnProcessing ? 'loading' : ''
                } ${currentWalletAccount ? '' : 'btn-disabled'}`}
                onClick={handleFinalize}>
                Finalize
              </button>
            </div>
          ) : null}

          {p?.status === ProposalStatus.Active && proposalIsRunning ? (
            <div className='container flex flex-col items-center justify-center gap-y-2 p-4'>
              <p className='mb-1 text-center text-xl'>Your Voting Power</p>
              <div className='flex h-[80px] w-[240px] items-center justify-center rounded-xl bg-base-50 px-4'>
                <div className='px-5 text-center text-sm'>
                  {!currentWalletAccount?.address ? (
                    <p className=''>Connect Wallet To View Tokens</p>
                  ) : (
                    <div className='flex flex-col'>
                      <p>You have</p>
                      <p> {uiTokens(daoTokenBalance, 'dao', p?.daoId)} </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {p?.status === ProposalStatus.Active && proposalIsRunning ? (
            <div className='container flex min-w-[250px] flex-col items-center justify-center gap-y-2 rounded-xl p-4'>
              <p className='text-xl font-semibold text-primary'>
                Cast Your Vote
              </p>
              {currentWalletAccount ? (
                <div className='flex flex-col gap-y-2'>
                  <div
                    className={`btn-vote group flex min-w-[250px] items-center justify-center rounded-3xl border-2 border-neutral-focus bg-transparent hover:cursor-pointer hover:bg-neutral-focus hover:text-primary-content ${
                      voteSelection === 'In Favor'
                        ? ' border-success font-semibold text-success outline  hover:bg-transparent hover:text-success'
                        : 'text-white'
                    } ${voteSelection === 'Against' ? 'brightness-50' : ''}`}
                    onClick={(e) => {
                      handleVoteSelection(e);
                    }}>
                    <ThumbUp
                      className={cn('mr-2', {
                        '[&_path]:stroke-success': voteSelection === 'In Favor',
                        '[&_path]:group-hover:stroke-primary-content':
                          voteSelection !== 'In Favor',
                      })}
                    />
                    In Favor
                  </div>
                  <div
                    className={`btn-vote group flex min-w-[250px] items-center justify-center rounded-3xl border-2 border-neutral-focus bg-transparent hover:cursor-pointer hover:bg-neutral-focus hover:text-primary-content ${
                      voteSelection === 'Against'
                        ? 'border-secondary text-secondary outline hover:bg-transparent hover:text-secondary'
                        : 'text-white '
                    } ${voteSelection === 'In Favor' ? 'brightness-50' : ''}`}
                    onClick={(e) => {
                      handleVoteSelection(e);
                    }}>
                    <ThumbDown
                      className={cn('mr-2', {
                        '[&_path]:stroke-secondary':
                          voteSelection === 'Against',
                        '[&_path]:group-hover:stroke-primary-content':
                          voteSelection !== 'Against',
                      })}
                    />
                    Against
                  </div>
                </div>
              ) : null}
              <div>{displayVoteButton()}</div>
            </div>
          ) : null}

          <div className='container flex min-w-[250px] flex-col items-center gap-y-3 p-4'>
            <p className='text-xl'>
              Voting{' '}
              {p?.status === 'Active' && proposalIsRunning
                ? 'Progress'
                : 'Result'}
            </p>
            {isRefreshing ? (
              <Spinner />
            ) : (
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
            )}
          </div>
          {p?.status === 'Active' ? (
            <div className='container flex min-w-[250px] flex-col items-center gap-y-3 p-4'>
              <p className='text-xl'>Report</p>
              <p className='text-sm'>
                {`If you find this proposal does not align with the organization's
              goals and priorities, you can report the proposal as faulty and
              council members will investigate this proposal`}
              </p>
              {currentProposalFaultyReports &&
              currentProposalFaultyReports?.length >= 3 ? (
                <div className='rounded-xl bg-base-50 p-4 text-center text-sm'>
                  Faulty reports maximum has been reached. Council members will
                  review this proposal shortly.
                </div>
              ) : (
                <button
                  className={`btn ${
                    !currentWalletAccount ? 'btn-disabled' : ''
                  }`}
                  onClick={() => {
                    updateIsFaultyModalOpen(!isFaultyModalOpen);
                  }}>
                  Report This Proposal As Faulty
                </button>
              )}
            </div>
          ) : null}
          <FaultyModal propId={propId as string} daoId={daoId as string} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Proposal;
