import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Assets from '@/components/Assets';
import TransferAssetModal from '@/components/TransferAssetModal';
import WalletConnect from '@/components/WalletConnect';
import useGenesisStore from '@/stores/genesisStore';
import arrowLeft from '@/svg/arrow-left.svg';
import coins from '@/svg/coins.svg';
import copy from '@/svg/copy.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import polkadotjs from '@/svg/polkadotjs.svg';
import user from '@/svg/user-icon.svg';
import MainLayout from '@/templates/MainLayout';
import { TxnResponse } from '@/types/response';

enum AccountTabs {
  ASSETS = 'assets',
}

const TabButton = ({
  activeTab,
  name,
  children,
  onClick,
}: {
  activeTab?: string;
  name?: string;
  children: React.ReactNode;
  onClick: (tab?: string) => void;
}) => {
  return (
    <div
      className={`${
        activeTab === name ? 'selected-tab' : 'brightness-75'
      } flex h-[55px] px-7 py-4 hover:cursor-pointer hover:text-primary`}
      onClick={() => onClick(name)}>
      {children}
    </div>
  );
};

const AccountPage = () => {
  const router = useRouter();
  const [currentWalletAccount, account, addTxnNotification] = useGenesisStore(
    (s) => [s.currentWalletAccount, s.pages.account, s.addTxnNotification]
  );

  const handleChangePage = (pageParam?: string) => {
    if (pageParam) {
      account.tabs.setActiveTab(pageParam);
    }
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
          <Image src={user} alt='mountain' width={60} height={60}></Image>
        </div>
      </div>
    );
  };

  const displayPage = () => {
    return <Assets />;
  };

  const handleBack = () => {
    router.push(`/#explorer`);
  };

  useEffect(() => {
    account.assets.fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWalletAccount]);

  const handleCopy = () => {
    if (currentWalletAccount?.address) {
      navigator.clipboard.writeText(currentWalletAccount.address);
      addTxnNotification({
        title: 'Clipboard',
        type: TxnResponse.Success,
        message: 'Account address copied to clipboard!',
        timestamp: new Date().valueOf(),
      });
    }
  };

  return (
    <MainLayout title={`Account`} description={`Account`}>
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
                    onClick={handleCopy}
                  />
                </div>
              ) : (
                <WalletConnect text='Connect to view tokens' />
              )}
            </div>
          </div>
          <div className='w-full'>
            <TabButton
              activeTab={account.tabs.activeTab || AccountTabs.ASSETS}
              name={AccountTabs.ASSETS}
              onClick={() => handleChangePage('assets')}>
              <Image
                src={coins}
                height={15}
                width={15}
                alt='dashboard'
                className='mr-4'
              />
              <p>My Assets</p>
            </TabButton>
            <TabButton
              activeTab={account.tabs.activeTab || AccountTabs.ASSETS}
              onClick={() => handleChangePage('assets')}>
              <a
                className='flex'
                href='https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fnode.genesis-dao.org#/accounts' target='_blank'>
                  
                <Image
                  src={polkadotjs}
                  height={15}
                  width={15}
                  alt='polkadotJS'
                  className='mr-4'
                />
                <p>PolkadotJS</p>
              </a>
            </TabButton>
          </div>
        </div>
        <div className='min-w-0 basis-3/4 p-5 pt-0'>{displayPage()}</div>
      </div>
      {account.assets.selectedAssetHolding != null && (
        <TransferAssetModal
          assetHolding={account.assets.selectedAssetHolding}
          daoId={account.assets?.selectedAssetHolding?.asset?.dao_id}
          daoImage={
            account.assets?.selectedAssetHolding?.asset?.dao?.metadata?.images
              ?.logo?.small?.url
          }
          open={account.modals.transferAssets.visible}
          onClose={() => account.modals.transferAssets.setVisibility(false)}
          onSuccess={() => account.assets.fetchAssets()}
        />
      )}
    </MainLayout>
  );
};
export default AccountPage;
