import { ErrorMessage } from '@hookform/error-message';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import { type AssetHolding } from '@/services/assets';
import type { DelegateFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import { isValidPolkadotAddress } from '@/utils';

import AssetHoldingCard from './AssetHoldingCard';

const DelegateAssetModal = (props: {
  open?: boolean;
  assetHolding: AssetHolding;
  delegateAccount?: string;
  daoId?: string;
  daoImage?: string | null;
  isDelegated?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  const { delegate, revokeDelegation } = useGenesisDao();

  const {
    assetHolding,
    daoImage,
    daoId,
    open,
    delegateAccount,
    isDelegated,
    onClose,
    onSuccess,
  } = props;

  const [
    currentWalletAccount,
    modalData,
    handleErrors,
    apiConnection,
    createApiConnection,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    isDelegated
      ? s.pages.account.modals.revokeDelegate
      : s.pages.account.modals.delegate,
    s.handleErrors,
    s.apiConnection,
    s.createApiConnection,
  ]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<DelegateFormValues>({
    defaultValues: {
      account: delegateAccount,
    },
  });

  const buttonText = () => {
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

  const onSubmit: SubmitHandler<DelegateFormValues> = async (data) => {
    if (currentWalletAccount) {
      try {
        modalData.setTxnProcessing(true);

        if (isDelegated) {
          delegate(
            currentWalletAccount,
            assetHolding.assetId,
            data.account,
            () => modalData.setTxnProcessing(true),
            onDelegateAssetSuccess
          );
        } else {
          revokeDelegation(
            currentWalletAccount,
            assetHolding.assetId,
            data.account,
            () => modalData.setTxnProcessing(true),
            onDelegateAssetSuccess
          );
        }
      } catch (ex) {
        handleErrors(
          `Errors in ${
            isDelegated ? 'revoking asset delegation' : 'delegating asset'
          }`,
          new Error(ex)
        );
      }
    }
  };

  useEffect(() => {
    if (!apiConnection) {
      createApiConnection();
    }
    // eslint-disable-next-line
  }, []);

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
            Delegate Voting Power
          </h2>
          <div className='w-full space-y-8'>
            <div className='flex w-full items-center'>
              <p className='w-1/4'>Account</p>
              <div className='grow'>
                <input
                  type='text'
                  className='input input-bordered input-primary'
                  placeholder='Recipient Address'
                  {...register('account', {
                    required: 'Required',
                    validate: (add) =>
                      isValidPolkadotAddress(add) === true ||
                      'Not a valid address',
                  })}
                  disabled={modalData.txnProcessing || isDelegated}
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
              <p className='w-1/4'>Asset</p>
              <div className='grow'>
                <AssetHoldingCard
                  assetHolding={assetHolding}
                  daoImage={daoImage}
                  daoId={daoId}
                />
              </div>
            </div>
          </div>
          <div className='mt-10 flex w-full gap-2'>
            <button
              className={cn('btn mr-3 w-1/2 bg-white')}
              onClick={onClose}
              disabled={modalData.txnProcessing}>
              Cancel
            </button>
            <button
              type='submit'
              disabled={modalData.txnProcessing}
              className={cn('btn btn-primary w-1/2 ', {
                'btn-disabled': !assetHolding.balance,
                loading: modalData.txnProcessing,
              })}>
              {buttonText()}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DelegateAssetModal;
