import { ErrorMessage } from '@hookform/error-message';
import { BN } from '@polkadot/util';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { DAO_UNITS } from '@/config';
import useGenesisStore from '@/stores/genesisStore';
import d from '@/svg/delete.svg';
import plus from '@/svg/plus.svg';
import type { CouncilTokensValues } from '@/types/council';
import {
  getMultisigAddress,
  isValidPolkadotAddress,
  truncateMiddle,
  uiTokens,
} from '@/utils';

import useGenesisDao from '../hooks/useGenesisDao';

const CouncilTokens = (props: { daoId: string | null }) => {
  const fetchDaoTokenBalance = useGenesisStore((s) => s.fetchDaoTokenBalance);
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const updateShowCongrats = useGenesisStore((s) => s.updateShowCongrats);

  const currentDaoFromChain = useGenesisStore((s) => s.currentDaoFromChain);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const daoTokenBalance = useGenesisStore((s) => s.daoTokenBalance);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const { makeBatchTransferTxn, sendBatchTxns, makeChangeOwnerTxn } =
    useGenesisDao();
  const [membersCount, setMembersCount] = useState(2);

  const {
    register,
    handleSubmit,
    reset,
    // watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CouncilTokensValues>({
    defaultValues: {
      creatorName: '',
      creatorWallet: currentWalletAccount?.address,
      councilMembers: [
        {
          name: '',
          walletAddress: '',
        },
      ],
      councilThreshold: 1,
      tokenRecipients: [
        {
          walletAddress: '',
          tokens: new BN(0),
        },
      ],
      treasuryTokens: new BN(0),
    },
  });

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
    // multiply by DAO units to get the right tokens
    return total;
  };

  const remain = daoTokenBalance
    ? daoTokenBalance.sub(getTotalRecipientsTokens(tokensValues))
    : new BN(0);

  const {
    fields: councilMembersFields,
    append: councilMembersAppend,
    remove: councilMembersRemove,
  } = useFieldArray({
    control,
    name: 'councilMembers',
  });

  const {
    fields: tokenRecipientsFields,
    append: tokenRecipientsAppend,
    remove: tokenRecipientsRemove,
  } = useFieldArray({
    control,
    name: 'tokenRecipients',
  });

  const onSubmit = async (data: CouncilTokensValues) => {
    const otherAddresses = data.councilMembers.map((el) => {
      return el.walletAddress;
    });

    let noMultisig = false;
    const addresses = [data.creatorWallet, ...otherAddresses];
    if (addresses.length === 1) {
      noMultisig = true;
    }

    const multisigAddress = getMultisigAddress(
      addresses,
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

    const recipients = data.tokenRecipients.map((recipient) => {
      return {
        walletAddress: recipient.walletAddress,
        tokens: recipient.tokens,
      };
    });

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

    try {
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
      handleErrors(err);
    }
  };

  useEffect(() => {
    if (props.daoId) {
      fetchDaoFromDB(props.daoId);
    }
    if (currentWalletAccount && currentDaoFromChain?.daoAssetId) {
      fetchDaoTokenBalance(
        currentDaoFromChain?.daoAssetId,
        currentWalletAccount.address
      );
    }
  }, [
    currentWalletAccount,
    currentDaoFromChain?.daoAssetId,
    fetchDaoTokenBalance,
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
        fetchDaoTokenBalance(
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
    councilMembersAppend({
      name: '',
      walletAddress: '',
    });
  };

  const handleAddRecipient = () => {
    tokenRecipientsAppend({
      walletAddress: '',
      tokens: new BN(0),
    });
  };

  const recipientsFields = () => {
    if (!daoTokenBalance) {
      return <div className='text-center'>Please issue tokens first</div>;
    }
    return tokenRecipientsFields.map((item, index) => {
      return (
        <div className='flex' key={item.id} data-k={item.id}>
          <div className='flex'>
            <div className='w-[370px] flex-col'>
              <p className='pl-8'>Wallet Address</p>
              <div className='flex'>
                <div className='mr-4 flex flex-col justify-center'>
                  {index + 1}
                </div>
                <input
                  type='text'
                  placeholder='Wallet Address'
                  className='input-primary input'
                  {...register(`tokenRecipients.${index}.walletAddress`, {
                    required: 'Required',
                    validate: (add) =>
                      isValidPolkadotAddress(add) === true ||
                      'Not a valid address',
                  })}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name={`tokenRecipients.${index}.walletAddress`}
                render={({ message }) => (
                  <p className='mt-1 pl-8 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='mx-3 flex flex-col'>
              <p className='ml-1'>Number of Tokens</p>
              <input
                type='number'
                className='input-primary input text-center'
                {...register(`tokenRecipients.${index}.tokens`, {
                  required: 'Required',
                  min: { value: 1, message: 'Minimum is 1' },
                  validate: { onRemainingTokens: () => remain.gte(new BN(0)) },
                  setValueAs: (tokens) => {
                    const bnTokens = new BN(tokens);
                    return bnTokens.mul(new BN(DAO_UNITS));
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name={`tokenRecipients.${index}.tokens`}
                render={({ message }) => (
                  <p className='ml-2 mt-1 text-error'>{message}</p>
                )}
                // {errors?.tokenRecipients?.[index]?.tokens && <p>error</p>}
              />
            </div>
            <div className='flex w-[65px] items-center justify-center pt-5'>
              {/* {watch(`tokenRecipients.${index}.tokens`)
                .div(daoTokenBalance)
                .mul(new BN(100))
                .gte(new BN(100))
                ? 'NaN'
                : watch(`tokenRecipients.${index}.tokens`)
                    ?.div(daoTokenBalance)
                    .mul(new BN(100))
                    .toString()}{' '}
              % */}
            </div>
          </div>
          <div className='ml-3 flex items-center pt-5'>
            <Image
              className='duration-150 hover:cursor-pointer hover:brightness-125 active:brightness-90'
              src={d}
              width={18}
              height={18}
              alt='delete button'
              onClick={() => {
                tokenRecipientsRemove(index);
              }}
            />
          </div>
        </div>
      );
    });
  };

  const membersFields = () => {
    return councilMembersFields.map((item, index) => {
      return (
        <div className='flex w-full px-4' key={item.id} data-k={item.id}>
          <div className='flex w-full'>
            <div className='mr-3 flex w-1/4 shrink-0 flex-col'>
              <p className='pl-8'>Name</p>
              <div className='flex '>
                <div className='mr-4 flex flex-col justify-center'>
                  {index + 2}
                </div>
                <input
                  type='text'
                  placeholder='Name'
                  className='input-primary input '
                  {...register(`councilMembers.${index}.name`, {
                    required: 'Required',
                    minLength: { value: 1, message: 'Minimum is 1' },
                    maxLength: { value: 30, message: 'Maximum is 30' },
                  })}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name={`councilMembers.${index}.name`}
                render={({ message }) => (
                  <p className='mt-1 pl-8 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='flex flex-auto flex-col'>
              <p className='ml-1'>Wallet Address</p>
              <input
                type='text'
                placeholder='Wallet Address'
                className='input-primary input'
                {...register(`councilMembers.${index}.walletAddress`, {
                  required: 'Required',
                  validate: (add) =>
                    isValidPolkadotAddress(add) === true ||
                    'Not a valid address',
                })}
              />
              <ErrorMessage
                errors={errors}
                name={`councilMembers.${index}.walletAddress`}
                render={({ message }) => (
                  <p className='ml-2 mt-1 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='ml-3 flex items-center pt-5'>
              <Image
                className='duration-150 hover:cursor-pointer hover:brightness-125 active:brightness-90'
                src={d}
                width={18}
                height={18}
                alt='delete button'
                onClick={() => {
                  const newCount = membersCount - 1;
                  setMembersCount(newCount);
                  councilMembersRemove(index);
                }}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
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
          Having a council at a DAO is necessary to ensure proper management and
          oversight of the organization, and to provide a system of checks and
          balances to prevent any individual from having too much power or
          influence. DAOs issue tokens to incentivize community participation
          and provide a means of decentralized governance and decision-making.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='card mb-6 flex w-full flex-col items-center gap-y-5 border-none py-5 hover:brightness-100'>
          <div>
            <h4 className='text-center'>Add Council Members</h4>
            <p className='px-24 text-sm'>
              Council members wallets will be used to create a multi-signature
              account
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
                  className='input-primary input'
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
          {membersFields()}
          <div className='mb-4'>
            <button
              className='btn border-white bg-[#403945] text-white hover:bg-[#403945] hover:brightness-110'
              type='button'
              onClick={handleAddMember}>
              <Image
                src={plus}
                width={17}
                height={17}
                alt='add one'
                className='mr-2'
              />
              Add a Member
            </button>
          </div>
          <div>
            <h4 className='text-center'>Enter Council Approval Threshold</h4>
            <p className='px-24 text-center text-sm'>
              The approval threshold is a defined level of consensus that must
              be reached in order for proposals to be approved and implemented
            </p>
          </div>
          <div className='w-[100px]'>
            <input
              className='input-primary input text-center'
              type='number'
              placeholder='1'
              {...register('councilThreshold', {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
                max: {
                  value: membersCount,
                  message: 'Cannot exceed # of council members',
                },
              })}
            />
            <ErrorMessage
              errors={errors}
              name='councilThreshold'
              render={({ message }) => (
                <p className='ml-2 mt-1 text-error'>{message}</p>
              )}
            />
          </div>
          <p className='text-lg'>
            Out of <span className='text-primary'>{membersCount}</span> Council
            Member(s)
          </p>
        </div>
        <div className='card mb-5 flex w-full items-center justify-center gap-y-6 border-none py-5 hover:brightness-100'>
          <div className='flex flex-col gap-y-4'>
            <div className='w-full text-center'>
              <h4 className='text-center'>Recipients</h4>
              <p className='text-sm'>
                Distribute Tokens To Other Wallet Addresses
              </p>
            </div>
            {recipientsFields()}
          </div>
          <div>
            {daoTokenBalance ? (
              <button
                className='btn border-white bg-[#403945] text-white hover:bg-[#403945] hover:brightness-110'
                type='button'
                onClick={handleAddRecipient}>
                <Image
                  src={plus}
                  width={17}
                  height={17}
                  alt='add one'
                  className='mr-2'
                />
                Add a Recipient
              </button>
            ) : null}
          </div>
          <div>
            <div className='w-full text-center'>
              <h4 className='mb-2 text-center'>Treasury</h4>
            </div>
            <div className='flex flex-col justify-center px-10 text-center'>
              <p>Distribute</p>
              <p>
                <span className='mx-3 w-[70px] text-center text-primary'>
                  {uiTokens(remain, 'dao', currentDao?.daoId)}
                  {' Tokens'}
                </span>
              </p>
              <p>
                {' '}
                {currentDao?.daoId} tokens to treasury controlled by council
                members
              </p>
            </div>
          </div>
        </div>
        <div className='mt-6 flex w-full justify-end'>
          <button
            className={`btn-primary btn mr-3 w-48 ${
              !daoTokenBalance ? 'btn-disabled' : ''
            } ${txnProcessing ? 'loading' : ''}`}
            type='submit'>
            {`${txnProcessing ? 'Processing' : 'Approve and Sign'}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouncilTokens;
