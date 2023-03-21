import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
    // getValues,
    formState: { isSubmitSuccessful },
  } = useForm();
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);

  const [recipientCount, setRecipientCount] = useState(2);

  const [recipientInputs, setRecipientInputs] = useState<
    { wallet: string; tokens: string; id: number }[]
  >([]);

  const handleAddRecipient = () => {
    const newCount = recipientCount + 1;

    const r = {
      wallet: `recipientWallet${newCount}`,
      tokens: `recipientTokens${newCount}`,
      id: Date.now() + newCount,
    };
    setRecipientCount(newCount);
    if (recipientInputs && recipientInputs.length > 0) {
      setRecipientInputs([...recipientInputs, r]);
    }
  };

  // const treasuryTokens = () => {
  //   const totalTokensToIssue = getValues('tokensToIssue');
  //   const totalRecipientTokens = recipientInputs.reduce((acc, curr) => {
  //     return acc + curr.tokens
  //   }, 0)
  // }

  const handleDeleteRecipient = (index: number) => {
    const newCount = recipientCount - 1;
    const inputs = [...recipientInputs];
    inputs.splice(index, 1);
    setRecipientInputs(inputs);
    setRecipientCount(newCount);
  };

  const displayRecipientInputs = (
    recipients: { wallet: string; tokens: string; id: number }[],
    handleDelete: Function
  ) => {
    return recipients.map((recipient, index) => {
      return (
        <div className='flex' key={recipient.id} data-k={recipient.id}>
          <div className='mr-3 flex flex-col justify-end pb-3'>{index + 1}</div>
          <div className='flex'>
            <div className='w-[370px] flex-col'>
              <p className='ml-1'>Wallet Address</p>
              <input
                type='text'
                placeholder='Wallet Address'
                className='input-primary input text-xs'
                {...register(recipient.wallet, {
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
                placeholder='0'
                className='input-primary input text-center'
                {...register(recipient.tokens, {
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
                handleDelete(index);
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
      updateCreateDaoSteps(3);
    }
  });

  const handleBack = () => {
    updateCreateDaoSteps(3);
  };

  const handleNext = () => {
    updateCreateDaoSteps(5);
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
              <p className='text-sm'>Distribute Tokens To Wallet Addresses</p>
            </div>
            {displayRecipientInputs(recipientInputs, handleDeleteRecipient)}
          </div>
          <div>
            {/* fixme make this functional */}
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
            <p className='text-sm'>{`Distribute Tokens to DAO's Treasury`}</p>
          </div>
          <div className='flex justify-center px-10'>Distribute {}</div>
        </div>
        <div className='mt-6 flex w-full justify-end'>
          <button className='btn mr-3 w-48' onClick={handleBack} type='button'>
            Back
          </button>
          <button
            className='btn-primary btn w-48'
            type='submit'
            onClick={handleNext}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueTokens;
