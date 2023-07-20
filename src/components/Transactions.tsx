import { useEffect, useState } from 'react';

import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import TransactionAccordion from '@/components/TransactionAccordion';
import useGenesisStore from '@/stores/genesisStore';

const Transactions = (props: { daoId: string }) => {
  const { daoId } = props;
  const [currentWalletAccount, dao] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.dao,
  ]);

  const [, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    offset: 0,
  });

  const [activeAccordion, setActiveAccordion] = useState<string | null>();
  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const fetchTransactions = () => {
    dao.transactions.fetchTransactions({
      limit: 5,
      offset: pagination.offset - 1,
      daoId,
    });
  };

  useEffect(() => {
    if (dao.transactions.loading === false && currentWalletAccount) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  const handleAccordionClick = (proposalId?: string) => {
    setActiveAccordion(activeAccordion === proposalId ? null : proposalId);
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
        {currentWalletAccount && dao.transactions.loading && (
          <Loading spinnerSize='32' />
        )}
        {currentWalletAccount &&
          !dao.transactions.loading &&
          dao.transactions.data?.map((proposal) => (
            <TransactionAccordion
              key={proposal.proposalId}
              proposal={proposal}
              collapsed={
                proposal.proposalId !== activeAccordion || !activeAccordion
              }
              onClick={() => handleAccordionClick(proposal.proposalId)}
            />
          ))}
        {!dao.transactions.loading && currentWalletAccount && (
          <div>
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={5}
              totalCount={dao.transactions.totalCount}
              onPageChange={(newPage, newOffset) =>
                setPagination({ currentPage: newPage, offset: newOffset })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
