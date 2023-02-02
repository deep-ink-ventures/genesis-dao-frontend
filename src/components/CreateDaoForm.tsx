import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import type { CreateDaoData } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

// fixme after dao created it should go to another page

const CreateDaoForm = () => {
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const createDaoData = useGenesisStore((s) => s.createDaoData);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const { createDao } = useGenesisDao();
  const addOneDao = useGenesisStore((s) => s.addOneDao);
  const updateCreateDaoData = useGenesisStore((s) => s.updateCreateDaoData);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateDaoData>();

  const buttonText = () => {
    if (!currentWalletAccount) {
      return 'Please Connect Wallet';
    }

    if (txnProcessing) {
      return 'Processing';
    }

    return 'Create DAO';
  };

  const onSubmit: SubmitHandler<CreateDaoData> = async (
    data: CreateDaoData
  ) => {
    updateTxnProcessing(true);
    updateCreateDaoData(data);
    if (currentWalletAccount) {
      try {
        await createDao(currentWalletAccount, data);
        addOneDao(data);
      } catch (err) {
        handleErrors(new Error(err));
      }
    }
  };

  useEffect(() => {
    if (errors) {
      console.log(errors);
    }
    if (isSubmitSuccessful) {
      reset(
        {
          daoId: '',
          daoName: '',
        },
        { keepErrors: true }
      );
    }
    console.log('gensis store create dao data', createDaoData);
  }, [createDaoData, isSubmitSuccessful, reset]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <input
            type='text'
            className='input-bordered input-primary input'
            placeholder='DAO ID'
            {...register('daoId', {
              required: 'Required',
              minLength: 3,
              maxLength: 22,
            })}
          />
          <ErrorMessage
            errors={errors}
            name='daoId'
            render={({ message }) => <p>{message}</p>}
          />
        </div>
        <div className='mb-3'>
          <input
            type='text'
            className='input-bordered input-primary input'
            placeholder='DAO NAME'
            {...register('daoName', {
              required: 'Required',
              minLength: 3,
              maxLength: 22,
            })}
          />
          <ErrorMessage
            errors={errors}
            name='daoName'
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

export default CreateDaoForm;
