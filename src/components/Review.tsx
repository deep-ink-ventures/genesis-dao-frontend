const Review = () => {
  return (
    <div className='flex flex-col items-center gap-y-5'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='90'
          max='100'></progress>
      </div>
      <div>
        <h2 className='text-center text-primary'>Review Details</h2>
      </div>
      <div className='px-24'>
        <p className='text-center'>
          Please check all DAO details and configurations
        </p>
      </div>
      <div className='card mb-5 flex h-[1000px] w-full items-center justify-center border-none py-5 hover:brightness-100'></div>
    </div>
  );
};

export default Review;
