import { useState } from 'react';

import useGenesisStore from '@/stores/genesisStore';

// import Image from 'next/image'
// import diamond from '../../public/images/diamond-shape.png'
import CustomizedModel from './CustomizedModel';
import MajorityModel from './MajorityModel';

const GovernanceForm = (props: { daoId: string | null }) => {
  const daos = useGenesisStore((s) => s.daos);
  const dao = daos?.[props.daoId as string];
  const [model, setModel] = useState('majority');

  const handleChangeTab = (mode: string) => {
    if (mode === 'majority') {
      setModel('majority');
    }

    if (mode === 'customized') {
      setModel('customized');
    }
  };

  // const handleNext = () => {
  //   updateCreateDaoSteps(3)
  // }

  return (
    <div className='flex flex-col items-center gap-y-6 '>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='15'
          max='100'></progress>
      </div>
      <div className='text-center'>
        <h2 className='text-primary'>{dao?.daoName} Governance</h2>
        <p className='px-10'>
          {`Choose the governance model. You can change this afterwards only via DAO votes, that follow the governance rules that you are now setting.`}
        </p>
      </div>
      <div className='flex justify-evenly gap-x-3'>
        {/* <Image src={diamond} width={44} height={44} alt='diamond shape' className='absolute'/> */}
        <div
          className={`card flex h-[110px] w-[180px] items-center justify-center px-4 text-center  hover:cursor-pointer ${
            model === 'majority'
              ? 'border border-primary hover:border-primary'
              : 'text-sm'
          }`}
          onClick={() => {
            handleChangeTab('majority');
          }}>
          Majority Vote
        </div>
        <div className='relative'>
          <div className='absolute top-[-8px] left-[80px] z-10 flex h-[25px] w-[100px] items-center justify-center rounded-[15px] bg-primary text-center text-xs font-medium text-black '>
            Coming Soon!
          </div>
          <div className='card flex h-[110px] w-[170px] items-center justify-center px-4 text-center text-sm opacity-40 hover:border-none hover:brightness-100'>
            Delegated Council Vote
          </div>
        </div>
        <div className='relative'>
          <div className='absolute top-[-8px] left-[80px] z-10 flex h-[25px] w-[100px] items-center justify-center rounded-[15px] bg-primary text-center text-xs font-medium text-black'>
            Coming Soon!
          </div>
          <div className='card flex h-[110px] w-[180px] items-center justify-center px-4 text-center text-sm opacity-40 hover:border-none hover:brightness-100'>
            Create Your Own
          </div>
        </div>
        <div
          className={`card flex h-[110px] w-[180px] items-center justify-center px-4 text-center hover:cursor-pointer ${
            model === 'customized'
              ? 'border border-primary hover:border-primary'
              : 'text-sm'
          }`}
          onClick={() => {
            handleChangeTab('customized');
          }}>
          Customized
        </div>
      </div>
      {model === 'majority' ? <MajorityModel /> : <CustomizedModel />}
    </div>
  );
};

export default GovernanceForm;
