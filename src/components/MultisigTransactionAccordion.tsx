import { sortAddresses } from '@polkadot/util-crypto';
import cn from 'classnames';
import Image from 'next/image';

import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';
import arrowUp from '@/svg/arrow-up.svg';
import memberSign from '@/svg/memberSign.svg';
import type { MultiSig } from '@/types/multiSig';
import type {
  AsMultiParameters,
  CancelAsMultiParameters,
  MultiSigTransaction,
  MultiSigTransactionStatus,
} from '@/types/multiSigTransaction';
import { isValidPolkadotAddress, truncateMiddle } from '@/utils';
import { formatISOTimestamp } from '@/utils/date';

import type { BadgeVariant } from './Badge';
import Badge from './Badge';

const MultisigTransactionStatusBadgeMap: Record<
  MultiSigTransactionStatus,
  BadgeVariant
> = {
  PENDING: 'warning',
  EXECUTED: 'success',
  CANCELLED: 'danger',
};

interface TransactionAccordionProps {
  multisigTransaction: MultiSigTransaction;
  multiSig?: MultiSig;
  collapsed?: boolean;
  onClick?: () => void;
}

interface ExtrinsicFunctionMapping {
  transfer_keep_alive: string;
  change_owner: string;
  [key: string]: string | undefined;
}

const extrinsicFunctionToEnglish: ExtrinsicFunctionMapping = {
  transfer_keep_alive: 'Transfer DAO Tokens',
  change_owner: 'Change DAO Owner',
};

type ExtrinsicFunctions = keyof typeof extrinsicFunctionToEnglish;

const convertFunctionToEnglish = (
  str: ExtrinsicFunctions | null | undefined
) => {
  if (!str) {
    return ' - ';
  }
  return extrinsicFunctionToEnglish[str];
};

const MultisigTransactionAccordion = ({
  multisigTransaction,
  collapsed,
  onClick,
}: TransactionAccordionProps) => {
  const [
    currentWalletAccount,
    currentDao,
    handleErrors,
    updateTxnProcessing,
    txnProcessing,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.currentDao,
    s.handleErrors,
    s.updateTxnProcessing,
    s.txnProcessing,
  ]);

  const { makeMultiSigTxnAndSend, cancelMultisigTxnAndSend } = useGenesisDao();
  // This user has already approved this multisig transaction
  const isApprover =
    Boolean(currentWalletAccount?.address) &&
    multisigTransaction.approvers?.some(
      (approver) =>
        approver.toLowerCase() === currentWalletAccount?.address.toLowerCase()
    );

  // It's admin but has not approved this multisig transaction
  // const hasNotApproved = !!currentDao?.adminAddresses.filter(
  //   (addy) => !multisigTransaction.approvers?.includes(addy)
  // );

  // It's the address that initiated the multisig txn. The only address that can cancel the txn(to get tokens back)
  // const isFirstApprover =
  //   multisigTransaction.approvers?.[0] === currentWalletAccount?.address;

  const transactionArgs =
    multisigTransaction.call?.args != null &&
    Boolean(Object.keys(multisigTransaction.call?.args)?.length) &&
    Object.keys(multisigTransaction.call?.args).map((key) => ({
      key,
      value: multisigTransaction.call?.args?.[key] || '-',
    }));

  const handleApprove = async () => {
    updateTxnProcessing(true);

    const { call, threshold } = multisigTransaction;

    if (
      !threshold ||
      !currentDao?.adminAddresses ||
      !call?.data ||
      !call?.timepoint ||
      !currentWalletAccount
    ) {
      handleErrors('Error in multisig approval');
      return;
    }

    const otherSignatories = sortAddresses([
      ...currentDao.adminAddresses.filter((address) => {
        return address !== currentWalletAccount.address;
      }),
    ]);

    const arg: AsMultiParameters = {
      threshold,
      otherSignatories,
      txnInHex: call?.data,
      timepoint: call?.timepoint,
      weight: {
        refTime: 857484000,
        proofSize: 3120,
      },
    };

    try {
      makeMultiSigTxnAndSend(arg, () => {
        updateTxnProcessing(false);
      });
    } catch (err) {
      handleErrors('Error in sending approval transaction', err);
      updateTxnProcessing(false);
    }
  };

  const handleCancel = () => {
    updateTxnProcessing(true);

    const { call, threshold } = multisigTransaction;

    if (
      !threshold ||
      !currentDao?.adminAddresses ||
      !call?.hash ||
      !call?.timepoint ||
      !currentWalletAccount
    ) {
      handleErrors('Error in cancel multisig values');
      return;
    }

    const otherSignatories = sortAddresses([
      ...currentDao.adminAddresses.filter((address) => {
        return address !== currentWalletAccount.address;
      }),
    ]);

    const arg: CancelAsMultiParameters = {
      threshold,
      otherSignatories,
      txnHashInHex: call?.hash,
      timepoint: call?.timepoint,
    };

    try {
      cancelMultisigTxnAndSend(arg, () => {
        updateTxnProcessing(false);
      });
    } catch (err) {
      handleErrors('Error in canceling multisig transaction', err);
      updateTxnProcessing(false);
    }
  };

  return (
    <div
      className={cn('rounded-lg border-[0.02rem] border-neutral-focus p-4', {
        'space-y-3': !collapsed,
      })}>
      <div
        className={cn(
          'flex w-full cursor-pointer flex-wrap items-center gap-2 border-neutral-focus',
          {
            'border-b-[0.02rem] pb-2': !collapsed,
          }
        )}
        onClick={onClick}>
        <div className='grow'>
          {convertFunctionToEnglish(multisigTransaction.call?.function) || '-'}
        </div>
        <div className='mr-2 flex text-[0.8rem]'>
          <Image
            src={memberSign}
            alt='Member Sign'
            height={16}
            width={16}
            className='mr-1'
          />
          {`${multisigTransaction.approvers?.length || 'N/A'} `}
          out of
          {` ${currentDao?.adminAddresses?.length || 'N/A'}`}
        </div>
        <div className='mr-4 flex items-center gap-2 text-xs'>
          {formatISOTimestamp(multisigTransaction?.createdAt)}
        </div>
        <Badge
          variant={
            MultisigTransactionStatusBadgeMap[multisigTransaction.status]
          }
          className='ml-auto w-fit text-xs capitalize'>
          {multisigTransaction.status}
        </Badge>
        <div className='p-2'>
          <Image
            src={arrowUp}
            className={cn(
              'duration-5000 transform transition-all ease-in-out',
              {
                'rotate-180': collapsed,
              }
            )}
            alt='Collapse'
            height={16}
            width={16}
          />
        </div>
      </div>
      <div
        className={cn(
          'opacity-1 duration-5000 flex flex-col gap-4 transition-all ease-in-out lg:flex-row',
          {
            '!h-[0px] min-h-[0px] overflow-hidden opacity-0': collapsed,
            'min-h-[100px]': !collapsed,
          }
        )}>
        <div className='w-full space-y-2 lg:w-1/2'>
          <div className='border border-gray-300'>
            <div className='grid grid-cols-2 gap-0'>
              <div className='border border-gray-300 p-2'>Parameter</div>
              <div className='border border-gray-300 p-2'>Value</div>
            </div>
            {transactionArgs &&
              transactionArgs?.map((arg, index) => (
                <div
                  key={`${index}-${arg.key}`}
                  className='grid grid-cols-2 gap-0'>
                  <div className='truncate border border-gray-300 p-2'>
                    {arg.key}
                  </div>
                  <div className='truncate border border-gray-300 p-2'>
                    {isValidPolkadotAddress(arg.value)
                      ? truncateMiddle(arg.value, 5, 4)
                      : arg.value}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className='h-[inherit] border-r-[0.02rem] border-neutral-focus' />
        <div className='w-full space-y-4 lg:w-1/2'>
          <div>
            <div className='text-sm text-neutral opacity-75'>Approvers</div>
            <div className='text-neutral'>
              {multisigTransaction?.approvers?.map((approver, index) => (
                <div key={`${index}-${approver}`} className='truncate'>
                  {approver}
                </div>
              ))}
            </div>
          </div>
          <div className='w-full border-b-[0.02rem] border-neutral-focus' />
          <div className='space-y-2'>
            <div className='flex gap-2'>
              {/* fixme */}
              {true && (
                <button
                  className={`btn btn-primary flex-1 text-neutral ${
                    txnProcessing ? 'loading' : ''
                  }`}
                  disabled={isApprover}
                  onClick={handleApprove}>
                  Approve
                </button>
              )}
              {true && (
                <button
                  className='btn btn-primary flex-1 text-neutral'
                  onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultisigTransactionAccordion;
