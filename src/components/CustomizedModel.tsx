import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';

const CustomizedModel = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      // fixme
      updateCreateDaoSteps(3);
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='min-w-full'>
      <div className='card flex h-[580px] w-full items-center justify-center hover:border-none hover:brightness-100'>
        <div className='flex flex-col items-center justify-start gap-y-8 px-32'>
          <h3>Contact Us</h3>
          <div>
            <p>
              Take Control of DAO Governance Today! Are you looking to customize
              the governance of your DAO? Look no further! Our team is here to
              help you create a governance structure that fits your specific
              needs and requirements. Whether you want to implement a specific
              voting system, create custom proposals, or set up smart contracts,
              we have the expertise to help you achieve your goals.
            </p>
          </div>
          <div className='mb-8 flex flex-col items-center gap-y-8 px-24'>
            <div className='w-[250px]'>
              <p className='mb-1 ml-1'>Name</p>
              <input
                className='input-primary input'
                type='text'
                placeholder='Name'
                {...register('name', {
                  required: 'Required',
                })}
              />
            </div>
            <div className='w-[250px]'>
              <p className='mb-1 ml-1'>Email</p>
              <input
                className='input-primary input'
                type='text'
                placeholder='Email'
                {...register('email', {
                  required: 'Required',
                })}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          <button className='btn-primary btn w-[250px]' type='submit'>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CustomizedModel;
