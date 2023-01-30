import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { IssueTokensData } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

const IssueTokensForm = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);

  const onSubmit: SubmitHandler<IssueTokensData> = (data: IssueTokensData) => {
    console.log('form data', data);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
    setValue,
  } = useForm<IssueTokensData>();

  const buttonText = () => {
    if (!currentWalletAccount) {
      return 'Please Connect Wallet';
    }

    if (txnProcessing) {
      return 'Processing';
    }

    return 'Issue Tokens';
  };

  useEffect(() => {
    setValue('daoId', daoId as string);
    if (errors.supply) {
      console.log('errors', errors);
    }
    console.log('daoid', daoId);
  }, [daoId]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(
        {
          daoId: daoId as string,
          supply: 0,
        },
        { keepErrors: true }
      );
    }
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <input
            type='number'
            className='input-bordered input-primary input'
            placeholder='Tokens Supply'
            {...register('supply', {
              required: 'required',
              min: 1,
            })}
          />
          <ErrorMessage
            errors={errors}
            name='supply'
            render={({ message }) => <p>{message}</p>}
          />
        </div>
        <ErrorMessage
          errors={errors}
          name='daoId'
          render={({ message }) => <p>{message}</p>}
        />
        <div className='mb-3'>
          <button
            type='submit'
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

export default IssueTokensForm;
