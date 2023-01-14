import type { WalletAccount } from '@talismn/connect-wallets';
import { getWallets } from '@talismn/connect-wallets';
import { useEffect, useState } from 'react';

function WalletConnect() {
  const [connected, setConnected] = useState(false);
  // @ts-ignore
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [account, setAccount] = useState<WalletAccount | undefined>(undefined);

  const handleDisconnect = () => {
    setAccount(undefined);
    setConnected(false);
    console.log('Disconnect');
  };
  const handleConnect = async () => {
    if (!connected) {
      // check all the install wallet from window.injectedweb3
      const installedWallets = getWallets().filter(
        (wallet) => wallet.installed
      );
      // get talisman from the array of installed wallets
      const talismanWallet = installedWallets.find(
        (wallet) => wallet.extensionName === 'talisman'
      );
      if (talismanWallet as any) {
        try {
          await talismanWallet?.enable('genesisdao');
          const unsub = await talismanWallet?.subscribeAccounts(
            (accounts?: WalletAccount[]) => {
              if (accounts && accounts.length > 0 && accounts[0] !== null) {
                // only get the first account for now
                setAccount(accounts[0]);
                setConnected(true);
                console.log('Accounts:', accounts);
              } else {
                console.log('Unable to get accounts');
              }
            }
          );
          console.log('unsub', unsub);
        } catch (err) {
          console.log(talismanWallet?.transformError(err));
        }
      }
    } else {
      handleDisconnect();
    }
  };

  useEffect(() => {
    console.log('Connected?', connected);
  });

  return (
    <div>
      <div>
        <button className='btn-primary btn' onClick={handleConnect}>
          {!connected ? 'Connect' : 'Disconnect'}
        </button>
      </div>
      <div>{connected && account !== undefined && account.address}</div>
      <div>Sign message button here</div>
    </div>
  );
}

export default WalletConnect;
