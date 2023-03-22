import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Control } from 'react-hook-form';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import type { IssueTokensValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import d from '@/svg/delete.svg';
import plus from '@/svg/plus.svg';

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
    // getValues,
    formState: { isSubmitSuccessful },
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

  const [treasuryTokens, setTreasuryTokens] = useState(0);

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

  const RemainingTokens = ({
    // eslint-disable-next-line
    control,
  }: {
    control: Control<IssueTokensValues>;
  }) => {
    const values = useWatch({
      control,
      name: 'tokenRecipients',
    });

    const remain = watchTokensToIssue - getTotalRecipientsTokens(values);
    setTreasuryTokens(remain);

    return <span className='mx-3 text-primary'>{remain} </span>;
  };

  useEffect(() => {
    setValue('treasuryTokens', treasuryTokens);
  });

  const recipientsFields = () => {
    return fields.map((item, index) => {
      return (
        <div className='flex' key={item.id} data-k={item.id}>
          <div className='mr-3 flex flex-col justify-end pb-3'>{index + 1}</div>
          <div className='flex'>
            <div className='w-[370px] flex-col'>
              <p className='ml-1'>Wallet Address</p>
              <input
                type='text'
                placeholder='Wallet Address'
                className='input-primary input text-xs'
                {...register(`tokenRecipients.${index}.walletAddress`, {
                  required: 'Required',
                  minLength: { value: 1, message: 'Minimum is 1' },
                  maxLength: { value: 30, message: 'Maximum is 30' },
                })}
              />
            </div>
            <div className='mx-3 flex flex-col'>
              <p className='ml-1'>Number of Tokens</p>
              <input
                type='number'
                className='input-primary input text-center'
                {...register(`tokenRecipients.${index}.tokens`, {
                  required: 'Required',
                  minLength: { value: 1, message: 'Minimum is 1' },
                  maxLength: { value: 30, message: 'Maximum is 30' },
                })}
              />
            </div>
            <div className='flex items-center justify-center pt-5'>0%</div>
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
    if (isSubmitSuccessful) {
      reset();
      updateCreateDaoSteps(5);
    }
  });

  const handleBack = () => {
    updateCreateDaoSteps(3);
  };

  return (
    <div className='flex flex-col items-center gap-y-5'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='65'
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
          <div className='flex justify-center px-10 text-lg'>
            Distribute <RemainingTokens control={control} /> tokens to treasury
          </div>
        </div>
        <div className='mt-6 flex w-full justify-end'>
          <button className='btn mr-3 w-48' onClick={handleBack} type='button'>
            Back
          </button>
          <button className='btn-primary btn w-48' type='submit'>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueTokens;
