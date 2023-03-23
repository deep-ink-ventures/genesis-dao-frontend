// import  { decodeAddress, encodeAddress } from '@polkadot/keyring'
// import { hexToU8a, isHex } from '@polkadot/util'

import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import type { TransferFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import { isValidPolkadotAddress } from '@/utils';

const TransferForm = (props: { assetId: number; daoId: string }) => {
  const { transfer } = useGenesisDao();
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const fetchTokenBalance = useGenesisStore((s) => s.fetchTokenBalance);
  const currentAssetBalance = useGenesisStore((s) => s.currentAssetBalance);

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
    updateTxnProcessing(true);
    if (currentWalletAccount) {
      try {
        await transfer(
          currentWalletAccount,
          props.assetId,
          data.toAddress,
          data.amount
        );
      } catch (err) {
        handleErrors(new Error(err));
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
      fetchTokenBalance(props.assetId, currentWalletAccount.address);
    }
  });

  return (
    <div>
      <div>
        <div>
          {`Your current ${props.daoId} token balance is ${currentAssetBalance}`}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <input
            type='text'
            className='input-bordered input-primary input'
            placeholder='Recipient Address'
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
              <p className='mt-1 ml-2 text-error'>{message}</p>
            )}
          />
        </div>
        <div className='mb-3'>
          <input
            type='number'
            className='input-bordered input-primary input'
            placeholder='Amount'
            {...register('amount', {
              valueAsNumber: true,
              required: 'Required',
              min: {
                value: 0.0000000001,
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
            className={`btn-primary btn 
          ${txnProcessing ? `loading` : ``}
          `}
            disabled={!currentWalletAccount}>
            {buttonText()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
