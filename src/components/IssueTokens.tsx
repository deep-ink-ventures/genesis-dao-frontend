import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import type { IssueTokensValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import d from '@/svg/delete.svg';
import plus from '@/svg/plus.svg';
import { isValidPolkadotAddress } from '@/utils';

const IssueTokens = (props: { daoId: string | null }) => {
  const daos = useGenesisStore((s) => s.daos);
  const dao = daos?.[props.daoId as string];
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm<IssueTokensValues>({
    defaultValues: {
      tokensToIssue: 0,
      tokenRecipients: [
        {
          walletAddress: '',
          tokens: 0,
        },
      ],
      treasuryTokens: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tokenRecipients',
  });

  const watchTokensToIssue = watch('tokensToIssue', 0);
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);

  const handleAddRecipient = () => {
    append({
      walletAddress: '',
      tokens: 0,
    });
  };

  const getTotalRecipientsTokens = (
    recipients: IssueTokensValues['tokenRecipients']
  ) => {
    let total = 0;
    if (!recipients) {
      return 0;
    }
    // eslint-disable-next-line
    for (const item of recipients) {
      total += Number.isNaN(item.tokens) ? 0 : Number(item.tokens);
    }
    return total;
  };

  const values = useWatch({
    control,
    name: 'tokenRecipients',
  });
  const remain = watchTokensToIssue - getTotalRecipientsTokens(values);

  const recipientsFields = () => {
    return fields.map((item, index) => {
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
                  className='input-primary input text-xs'
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
                })}
              />
              <ErrorMessage
                errors={errors}
                name={`tokenRecipients.${index}.tokens`}
                render={({ message }) => (
                  <p className='mt-1 ml-2 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='flex w-[65px] items-center justify-center pt-5'>
              {(watch(`tokenRecipients.${index}.tokens`) / watchTokensToIssue) *
                100 >=
              100
                ? 'NaN'
                : (
                    (watch(`tokenRecipients.${index}.tokens`) /
                      watchTokensToIssue) *
                    100
                  ).toFixed(2)}{' '}
              %
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
                remove(index);
              }}
            />
          </div>
        </div>
      );
    });
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    setValue('treasuryTokens', remain);
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      updateCreateDaoSteps(4);
    }
  });

  const handleNext = () => {
    updateCreateDaoSteps(4);
  };

  const handleBack = () => {
    updateCreateDaoSteps(2);
  };

  return (
    <div className='flex flex-col items-center gap-y-5'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='68'
          max='100'
        />
      </div>
      <div>
        <h2 className='text-center text-primary'>
          Issue Tokens For {dao?.daoName}
        </h2>
      </div>
      <div className='px-24'>
        <p className='text-center'>
          A DAO can benefit from new levels of efficiency and control.
          Recipients can receive tokens as rewards for their contributions,
          while the treasury can use tokens for fundraising and other important
          initiatives.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='card mb-5 flex h-[207px] w-full items-center justify-center border-none py-5 hover:brightness-100'>
          <div className='w-80'>
            <p>
              Number of Tokens To Issue<span className='text-error'> *</span>
            </p>
            <input
              type='number'
              placeholder='0'
              className='input-primary input text-center'
              {...register('tokensToIssue', {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
              })}
            />
            <ErrorMessage
              errors={errors}
              name='tokensToIssue'
              render={({ message }) => (
                <p className='mt-1 ml-2 text-error'>{message}</p>
              )}
            />
          </div>
        </div>
        <div className='card flex min-h-[350px] w-full flex-col items-center gap-y-6 border-none py-5 px-3 hover:brightness-100'>
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
          </div>
          <hr className='my-2 w-[90%] border-white/80 px-20' />
          <div className='w-full text-center'>
            <h4 className='text-center'>Treasury</h4>
          </div>
          <div className='flex flex-col justify-center px-10 text-center text-lg'>
            <p>Distribute</p>
            <p>
              <span className='mx-3 w-[70px] text-center text-primary'>
                {remain}{' '}
              </span>
            </p>
            <p> tokens to treasury controlled by council members</p>
          </div>
        </div>
        <div className='mt-6 flex w-full justify-end'>
          <button className='btn mr-3 w-48' type='button' onClick={handleBack}>
            Back
          </button>
          <button className='btn-primary btn mr-3 w-48' type='submit'>
            Approve and Sign
          </button>
          <button className='btn w-48' type='button' onClick={handleNext}>
            Skip
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueTokens;
