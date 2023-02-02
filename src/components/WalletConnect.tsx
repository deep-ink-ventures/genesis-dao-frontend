import { WalletSelect } from '@talismn/connect-components';
import { useState } from 'react';

import type { WalletAccount } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

import { truncateMiddle } from '../utils';

const WalletConnect = () => {
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const walletConnected = useGenesisStore((s) => s.walletConnected);
  const updateCurrentWalletAccount = useGenesisStore(
    (s) => s.updateCurrentWalletAccount
  );
  const updateWalletConnected = useGenesisStore((s) => s.updateWalletConnected);

  // @ts-ignore
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleDisconnect = () => {
    updateCurrentWalletAccount(undefined);
    updateWalletConnected(false);
  };

  const handleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleUpdateAccounts = (accounts: WalletAccount[] | undefined) => {
    if (accounts && accounts?.length > 0) {
      updateCurrentWalletAccount(accounts[0]);
      updateWalletConnected(true);
    }
  };

  // useEffect(() => {
  // }, [walletConnected, currentWalletAccount])

  return (
    <div>
      <div>
        <div>
          <button
            tabIndex={0}
            className={`btn m-1 ${
              !walletConnected
                ? 'btn-primary'
                : 'hover:bg-red-400 hover:text-zinc-800'
            }
            ${modalIsOpen ? 'loading' : ''}
            ${txnProcessing ? 'loading' : ''}
            `}
            onClick={!walletConnected ? handleModal : handleDisconnect}>
            <span>
              {!walletConnected
                ? 'Connect'
                : `Disconnect from ${truncateMiddle(
                    currentWalletAccount?.address,
                    5,
                    4
                  )}`}
            </span>
          </button>
        </div>

        <WalletSelect
          dappName='genesis'
          open={!!modalIsOpen}
          showAccountsList={false}
          header={<h3>Select a wallet to connect</h3>}
          onWalletConnectOpen={() => {
            setModalIsOpen(true);
          }}
          onWalletConnectClose={() => {
            setModalIsOpen(false);
          }}
          onUpdatedAccounts={(accounts) => {
            handleUpdateAccounts(accounts as WalletAccount[]);
          }}
          onError={(error) => {
            if (error) {
              console.log(error);
            }
          }}
        />
      </div>
    </div>
  );
};

export default WalletConnect;
