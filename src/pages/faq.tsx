import Image from 'next/image';
import Link from 'next/link';

import Faqs from '@/components/FAQs';
import arrowLeft from '@/svg/arrow-left.svg';
import MainLayout from '@/templates/MainLayout';

const FAQPage = () => {
  return (
    <MainLayout title='FAQ - GenesisDAO' description='GenesisDAO FAQ'>
      <Link href='/'>
        <div className='mt-5 flex w-[65px] items-center justify-between hover:cursor-pointer hover:underline'>
          <Image src={arrowLeft} width={13} height={7} alt='arrow-left' />
          <div>Back</div>
        </div>
      </Link>
      <div className='container mx-auto mb-12 mt-5 min-w-[600px] max-w-[900px] px-12 py-5'>
        <div className='mb-3'>
          <div>
            <h1 className='text-3xl'>
              Frequently Asked Questions (FAQs) for Genesis DAO
            </h1>
          </div>
        </div>
        <div className='p-3'>
          <Faqs />
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQPage;
