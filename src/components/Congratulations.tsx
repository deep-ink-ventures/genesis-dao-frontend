import Image from 'next/image';

import useGenesisStore from '@/stores/genesisStore';
import congratsImage from '@/svg/congrats.svg';

const Congratulations = () => {
  const daoCreationValues = useGenesisStore((s) => s.daoCreationValues);

  return (
    <div className='flex flex-col items-center'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='100'
          max='100'
        />
      </div>
      <div>
        <Image src={congratsImage} width={270} height={270} alt='congrats' />
      </div>
      <div className='mb-5 text-center'>
        <h2 className='font-semibold text-primary'>Congratulations!</h2>
        <p>
          <span className='text-lg font-bold'>{daoCreationValues.daoName}</span>{' '}
          has been successfully set up!
        </p>
        <p>You may now release it to the council.</p>
      </div>
      <div>
        <button className='btn-primary btn'>
          Transfer DAO ownership to the council
        </button>
      </div>
    </div>
  );
};

export default Congratulations;
