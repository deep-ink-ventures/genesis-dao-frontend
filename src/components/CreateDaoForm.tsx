import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useFormState } from 'react-hook-form';

import type { CreateDaoData } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

const CreateDaoForm = () => {
  const createDaoData = useGenesisStore((s) => s.createDaoData);
  const updateCreateDaoData = useGenesisStore((s) => s.updateCreateDaoData);
  const { register, handleSubmit, reset, control } = useForm<CreateDaoData>();

  const { isSubmitted } = useFormState({ control });

  const onSubmit: SubmitHandler<CreateDaoData> = (data: CreateDaoData) => {
    updateCreateDaoData(data);
  };

  useEffect(() => {
    reset({
      daoId: '',
      daoName: '',
    });
    console.log('gensis store create dao data', createDaoData);
  }, [isSubmitted]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <input
          type='text'
          className='input-bordered input-primary input'
          placeholder='DAO ID'
          {...register('daoId', {
            required: true,
          })}
        />
      </div>
      <div className='mb-3'>
        <input
          type='text'
          className='input-bordered input-primary input'
          placeholder='DAO NAME'
          {...register('daoName', {
            required: true,
          })}
        />
      </div>

      <div className='mb-3'>
        <button type='submit' className='btn-primary btn'>
          Create a DAO
        </button>
      </div>
    </form>
  );
};

export default CreateDaoForm;
