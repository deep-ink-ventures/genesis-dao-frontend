import { WalletSelect } from '@talismn/connect-components';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { WalletAccount } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import avatar from '@/svg/avatar.svg';
import AccountCircle from '@/svg/components/accountCircle';
import Logout from '@/svg/components/logout';
import Switch from '@/svg/components/switch';
import wallet from '@/svg/wallet.svg';

import { truncateMiddle } from '../utils';

interface WalletConnectProps {
  text: string;
  onClose?: () => void;
}

const WalletConnect = (props: WalletConnectProps) => {
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const updateCurrentWalletAccount = useGenesisStore(
    (s) => s.updateCurrentWalletAccount
  );
  const updateWalletConnected = useGenesisStore((s) => s.updateWalletConnected);
  const updateWalletAccounts = useGenesisStore((s) => s.updateWalletAccounts);

  const handleDropdownOpen = () => {
    if (!currentWalletAccount) {
      setDropdownOpen(false);
      return;
    }
    setDropdownOpen(!dropdownOpen);
  };

  const handleDisconnect = () => {
    updateCurrentWalletAccount(null);
    updateWalletConnected(false);
    setDropdownOpen(false);
  };

  const handleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleUpdateAccounts = (accounts: WalletAccount[] | undefined) => {
    if (accounts && accounts?.length > 0) {
      // we all store all accounts. This can be useful for users to send tokens to their own accounts
      updateWalletAccounts(accounts);
    }
  };

  const handleUpdateAccount = (account: WalletAccount | undefined) => {
    if (account) {
      updateCurrentWalletAccount(account);
    }
  };

  const handleSwitchAccount = () => {
    handleModal();
    setDropdownOpen(false);
  };

  const handleProfileClick = () => {
    router.push('/account');
    setDropdownOpen(false);
  };

  const displayButtonText = () => {
    if (txnProcessing || modalIsOpen) {
      return 'Processing';
    }

    if (!currentWalletAccount) {
      return props.text;
    }
    return `${truncateMiddle(currentWalletAccount?.address, 5, 4)}`;
  };

  return (
    <div>
      <div className='relative z-20 flex flex-col'>
        <button
          tabIndex={0}
          className={`btn m-1 ${
            !currentWalletAccount
              ? 'btn-primary'
              : 'btn-connected hover:bg-base-100'
          }
            ${modalIsOpen && 'loading'} 
            ${txnProcessing && 'loading'}
            `}
          onClick={!currentWalletAccount ? handleModal : handleDropdownOpen}>
          {currentWalletAccount ? (
            <div className='mr-2'>
              <Image src={avatar} alt='avatar' height='18' width='18'></Image>
            </div>
          ) : (
            <div className='mr-2'>
              <Image src={wallet} alt='wallet' height='15' width='15'></Image>
            </div>
          )}
          <span className='align-middle'>{displayButtonText()}</span>
          {currentWalletAccount ? (
            <span className='ml-2'>
              <svg
                width='20'
                height='16'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M11.9802 16.9929C11.8484 16.9929 11.7099 16.9671 11.5648 16.9156C11.4198 16.864 11.2813 16.7739 11.1495 16.645L3.35604 9.03111C3.11868 8.79921 3 8.51579 3 8.18082C3 7.84586 3.11868 7.56244 3.35604 7.33054C3.59341 7.09865 3.87033 6.9827 4.18681 6.9827C4.5033 6.9827 4.78022 7.09865 5.01758 7.33054L11.9802 14.1328L18.9429 7.33054C19.1802 7.09865 19.4637 6.9827 19.7934 6.9827C20.1231 6.9827 20.4066 7.09865 20.644 7.33054C20.8813 7.56244 21 7.83942 21 8.1615C21 8.48358 20.8813 8.76057 20.644 8.99246L12.811 16.645C12.6791 16.7739 12.5473 16.864 12.4154 16.9156C12.2835 16.9671 12.1385 16.9929 11.9802 16.9929Z'
                  fill='#FAFAFA'
                />
              </svg>
            </span>
          ) : null}
        </button>
        <div
          className={cn(
            'shadow-[0_0_4px_0_rgba(255, 255, 255, 0.20)] absolute right-0 top-[65px] space-y-2 rounded-2xl bg-primary-content py-1 shadow-sm',
            {
              hidden: !dropdownOpen,
            }
          )}>
          <div
            className={`group flex cursor-pointer items-center gap-2 px-4 py-2 hover:text-primary`}
            onClick={handleProfileClick}>
            <AccountCircle
              width={20}
              height={20}
              className='[&_path]:group-hover:fill-primary'
            />{' '}
            Profile
          </div>
          <div
            className={`group flex cursor-pointer items-center gap-2 px-4 py-2 hover:text-primary`}
            onClick={handleSwitchAccount}>
            <Switch
              width={20}
              height={20}
              className='[&_path]:group-hover:fill-primary'
            />{' '}
            Switch Account
          </div>
          <div
            className={`group flex cursor-pointer items-center gap-2 border-t-[0.02rem] border-neutral-focus px-4 py-2 text-error hover:text-primary`}
            onClick={handleDisconnect}>
            <Logout
              width={20}
              height={20}
              className='[&_path]:group-hover:stroke-primary'
            />{' '}
            Disconnect
          </div>
        </div>
      </div>

      <WalletSelect
        dappName='genesis'
        open={modalIsOpen}
        showAccountsList={true}
        header={<h3>Select a wallet to connect</h3>}
        onWalletConnectOpen={() => {
          setModalIsOpen(true);
        }}
        onWalletConnectClose={() => {
          setModalIsOpen(false);
          props.onClose?.();
        }}
        onUpdatedAccounts={(accounts) => {
          handleUpdateAccounts(accounts as WalletAccount[]);
        }}
        onAccountSelected={(account) => {
          handleUpdateAccount(account as WalletAccount);
        }}
        onError={(error) => {
          if (error) {
            // eslint-disable-next-line
            console.log(error);
          }
        }}
      />
    </div>
  );
};

export default WalletConnect;
