import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useExtrinsics from '@/hooks/useExtrinsics';
import type { CreateDaoData } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

const CreateDaoForm = () => {
  const { createDao } = useExtrinsics();
  const addOneDao = useGenesisStore((s) => s.addOneDao);
  const createDaoData = useGenesisStore((s) => s.createDaoData);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const updateCreateDaoData = useGenesisStore((s) => s.updateCreateDaoData);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateDaoData>();

  const onSubmit: SubmitHandler<CreateDaoData> = async (
    data: CreateDaoData
  ) => {
    updateCreateDaoData(data);
    if (currentWalletAccount) {
      try {
        await createDao(currentWalletAccount, data);
        addOneDao(data);
      } catch (err) {
        throw new Error(err);
      }
    } else {
      // fix
      console.log('please connect wallet first');
    }
  };

  useEffect(() => {
    console.log('form errors', errors);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <input
          type='text'
          className='input-bordered input-primary input'
          placeholder='DAO ID'
          {...register('daoId', {
            required: 'required',
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
            required: 'required',
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
          className={`btn-primary btn ${
            !currentWalletAccount ? `btn-disabled` : ``
          }`}>
          {!currentWalletAccount ? `Connect Wallet First` : `Create DAO`}
        </button>
      </div>
    </form>
  );
};

export default CreateDaoForm;
