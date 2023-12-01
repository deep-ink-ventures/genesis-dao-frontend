import { ErrorMessage } from '@hookform/error-message';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

// import useGenesisDao from '@/hooks/useGenesisDao';
import { type AssetHolding } from '@/services/assets';
import type { CreateEscrowFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import { isValidPolkadotAddress } from '@/utils';

import AssetHoldingCard from './AssetHoldingCard';

const CreateEscrowModal = (props: {
  open?: boolean;
  assetHolding: AssetHolding;
  delegateAccount?: string;
  daoId?: string;
  daoImage?: string | null;
  isDelegated?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  // const {} = useGenesisDao();

  const { assetHolding, daoImage, daoId, open, onClose, onSuccess } = props;
  const [isApproved, setIsApproved] = useState(false);

  const [
    currentWalletAccount,
    modalData,
    handleErrors,
    apiConnection,
    createApiConnection,
    daoTokenTreasuryBalance,
    currentDao,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.account.modals.createEscrow,
    s.handleErrors,
    s.apiConnection,
    s.createApiConnection,
    s.daoTokenTreasuryBalance,
    s.currentDao,
  ]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CreateEscrowFormValues>();

  const buttonText = () => {
    if (!isApproved) {
      return 'Approve';
    }

    if (!currentWalletAccount) {
      return 'Please Connect Wallet';
    }
    if (modalData.txnProcessing) {
      return 'Processing';
    }
    return 'Send';
  };

  const onDelegateAssetSuccess = () => {
    modalData.setTxnProcessing(false);
    modalData.setVisibility(false);
    if (onSuccess) {
      onSuccess();
    }
    reset();
  };

  const onSubmit: SubmitHandler<CreateEscrowFormValues> = () => {
    if (!isApproved) {
      setIsApproved(true);
    } else if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (!apiConnection) {
      createApiConnection();
    }
    // eslint-disable-next-line
  }, []);

  const loading = false;

  return (
    <Modal
      open={open}
      wrapClassName='a-modal-bg'
      className='a-modal'
      onCancel={onClose}
      footer={null}
      width={615}
      zIndex={99}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='px-12'>
          <h2 className='mb-4 text-center text-3xl font-semibold text-primary'>
            Create Escrow Wallet
          </h2>
          <div className='w-full space-y-8'>
            <div className='flex w-full items-center'>
              <p className='w-1/4'>Asset</p>
              <div className='grow'>
                <AssetHoldingCard
                  assetHolding={assetHolding}
                  daoImage={daoImage}
                  daoId={daoId}
                />
              </div>
            </div>
            <div className='flex w-full items-center'>
              <p className='w-1/4'>Account</p>
              <div className='grow'>
                <input
                  type='text'
                  className='input input-bordered input-primary'
                  placeholder='Address'
                  {...register('account', {
                    required: 'Required',
                    validate: (addr) =>
                      (addr && isValidPolkadotAddress(addr) === true) ||
                      'Not a valid address',
                  })}
                  disabled={loading || isApproved}
                />
                <ErrorMessage
                  errors={errors}
                  name='account'
                  render={({ message }) => (
                    <p className='ml-2 mt-1 text-error'>{message}</p>
                  )}
                />
              </div>
            </div>
            <div className='flex w-full items-center'>
              <p className='w-1/4'>Vesting Time</p>
              <div className='grow'>
                <input
                  type='number'
                  className='input input-bordered input-primary'
                  placeholder='Time in days'
                  {...register('vestingTime', {
                    required: 'Required',
                    validate: (days) =>
                      !Number.isNaN(Number(days)) || 'Not a valid value',
                  })}
                  disabled={loading || isApproved}
                />
                <ErrorMessage
                  errors={errors}
                  name='vestingTime'
                  render={({ message }) => (
                    <p className='ml-2 mt-1 text-error'>{message}</p>
                  )}
                />
              </div>
            </div>
            <div className='flex w-full items-center'>
              <p className='w-1/4'>Amount</p>
              <div className='grow'>
                <input
                  type='number'
                  className='input input-bordered input-primary'
                  placeholder='Amount'
                  {...register('amount', {
                    // required: 'Required',
                    // validate: (amount) =>
                    //   daoTokenTreasuryBalance?.gte(new BN(`${amount}`)) ||
                    //   `Maximum value is ${uiTokens(
                    //     daoTokenTreasuryBalance || new BN(0),
                    //     'dao',
                    //     currentDao?.daoId
                    //   )}`,
                  })}
                  disabled={loading || isApproved}
                />
                <ErrorMessage
                  errors={errors}
                  name='amount'
                  render={({ message }) => (
                    <p className='ml-2 mt-1 text-error'>{message}</p>
                  )}
                />
              </div>
            </div>
            <div className='mt-10 flex w-full gap-2'>
              <button
                className={cn('btn mr-3 w-1/2 bg-white')}
                onClick={onClose}
                disabled={loading}>
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                className={cn('btn btn-primary w-1/2 ', {
                  'btn-disabled': false,
                  loading,
                })}>
                {buttonText()}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEscrowModal;
