import Spinner from './Spinner';

const Loading = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='my-4'>
        <Spinner />
      </div>
      <div>Loading...</div>
    </div>
  );
};

export default Loading;
