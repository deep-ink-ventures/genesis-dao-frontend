import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import type { IssueTokensData } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

const IssueTokensForm = (props: { daoId: string }) => {
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const daos = useGenesisStore((s) => s.daos);
  const { issueTokens } = useGenesisDao();

  const onSubmit: SubmitHandler<IssueTokensData> = async (
    data: IssueTokensData
  ) => {
    updateTxnProcessing(true);
    if (currentWalletAccount) {
      try {
        await issueTokens(currentWalletAccount, data.daoId, data.supply);
      } catch (err) {
        handleErrors(new Error(err));
      }
    }
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
    if (
      daos &&
      currentWalletAccount.address !== daos[props.daoId as string]?.owner
    ) {
      return `Only DAO owner can issue`;
    }
    if (txnProcessing) {
      return 'Processing';
    }
    return 'Issue Tokens';
  };

  useEffect(() => {
    setValue('daoId', props.daoId as string);
  }, [props.daoId, setValue]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(
        {
          daoId: props.daoId as string,
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
          {/* // fixme change this to BN */}
          <input
            type='number'
            className='input-bordered input-primary input'
            placeholder='Tokens Supply'
            {...register('supply', {
              required: 'Required',
              valueAsNumber: true,
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
          ${
            !currentWalletAccount ||
            (daos &&
              currentWalletAccount.address !==
                daos[props.daoId as string]?.owner)
              ? `btn-disabled`
              : ``
          }
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
