import Spinner from './Spinner';

const Loading = ({ spinnerSize }: { spinnerSize?: string }) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='my-4'>
        <Spinner size={spinnerSize} />
      </div>
      <div>Loading...</div>
    </div>
  );
};

export default Loading;
