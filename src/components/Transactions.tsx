import { useEffect, useState } from 'react';

import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import useGenesisStore from '@/stores/genesisStore';

import MultisigTransactionAccordion from './MultisigTransactionAccordion';

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

  const [activeAccordion, setActiveAccordion] = useState<number | null>();
  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const fetchTransactions = () => {
    dao.multiSigTransactions.fetchMultiSigTransactions({
      limit: 5,
      offset: pagination.offset - 1,
      dao_id: daoId,
    });
  };

  useEffect(() => {
    if (dao.multiSigTransactions.loading === false && currentWalletAccount) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, currentWalletAccount]);

  const handleAccordionClick = (multisigTxnId?: number) => {
    setActiveAccordion(
      activeAccordion === multisigTxnId ? null : multisigTxnId
    );
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
              className='input input-primary w-72 text-sm'
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
        {currentWalletAccount && dao.multiSigTransactions.loading && (
          <Loading spinnerSize='32' />
        )}
        {currentWalletAccount &&
          !dao.multiSigTransactions.loading &&
          !dao.multiSigTransactions.data?.length && (
            <>Sorry, no transactions found</>
          )}
        {currentWalletAccount &&
          !dao.multiSigTransactions.loading &&
          dao.multiSigTransactions.data?.map((multisigTransaction) => (
            <MultisigTransactionAccordion
              key={multisigTransaction.id}
              multisigTransaction={multisigTransaction}
              collapsed={
                multisigTransaction.id !== activeAccordion || !activeAccordion
              }
              onClick={() => handleAccordionClick(multisigTransaction.id)}
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
