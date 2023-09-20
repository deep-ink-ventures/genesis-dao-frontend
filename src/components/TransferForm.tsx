// import  { decodeAddress, encodeAddress } from '@polkadot/keyring'
// import { hexToU8a, isHex, BN } from '@polkadot/util';

import { ErrorMessage } from '@hookform/error-message';
import { BN } from '@polkadot/util';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { DAO_UNITS } from '@/config';
import useGenesisDao from '@/hooks/useGenesisDao';
import type { TransferFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import { isValidPolkadotAddress, uiTokens } from '@/utils';

const TransferForm = (props: { assetId: number; daoId: string }) => {
  const { transfer } = useGenesisDao();
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const fetchDaoTokenBalance = useGenesisStore((s) => s.fetchDaoTokenBalance);
  const fetchDaoTokenBalanceFromDB = useGenesisStore(
    (s) => s.fetchDaoTokenBalanceFromDB
  );
  const daoTokenBalance = useGenesisStore((s) => s.daoTokenBalance);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
    setValue,
  } = useForm<TransferFormValues>();

  const onSubmit: SubmitHandler<TransferFormValues> = async (
    data: TransferFormValues
  ) => {
    const bnAmount = new BN((data.amount * DAO_UNITS).toString());
    updateTxnProcessing(true);
    if (currentWalletAccount) {
      try {
        await transfer(
          currentWalletAccount,
          props.assetId,
          data.toAddress,
          bnAmount
        );
      } catch (err) {
        handleErrors(
          'Errors in transferring tokens in TransferForm ',
          new Error(err)
        );
      }
    }
  };

  const buttonText = () => {
    if (!currentWalletAccount) {
      return 'Please Connect Wallet';
    }
    if (txnProcessing) {
      return 'Processing';
    }
    return 'Transfer';
  };

  useEffect(() => {
    setValue('assetId', props.assetId);
    if (isSubmitSuccessful) {
      reset(
        {
          assetId: props.assetId,
          toAddress: '',
          amount: 0,
        },
        { keepErrors: true }
      );
    }
  });

  useEffect(() => {
    if (currentWalletAccount) {
      fetchDaoTokenBalance(props.assetId, currentWalletAccount.address);
      fetchDaoTokenBalanceFromDB(props.assetId, currentWalletAccount.address);
    }
  }, [
    currentWalletAccount,
    fetchDaoTokenBalance,
    fetchDaoTokenBalanceFromDB,
    props.assetId,
  ]);

  return (
    <div>
      <div>
        <div>
          {`Your current ${props.daoId} token balance is ${
            daoTokenBalance
              ? uiTokens(daoTokenBalance, 'dao', props.daoId)
              : '0'
          }`}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <input
            type='text'
            className='input input-bordered input-primary'
            placeholder='Recipient Address'
            disabled={txnProcessing}
            {...register('toAddress', {
              required: 'Required',
              validate: (add) =>
                isValidPolkadotAddress(add) === true || 'Not a valid address',
            })}
          />
          <ErrorMessage
            errors={errors}
            name='toAddress'
            render={({ message }) => (
              <p className='ml-2 mt-1 text-error'>{message}</p>
            )}
          />
        </div>
        <div className='mb-3'>
          <input
            type='number'
            className='input input-bordered input-primary'
            placeholder='Amount'
            disabled={txnProcessing}
            {...register('amount', {
              valueAsNumber: true,
              required: 'Required',
              min: {
                value: 0.000001,
                message: 'The Amount is zero or too small',
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name='amount'
            render={({ message }) => <p>{message}</p>}
          />
        </div>
        <div className='mb-3'>
          <button
            type='submit'
            // disabled={!currentWalletAccount}
            className={`btn btn-primary 
          ${txnProcessing ? `loading` : ``}
          `}
            disabled={!currentWalletAccount || txnProcessing}>
            {buttonText()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
