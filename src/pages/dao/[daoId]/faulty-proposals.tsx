import Image from 'next/image';
import { useRouter } from 'next/router';

import arrowLeft from '@/svg/arrow-left.svg';
import MainLayout from '@/templates/MainLayout';

const FaultyProposals = () => {
  const router = useRouter();
  const { daoId } = router.query;

  const handleBack = () => {
    router.push(`/dao/${daoId as string}/`);
  };

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO - Create a DAO'>
      <div
        className='mt-5 flex w-[65px] items-center justify-between hover:cursor-pointer hover:underline'
        onClick={handleBack}>
        <Image src={arrowLeft} width={13} height={7} alt='arrow-left' />
        <div>Back</div>
      </div>

      <div className='container mx-auto mt-5 min-w-[600px] max-w-[820px] px-12 py-5'>
        this is a list of faulty report
      </div>
    </MainLayout>
  );
};

export default FaultyProposals;
