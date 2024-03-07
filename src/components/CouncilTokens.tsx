import { ErrorMessage } from '@hookform/error-message';
import { BN } from '@polkadot/util';
import { sortAddresses } from '@polkadot/util-crypto';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { MultiSigsService } from '@/services/multiSigs';
import useGenesisStore from '@/stores/genesisStore';
import type { CouncilTokensValues } from '@/types/council';
import { getMultisigAddress, truncateMiddle } from '@/utils';

import useGenesisDao from '../hooks/useGenesisDao';
import { CouncilMembersForm } from './CouncilMembersForm';
import { DistributeTokensForm } from './DistributeTokensForm';

const MIN_APPROVAL_THRESHOLD = 1;

const CouncilTokens = (props: { daoId: string | null }) => {
  const fetchDaoTokenTreasuryBalance = useGenesisStore(
    (s) => s.fetchDaoTokenTreasuryBalance
  );
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const updateShowCongrats = useGenesisStore((s) => s.updateShowCongrats);
  const currentDaoFromChain = useGenesisStore((s) => s.currentDaoFromChain);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const daoTokenTreasuryBalance = useGenesisStore(
    (s) => s.daoTokenTreasuryBalance
  );
  const { makeBatchTransferTxn, sendBatchTxns, makeChangeOwnerTxn } =
    useGenesisDao();
  const [membersCount, setMembersCount] = useState(2);

  const formMethods = useForm<CouncilTokensValues>({
    defaultValues: {
      creatorName: '',
      creatorWallet: currentWalletAccount?.address,
      councilMembers: [
        {
          name: '',
          walletAddress: '',
        },
      ],
      councilThreshold: MIN_APPROVAL_THRESHOLD,
      tokenRecipients: [
        {
          walletAddress: '',
          tokens: new BN(0),
        },
      ],
      treasuryTokens: new BN(0),
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = formMethods;

  const tokensValues = useWatch({
    control,
    name: 'tokenRecipients',
  });

  const getTotalRecipientsTokens = (
    recipients: CouncilTokensValues['tokenRecipients']
  ) => {
    let total = new BN(0);
    if (!recipients) {
      return new BN(0);
    }
    // eslint-disable-next-line
    for (const item of recipients) {
      total = total.add(item.tokens);
    }
    return total;
  };

  const remain = daoTokenTreasuryBalance
    ? daoTokenTreasuryBalance.sub(getTotalRecipientsTokens(tokensValues))
    : new BN(0);

  const onSubmit = async (data: CouncilTokensValues) => {
    const otherAddresses = data.councilMembers.map((el) => {
      return el.walletAddress;
    });

    let noMultisig = false;
    const addresses = [data.creatorWallet, ...otherAddresses];
    if (addresses.length === 1) {
      noMultisig = true;
    }

    const sortedAddresses = sortAddresses(addresses);

    const multisigAddress = getMultisigAddress(
      sortedAddresses,
      data.councilThreshold
    );

    if (
      !currentWalletAccount ||
      !props.daoId ||
      !currentDaoFromChain?.daoAssetId ||
      !multisigAddress
    ) {
      handleErrors(
        `Sorry we've run into some issues related to the multisig account`
      );
      return;
    }

    const recipients =
      data?.tokenRecipients
        ?.filter(
          (recipient) =>
            recipient?.walletAddress?.length && recipient.tokens?.gt(new BN(0))
        )
        ?.map((recipient) => {
          return {
            walletAddress: recipient.walletAddress,
            tokens: recipient.tokens,
          };
        }) || [];

    const recipientsWithTreasury = [
      ...recipients,
      {
        walletAddress: noMultisig ? data.creatorWallet : multisigAddress,
        tokens: data.treasuryTokens,
      },
    ];

    const withRecipients = makeBatchTransferTxn(
      [],
      recipientsWithTreasury,
      Number(currentDaoFromChain?.daoAssetId)
    );

    const withChangeOwner = makeChangeOwnerTxn(
      withRecipients,
      props.daoId,
      noMultisig ? data.creatorWallet : multisigAddress
    );
    if (!withChangeOwner[0]) {
      return;
    }

    try {
      let multiSig = await MultiSigsService.get(multisigAddress);
      if (!multiSig) {
        multiSig = await MultiSigsService.create(
          sortedAddresses,
          data.councilThreshold
        );
      }
      if (!multiSig) {
        handleErrors('Error in handling multisignature account');
        return;
      }
      await sendBatchTxns(
        withChangeOwner,
        'Tokens Issued and Transferred DAO Ownership!',
        'Transaction failed',
        () => {
          reset();
          updateShowCongrats(true);
          setTimeout(() => {
            fetchDaoFromDB(props?.daoId as string);
          }, 3000);
        }
      );
    } catch (err) {
      handleErrors(
        'Errors in issuing tokens and transferring ownership',
        new Error(err)
      );
    }
  };

  useEffect(() => {
    if (props.daoId) {
      fetchDaoFromDB(props.daoId);
    }
    if (currentWalletAccount && currentDaoFromChain?.daoAssetId) {
      fetchDaoTokenTreasuryBalance(
        currentDaoFromChain?.daoAssetId,
        currentWalletAccount.address
      );
    }
  }, [
    currentWalletAccount,
    currentDaoFromChain?.daoAssetId,
    fetchDaoTokenTreasuryBalance,
    props.daoId,
    fetchDaoFromDB,
    txnProcessing,
  ]);

  useEffect(() => {
    if (currentDao?.setupComplete) {
      updateShowCongrats(true);
    }
  });
  useEffect(() => {
    let interval: any;
    if (currentWalletAccount && currentDaoFromChain?.daoAssetId) {
      interval = setInterval(() => {
        fetchDaoTokenTreasuryBalance(
          currentDaoFromChain?.daoAssetId as number,
          currentWalletAccount.address
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  });

  useEffect(() => {
    setValue('treasuryTokens', remain);
  });

  const handleAddMember = () => {
    const newCount = membersCount + 1;
    setMembersCount(newCount);
  };

  const handleDeleteMember = () => {
    const newCount = membersCount - 1;
    setMembersCount(newCount);
  };

  return (
    <FormProvider {...formMethods}>
      <div className='flex flex-col items-center gap-y-5'>
        <div>
          <progress
            className='progress progress-primary h-[10px] w-[400px]'
            value='75'
            max='100'
          />
        </div>
        <div>
          <h3 className='text-center text-primary'>{currentDao?.daoName}</h3>
          <h2 className='text-center text-primary'>
            Create a Council & Distribute DAO Tokens
          </h2>
        </div>
        <div className='px-24'>
          <p className='text-center'>
            Having a council at a DAO is necessary to ensure proper management
            and oversight of the organization, and to provide a system of checks
            and balances to prevent any individual from having too much power or
            influence. DAOs issue tokens to incentivize community participation
            and provide a means of decentralized governance and decision-making.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <div className='card mb-6 flex w-full flex-col items-center gap-y-5 border-none py-5 hover:brightness-100'>
            <div>
              <h4 className='text-center'>Add Council Members</h4>
              <p className='px-24 text-center text-sm'>
                Enter at least 2 Council Members The wallet addresses will be
                used to create a multi-signature account.
              </p>
            </div>
            <div className='flex w-full px-4'>
              <div className='mr-3 flex w-1/4 flex-col'>
                <p className='pl-8'>Your Name</p>
                <div className='flex'>
                  <div className='mr-4 flex flex-col justify-center'>1</div>
                  <input
                    type='text'
                    placeholder='Your name'
                    className='input input-primary'
                    disabled={txnProcessing}
                    {...register('creatorName', {
                      required: 'Required',
                      minLength: { value: 1, message: 'Minimum is 1' },
                      maxLength: { value: 30, message: 'Maximum is 30' },
                    })}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name='creatorName'
                  render={({ message }) => (
                    <p className='mt-1 pl-8 text-error'>{message}</p>
                  )}
                />
              </div>
              <div className='flex flex-auto flex-col'>
                <p className='ml-1 opacity-40'>Wallet Address</p>
                <input type='text' hidden {...register('creatorWallet')} />
                <div className='flex h-12 items-center rounded-[10px] border-[0.3px] bg-base-50 px-2 opacity-40'>
                  {truncateMiddle(currentWalletAccount?.address)}
                </div>
              </div>
            </div>
            <CouncilMembersForm
              formName='councilMembers'
              listStartCount={2}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
              disabled={txnProcessing}
            />
            <div>
              <h4 className='text-center'>Enter Council Approval Threshold</h4>
              <p className='px-20 text-center text-sm'>
                The approval threshold is the minimum number of signatures
                needed to approve a multi-signature transaction. The minimum
                threshold is {MIN_APPROVAL_THRESHOLD}.
              </p>
            </div>
            <div className='w-[120px]'>
              <input
                className='input input-primary text-center'
                type='number'
                placeholder='1'
                disabled={txnProcessing}
                {...register('councilThreshold', {
                  required: 'Required',
                  min: {
                    value: MIN_APPROVAL_THRESHOLD,
                    message: `Minimum is ${MIN_APPROVAL_THRESHOLD}`,
                  },
                  max: {
                    value: membersCount,
                    message: 'Cannot exceed # of council members',
                  },
                })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name='councilThreshold'
              render={({ message }) => (
                <p className='ml-2 mt-1 text-error'>{message}</p>
              )}
            />
            <p className='text-lg'>
              Out of <span className='text-primary'>{membersCount}</span>{' '}
              Council Member(s)
            </p>
          </div>
          <div className='card mb-5 flex w-full items-center justify-center gap-y-6 border-none py-5 hover:brightness-100'>
            <DistributeTokensForm disabled={txnProcessing} />
          </div>
          <div className='mt-6 flex w-full justify-end'>
            <button
              className={cn(
                `btn btn-primary mr-3 w-48 ${txnProcessing ? 'loading' : ''}`,
                {
                  'btn-disabled': !daoTokenTreasuryBalance || membersCount < 2,
                  loading: txnProcessing,
                }
              )}
              disabled={txnProcessing}
              type='submit'>
              {`${txnProcessing ? 'Processing' : 'Approve and Sign'}`}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default CouncilTokens;
