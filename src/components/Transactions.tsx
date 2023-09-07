import cn from 'classnames';
import { useEffect, useState } from 'react';

import Loading from '@/components/Loading';
import useGenesisStore from '@/stores/genesisStore';
import type { MultiSigTransaction } from '@/types/multiSigTransaction';
import { MultiSigTransactionStatus } from '@/types/multiSigTransaction';

import MultisigTransactionAccordion, {
  convertFunctionToEnglish,
} from './MultisigTransactionAccordion';
import Pagination from './Pagination';

const MultisigTransactionFilterList = [
  {
    value: MultiSigTransactionStatus.Pending,
    label: 'Pending',
  },
  {
    value: MultiSigTransactionStatus.Cancelled,
    label: 'Cancelled',
  },
  {
    value: MultiSigTransactionStatus.Executed,
    label: 'Executed',
  },
];

const Transactions = (props: { daoId: string }) => {
  const { daoId } = props;
  const [currentWalletAccount, dao] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.dao,
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const [filter, setFilter] = useState(MultiSigTransactionStatus.Pending);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    offset: 0,
  });
  const [activeAccordion, setActiveAccordion] = useState<number | null>();

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchTransactions = () => {
    dao.multiSigTransactions.fetchMultiSigTransactions({
      limit: 5,
      daoId,
      offset: Math.max(pagination.offset - 1, 0),
      search: filter,
    });
  };

  useEffect(() => {
    if (dao.multiSigTransactions.loading === false && currentWalletAccount) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, currentWalletAccount, filter]);

  const handleAccordionClick = (multisigTxnId?: number) => {
    setActiveAccordion(
      activeAccordion === multisigTxnId ? null : multisigTxnId
    );
  };

  const handleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSetFilter = (newFilter: MultiSigTransactionStatus) => {
    setFilter(newFilter);
    setPagination({
      offset: 0,
      currentPage: 1,
    });
    setDropdownOpen(false);
  };

  const filterTransaction = (multisigTransaction: MultiSigTransaction) => {
    return (
      !searchTerm?.length ||
      [
        multisigTransaction.daoId,
        multisigTransaction.callHash,
        convertFunctionToEnglish(multisigTransaction.call?.function),
      ]
        .filter((values) => values?.length)
        .some((value) =>
          value?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  return (
    <div className='container flex w-full flex-col gap-y-4 p-6'>
      <div className='flex flex-wrap justify-between gap-x-4'>
        <div className='flex grow items-center'>
          <h1 className='text-2xl'>Transactions</h1>
        </div>
        <div className='flex grow-0 gap-x-4'>
          <div>
            <input
              id='search-input'
              className='input input-primary w-72 text-sm'
              placeholder='Search'
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className='z-10 w-36 shrink-0 grow-0'>
          <div className='flex flex-col'>
            <button
              tabIndex={0}
              className={`btn bg-transparent px-6 py-3.5 hover:bg-base-100`}
              onClick={handleDropdownOpen}>
              <span className='flex items-center gap-2 text-neutral'>
                {MultisigTransactionFilterList.find(
                  (multiSigTxnFilter) => multiSigTxnFilter.value === filter
                )?.label || MultiSigTransactionStatus.Pending}{' '}
                <span>
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
              </span>
            </button>
            <div className='relative'>
              <div
                className={cn(
                  'shadow-[0_0_4px_0_rgba(255, 255, 255, 0.20)] absolute right-0 top-[5px] w-fit space-y-2 rounded-2xl bg-primary-content py-1 shadow-sm',
                  {
                    hidden: !dropdownOpen,
                  }
                )}>
                {MultisigTransactionFilterList.map((multiSigTxnFilter) => (
                  <div
                    key={multiSigTxnFilter.value}
                    onClick={() => handleSetFilter(multiSigTxnFilter.value)}
                    className={cn(
                      `group flex cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-2 hover:text-primary`,
                      {
                        'text-primary': multiSigTxnFilter.value === filter,
                      }
                    )}>
                    {multiSigTxnFilter.label}
                  </div>
                ))}
              </div>
            </div>
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
          dao.multiSigTransactions.data
            ?.filter((transaction) => filterTransaction(transaction))
            ?.map((multisigTransaction) => (
              <MultisigTransactionAccordion
                key={multisigTransaction.id}
                multisigTransaction={multisigTransaction}
                collapsed={
                  multisigTransaction.id !== activeAccordion || !activeAccordion
                }
                onClick={() => handleAccordionClick(multisigTransaction.id)}
                onSuccess={fetchTransactions}
              />
            ))}
        {!dao.multiSigTransactions.loading && currentWalletAccount && (
          <div>
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={5}
              totalCount={dao.multiSigTransactions.totalCount}
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
