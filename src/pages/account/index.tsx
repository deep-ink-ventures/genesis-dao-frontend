import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Assets from '@/components/Assets';
import WalletConnect from '@/components/WalletConnect';
import useGenesisStore from '@/stores/genesisStore';
import arrowLeft from '@/svg/arrow-left.svg';
import coins from '@/svg/coins.svg';
import copy from '@/svg/copy.svg';
import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import MainLayout from '@/templates/MainLayout';

const AccountPage = () => {
  const router = useRouter();
  const [currentWalletAccount, account] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.account,
  ]);

  const handleChangePage = (pageParam: 'assets') => {
    account.tabs.setActiveTab(pageParam);
  };

  const displayImage = () => {
    return (
      <div className='relative flex items-center justify-center'>
        <Image
          src={placeholderImage}
          alt='placeholder'
          height={120}
          width={120}
        />
        <div className='absolute'>
          <Image src={mountain} alt='mountain' width={30} height={17}></Image>
        </div>
      </div>
    );
  };

  const displayPage = () => {
    let tab;
    switch (account.tabs.activeTab) {
      case 'asset':
      default:
        tab = <Assets />;
    }
    return tab;
  };

  const handleBack = () => {
    router.push(`/#explorer`);
  };

  return (
    <MainLayout title={`Account'`} description={`Account`}>
      <div
        className='mt-5 flex w-[65px] items-center justify-between hover:cursor-pointer hover:underline'
        onClick={handleBack}>
        <Image src={arrowLeft} width={13} height={7} alt='arrow-left' />
        <div>Back</div>
      </div>
      <div className='mt-5 flex min-h-[500px] justify-between gap-x-4'>
        <div className='container flex h-[640px] basis-1/4 flex-col items-center justify-evenly gap-y-4 py-4'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <div>{displayImage()}</div>
            <div
              className={
                'mt-3 flex flex-col items-center gap-4 md:overflow-visible'
              }>
              {currentWalletAccount?.address != null ? (
                <div className='flex w-[150px]'>
                  <h4
                    className={cn(
                      'z-10 inline-block grow truncate text-center text-lg text-base-content mix-blend-normal',
                      {
                        'text-base':
                          currentWalletAccount.address &&
                          currentWalletAccount.address?.length > 20,
                      }
                    )}>
                    {currentWalletAccount.address}{' '}
                  </h4>
                  <Image
                    src={copy}
                    height={15}
                    width={15}
                    alt='copy'
                    className='ml-4 cursor-pointer'
                  />
                </div>
              ) : (
                <WalletConnect text='Connect to view tokens' />
              )}
            </div>
          </div>
          <div className='w-full'>
            <div
              className={`${
                !account.tabs.activeTab || account.tabs.activeTab === 'assets'
                  ? 'selected-tab'
                  : 'brightness-75'
              } flex h-[55px] py-4 px-7 hover:cursor-pointer`}
              onClick={() => handleChangePage('assets')}>
              <Image
                src={coins}
                height={15}
                width={15}
                alt='dashboard'
                className='mr-4'
              />
              <p>My Assets</p>
            </div>
          </div>
        </div>
        <div className='min-w-0 basis-3/4 p-5 pt-0'>{displayPage()}</div>
      </div>
    </MainLayout>
  );
};
export default AccountPage;
