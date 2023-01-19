import { useForm } from 'react-hook-form';

interface CreateDaoData {
  daoId: string;
  daoName: string;
}

const CreateDaoForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDaoData>();
  const onSubmit = (data: CreateDaoData) => console.log(data);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <input
          type='text'
          className='input-bordered input-primary input'
          placeholder='DAO ID Here'
          {...register('daoId', {})}
        />
      </div>
      <div className='mb-3'>
        <input
          type='text'
          className='input-bordered input-primary input'
          placeholder='DAO NAME Here'
          {...register('daoName', {})}
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
