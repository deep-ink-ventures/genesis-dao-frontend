import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import useGenesisStore from '@/stores/genesisStore';
import congratsImage from '@/svg/congrats.svg';

const Congratulations = (props: { daoId: string | null }) => {
  const router = useRouter();
  const daos = useGenesisStore((s) => s.daos);
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);
  const dao = daos?.[props.daoId as string];

  const handleDashboard = () => {
    router.push(`/dao/${props.daoId}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateCreateDaoSteps(1);
      router.push(`/dao/${props.daoId}`);
    }, 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

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
          <span className='text-lg font-bold'>{dao?.daoName}</span> has been
          successfully set up!
        </p>
      </div>
      <div>
        <button className='btn-primary btn' onClick={handleDashboard}>
          Return to DAO dashboard
        </button>
      </div>
    </div>
  );
};

export default Congratulations;
