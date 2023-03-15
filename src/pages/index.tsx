import Image from 'next/image';
import { useEffect } from 'react';

import CreateDaoModal from '@/components/CreateDaoModal';
import ExploreDaos from '@/components/ExploreDaos';
import WalletConnect from '@/components/WalletConnect';
import useGenesisStore from '@/stores/genesisStore';
import circleBG from '@/svg/BG.svg';
import handAndBalls from '@/svg/handandballs.svg';
import justice from '@/svg/justice.svg';
import scale from '@/svg/scale.svg';
import sticker from '@/svg/sticker.svg';
import MainLayout from '@/templates/MainLayout';

const Index = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const daosOwnedByWallet = useGenesisStore((s) => s.daosOwnedByWallet);
  const updateIsStartModalOpen = useGenesisStore(
    (s) => s.updateIsStartModalOpen
  );

  const handleStartModal = () => {
    updateIsStartModalOpen(true);
  };

  useEffect(() => {}, [daosOwnedByWallet, currentWalletAccount]);

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO Description'>
      <div className='flex-col'>
        <div className='mb-8 flex-col items-center justify-center border-b-2 border-dashed border-content-primary/50 pt-2'>
          <div className='my-4 py-5'>
            <h1 className='text-center'>
              Empower The People: Unleash the Potential of Your Organization
              With a DAO
            </h1>
          </div>
          <div className='my-4 flex items-center justify-between px-10 py-4 text-center'>
            <div className='container h-[156px] max-w-[272px] py-2'>
              <h4 className='m-2'>NO-CODE DAO SETUP</h4>
              <h2 className='mb-2'>200</h2>
              <p className='font-medium text-primary'>TOTAL DAO CREATED</p>
            </div>
            <div className='container h-[156px] max-w-[272px] py-2'>
              <h4 className='m-2'>COMMUNITY-LED</h4>
              <h2 className='mb-2'>323K</h2>
              <p className='font-medium text-primary'>TOTAL MEMBERS</p>
            </div>
            <div className='container h-[156px] max-w-[272px] py-2'>
              <h4 className='m-2'>TRANSPARENCY</h4>
              <h2 className='mb-2'>2.7K</h2>
              <p className='font-medium text-primary'>TOTAL PROPOSALS</p>
            </div>
            <div className='container h-[156px] max-w-[272px] py-2'>
              <h4 className='m-2'>DEMOCRATIC</h4>
              <h2 className='mb-2'>2314</h2>
              <p className='font-medium text-primary'>WALLETS VOTED</p>
            </div>
          </div>
        </div>
        <div className='container mb-8 flex min-h-[400px] justify-around'>
          <div className='flex min-w-[50%] flex-auto flex-col items-center text-center'>
            <div className='mx-10 mb-5 px-28'>
              <h4 className='mt-6'>
                Step into the future of Governance with DAO
              </h4>
            </div>
            <div>
              <ul className='relative ml-16 border-l text-left'>
                <li className='ml-5 mb-6'>
                  <span className='absolute -left-6 flex h-12 w-12 items-center justify-center rounded-full border bg-white'>
                    <Image src={justice} height={28} width={28} alt='justice' />
                  </span>
                  <p className='ml-4 pt-1 text-xs'>Step 1</p>
                  <p className='ml-4'>Find or create a DAO</p>
                </li>
                <li className='ml-5 mb-6'>
                  <span className='absolute -left-6 flex h-12 w-12 items-center justify-center rounded-full border bg-white'>
                    <Image src={scale} height={28} width={28} alt='justice' />
                  </span>
                  <p className='ml-4 pt-1 text-xs'>Step 2</p>
                  <p className='ml-4'>Create or vote on Proposals</p>
                </li>
                <li className='ml-5 mb-6'>
                  <span className='absolute -left-6 flex h-12 w-12 items-center justify-center rounded-full border bg-white'>
                    <Image src={sticker} height={25} width={25} alt='justice' />
                  </span>
                  <p className='ml-4 pt-1 text-xs'>Step 3</p>
                  <p className='ml-4'>Monitor and maintain the goals</p>
                </li>
                <li className='ml-5 mb-6'>
                  <span className='absolute -left-6 flex h-12 w-12 items-center justify-center rounded-full border bg-white'>
                    <Image
                      src={handAndBalls}
                      height={28}
                      width={28}
                      alt='justice'
                    />
                  </span>
                  <p className='ml-4 pt-1 text-xs'>Step 4</p>
                  <p className='ml-4'>Get rewarded with tokens</p>
                </li>
              </ul>
            </div>
            <div className='absolute z-[-20] opacity-50 mix-blend-soft-light'>
              <Image src={circleBG} alt='circle bg' height={459} width={598} />
            </div>
          </div>
          <div className='my-10 flex min-w-[50%] flex-auto flex-col justify-between px-24 pb-20 text-center'>
            <div>
              <h3>{`Let's Begin`}</h3>
            </div>
            <div>
              <p>
                Our Platform makes it simple to launch and manage a DAO, with
                customizable governance rules and transparent decision-making
                processes
              </p>
            </div>
            <div>
              {currentWalletAccount ? (
                <button className='btn-primary btn' onClick={handleStartModal}>
                  Create a New DAO
                </button>
              ) : (
                <WalletConnect
                  text={'Connect Wallet & Create DAO'}
                  onClose={handleStartModal}
                />
              )}
              <CreateDaoModal />
            </div>
          </div>
        </div>
        <ExploreDaos />
      </div>
    </MainLayout>
  );
};

export default Index;
