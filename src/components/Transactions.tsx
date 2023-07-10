import { useState } from 'react';

import useGenesisStore from '@/stores/genesisStore';

import TransactionAccordion from './TransactionAccordion';

const Transactions = () => {
  const [currentWalletAccount] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.account,
  ]);

  const [, setSearchTerm] = useState('');
  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='container flex w-full flex-col gap-y-4 p-6'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <h1 className='text-2xl'>Transactions</h1>
        </div>
        <div className='flex gap-x-4'>
          <div>
            <input
              id='search-input'
              className='input-primary input w-72 text-sm'
              placeholder='Search'
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      <div className='space-y-4 py-4'>
        {!currentWalletAccount && (
          <div className='w-full text-center text-sm text-neutral-focus'>
            Connect to view Transactions
          </div>
        )}
        {currentWalletAccount &&
          Array(5)
            .fill(null)
            .map((i, index) => <TransactionAccordion key={index} />)}
      </div>
    </div>
  );
};

export default Transactions;
