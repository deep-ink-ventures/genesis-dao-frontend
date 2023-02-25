import useGenesisStore from '@/stores/genesisStore';

const GovernanceForm = () => {
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);

  const handleBack = () => {
    updateCreateDaoSteps(1);
  };
  return (
    <div className='flex flex-col items-center gap-y-6 '>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='30'
          max='100'></progress>
      </div>
      <div className='text-center'>
        <h2 className='text-primary'>Governance</h2>
        <p className='px-10'>
          {`Choose the governance model. You can change this afterwards only via DAO votes, that follow the governance rules that you are now setting.`}
        </p>
      </div>
      <div className='flex justify-evenly gap-x-3'>
        <div className='card h-[110px] w-[180px]'>box</div>
        <div className='card h-[110px] w-[170px]'>box</div>
        <div className='card h-[110px] w-[180px]'>box</div>
        <div className='card h-[110px] w-[180px]'>box</div>
      </div>
      <div className='card h-[580px] w-full'>container</div>
      <button className='btn-primary btn' onClick={handleBack}>
        Back
      </button>
      <button className='btn-primary btn'>Next</button>
    </div>
  );
};

export default GovernanceForm;
