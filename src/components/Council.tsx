import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import type { CouncilFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import d from '@/svg/delete.svg';
import plus from '@/svg/plus.svg';
import { truncateMiddle } from '@/utils';

const Council = (props: { daoId: string | null }) => {
  const daos = useGenesisStore((s) => s.daos);
  const dao = daos?.[props.daoId as string];
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);
  const [membersCount, setMembersCount] = useState(2);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<CouncilFormValues>({
    defaultValues: {
      creatorName: '',
      creatorWallet: currentWalletAccount?.address,
      councilMembers: [
        {
          name: '',
          walletAddress: '',
        },
      ],
      councilThreshold: 1,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'councilMembers',
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      updateCreateDaoSteps(4);
    }
  });

  // // fixme
  // const handleNext = () => {
  //   updateCreateDaoSteps(4);
  // };

  const handleBack = () => {
    updateCreateDaoSteps(2);
  };

  const handleAddField = () => {
    const newCount = membersCount + 1;
    setMembersCount(newCount);
    append({
      name: '',
      walletAddress: '',
    });
  };

  const membersFields = () => {
    return fields.map((item, index) => {
      return (
        <div className='flex' key={item.id} data-k={item.id}>
          <div className='mr-3 flex flex-col justify-end pb-3 pl-3'>
            {index + 2}
          </div>
          <div className='flex'>
            <div className='mr-3 flex flex-col'>
              <p className='ml-1'>Name</p>
              <input
                type='text'
                placeholder='Name'
                className='input-primary input'
                {...register(`councilMembers.${index}.name`, {
                  required: 'Required',
                  minLength: { value: 1, message: 'Minimum is 1' },
                  maxLength: { value: 30, message: 'Maximum is 30' },
                })}
              />
            </div>
            <div className='w-[370px] flex-col'>
              <p className='ml-1'>Wallet Address</p>
              <input
                type='text'
                placeholder='Wallet Address'
                className='input-primary input text-xs'
                {...register(`councilMembers.${index}.walletAddress`, {
                  required: 'Required',
                  minLength: { value: 1, message: 'Minimum is 1' },
                  maxLength: { value: 30, message: 'Maximum is 30' },
                })}
              />
            </div>
            <div className='ml-3 flex items-center pt-5'>
              <Image
                className='duration-150 hover:cursor-pointer hover:brightness-125 active:brightness-90'
                src={d}
                width={18}
                height={18}
                alt='delete button'
                onClick={() => {
                  const newCount = membersCount - 1;
                  setMembersCount(newCount);
                  remove(index);
                }}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className='flex flex-col items-center gap-y-5'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='50'
          max='100'></progress>
      </div>
      <div>
        <h2 className='text-center text-primary'>
          Add a {dao?.daoName} Council
        </h2>
      </div>
      <div className='px-24'>
        <p className='text-center'>
          A council can be a valuable addition to the DAO, providing guidance,
          leadership, and expertise. With a council in place, you can ensure
          that the DAO operates with a clear direction and is able to make
          informed decisions.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='card flex w-full flex-col items-center gap-y-5 border-none py-5 hover:brightness-100'>
          <div>
            <h3 className='text-center text-[23px]'>Council Members</h3>
          </div>
          <div className='flex'>
            <div className='mr-3 flex flex-col justify-end pb-3 pl-3'>1</div>
            <div className='flex'>
              <div className='mr-3 flex flex-col'>
                <p className='ml-1'>Your Name</p>
                <input
                  type='text'
                  placeholder='Your name'
                  className='input-primary input'
                  {...register('creatorName', {
                    required: 'Required',
                    minLength: { value: 1, message: 'Minimum is 1' },
                    maxLength: { value: 30, message: 'Maximum is 30' },
                  })}
                />
              </div>
              <div className='flex-col'>
                <p className='ml-1 opacity-40'>Wallet Address</p>
                <input type='text' hidden {...register('creatorWallet')} />
                <div className='flex h-12 w-[400px] items-center rounded-[10px] border-[0.3px] bg-base-50 px-2 opacity-40'>
                  {truncateMiddle(currentWalletAccount?.address)}
                </div>
              </div>
            </div>
          </div>
          {membersFields()}
          <div>
            <button
              className='btn border-white bg-[#403945] text-white hover:bg-[#403945] hover:brightness-110'
              type='button'
              onClick={handleAddField}>
              <Image
                src={plus}
                width={17}
                height={17}
                alt='add one'
                className='mr-2'
              />
              Add a Member
            </button>
          </div>
        </div>
        <div className='card mt-6 flex h-[292px] w-full flex-col items-center gap-y-5 border-none py-5 hover:brightness-100'>
          <div>
            <h3 className='text-center text-[23px]'>
              Council Signing Threshold
            </h3>
          </div>
          <div className='px-24 text-center'>
            <p>
              The signing threshold is a defined level of consensus that must be
              reached in order for proposals to be approved and implemented.
            </p>
          </div>
          <div className='w-[100px]'>
            <input
              className='input-primary input text-center'
              type='number'
              placeholder='1'
              {...register('councilThreshold', {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
              })}
            />
          </div>
          <p>
            Out of <span className='text-primary'>{membersCount}</span> Council
            Member(s)
          </p>
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

export default Council;
