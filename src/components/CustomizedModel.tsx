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
      updateCreateDaoSteps(3);
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='min-w-full'>
      <div className='card flex h-[580px] w-full items-center justify-center hover:border-none hover:brightness-100'>
        <div className='flex flex-col items-center justify-start gap-y-6 px-24'>
          <h3>Contact Us</h3>
          <div>
            <p className='text-center'>
              Our team is here to help you create a governance structure that
              fits your specific needs and requirements. Whether you want to
              implement a specific voting system, create custom proposals, or
              set up smart contracts, we have the expertise to help you achieve
              your goals.
            </p>
          </div>
          <div className='mb-8 flex flex-col items-center gap-y-8'>
            <div className='w-[350px]'>
              <p className='mb-1 ml-1'>Name</p>
              <input
                className='input-primary input'
                type='text'
                placeholder='Name'
                {...register('name', {
                  required: 'Required',
                  maxLength: 25,
                })}
              />
            </div>
            <div className='w-[350px]'>
              <p className='mb-1 ml-1'>Email</p>
              <input
                className='input-primary input'
                type='email'
                placeholder='Email'
                {...register('email', {
                  required: 'Required',
                  maxLength: 40,
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
