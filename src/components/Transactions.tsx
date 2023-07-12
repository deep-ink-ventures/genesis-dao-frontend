import { useEffect, useState } from 'react';

import useGenesisStore from '@/stores/genesisStore';

import TransactionAccordion from './TransactionAccordion';

const Transactions = (props: { daoId: string }) => {
  const { daoId } = props;
  const [currentWalletAccount, dao] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.dao,
  ]);

  const [, setSearchTerm] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<string>();
  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    dao.transactions.fetchTransactions({
      dao_id: daoId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoId]);

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
          dao.transactions.data?.map((proposal) => (
            <TransactionAccordion
              key={proposal.proposalId}
              proposal={proposal}
              collapsed={
                proposal.proposalId !== activeAccordion || !activeAccordion
              }
              onClick={() => setActiveAccordion(proposal.proposalId)}
            />
          ))}
      </div>
    </div>
  );
};

export default Transactions;
