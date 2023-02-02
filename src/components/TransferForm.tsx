// import  { decodeAddress, encodeAddress } from '@polkadot/keyring'
// import { hexToU8a, isHex } from '@polkadot/util'

import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import type { TransferFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

// get the balance of the user's wallet tokens
// add dao token options in to the select input

const TransferForm = () => {
  const { transfer } = useGenesisDao();
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<TransferFormValues>();

  const onSubmit: SubmitHandler<TransferFormValues> = async (
    data: TransferFormValues
  ) => {
    console.log('form data', data);
    updateTxnProcessing(true);
    if (currentWalletAccount) {
      try {
        await transfer(
          currentWalletAccount,
          data.assetId,
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
    if (isSubmitSuccessful) {
      reset(
        {
          assetId: '',
          toAddress: '',
          amount: 0,
        },
        { keepErrors: true }
      );
    }
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          {/* fixme validate address */}
          <input
            type='text'
            className='input-bordered input-primary input'
            placeholder='Recipient Address'
            {...register('toAddress', {
              required: 'required',
            })}
          />
          <ErrorMessage
            errors={errors}
            name='toAddress'
            render={({ message }) => <p>{message}</p>}
          />
        </div>
        <div className='mb-3'>
          <input
            type='text'
            className='input-bordered input-primary input'
            placeholder='Asset ID'
            {...register('assetId', {
              required: 'required',
            })}
          />
          <ErrorMessage
            errors={errors}
            name='assetId'
            render={({ message }) => <p>{message}</p>}
          />
        </div>
        <div className='mb-3'>
          <select className='select-primary select w-full max-w-xs'>
            <option disabled selected>
              Select DAO Token Name
            </option>
            <option>Game of Thrones</option>
            <option>Lost</option>
            <option>Breaking Bad</option>
            <option>Walking Dead</option>
          </select>
        </div>
        <div className='mb-3'>
          <input
            type='number'
            className='input-bordered input-primary input'
            placeholder='Amount'
            {...register('amount', {
              valueAsNumber: true,
              required: 'required',
              min: 1,
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
          ${!currentWalletAccount ? `btn-disabled` : ``}
          ${txnProcessing ? `loading` : ``}
          `}>
            {buttonText()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
