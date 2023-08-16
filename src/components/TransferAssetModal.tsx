import { ErrorMessage } from '@hookform/error-message';
import { BN } from '@polkadot/util';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { DAO_UNITS } from '@/config';
import useGenesisDao from '@/hooks/useGenesisDao';
import type { Asset, AssetHolding } from '@/services/assets';
import type { Dao } from '@/services/daos';
import type { TransferFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import { isValidPolkadotAddress } from '@/utils';

import AssetHoldingCard from './AssetHoldingCard';

const TransferAssetModal = (props: {
  open?: boolean;
  assetHolding: AssetHolding & { asset?: Asset & { dao?: Dao } };
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  const { transfer } = useGenesisDao();
  const [
    currentWalletAccount,
    transferAssets,
    handleErrors,
    apiConnection,
    createApiConnection,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.account.modals.transferAssets,
    s.handleErrors,
    s.apiConnection,
    s.createApiConnection,
  ]);

  const { assetHolding, open, onClose, onSuccess } = props;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TransferFormValues>();

  const buttonText = () => {
    if (!currentWalletAccount) {
      return 'Please Connect Wallet';
    }
    if (transferAssets.txnProcessing) {
      return 'Processing';
    }
    return 'Send';
  };

  const onTransferAssetSuccess = () => {
    transferAssets.setTxnProcessing(false);
    transferAssets.setVisibility(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const onSubmit: SubmitHandler<TransferFormValues> = async (data) => {
    const bnAmount = new BN(data.amount * DAO_UNITS);
    if (currentWalletAccount) {
      try {
        transferAssets.setTxnProcessing(true);

        transfer(
          currentWalletAccount,
          assetHolding.asset_id,
          data.toAddress,
          bnAmount,
          () => transferAssets.setTxnProcessing(true),
          onTransferAssetSuccess
        );
      } catch (ex) {
        handleErrors(new Error(ex));
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
            Transfer Asset
          </h2>
          <div className='w-full space-y-8'>
            <div className='flex w-full items-center'>
              <p className='w-1/4'>Transfer to</p>
              <div className='grow'>
                <input
                  type='text'
                  className='input input-bordered input-primary'
                  placeholder='Recipient Address'
                  {...register('toAddress', {
                    required: 'Required',
                    validate: (add) =>
                      isValidPolkadotAddress(add) === true ||
                      'Not a valid address',
                  })}
                  disabled={transferAssets.txnProcessing}
                />
                <ErrorMessage
                  errors={errors}
                  name='toAddress'
                  render={({ message }) => (
                    <p className='ml-2 mt-1 text-error'>{message}</p>
                  )}
                />
              </div>
            </div>
            <div className='flex w-full items-center'>
              <p className='w-1/4'>Asset</p>
              <div className='grow'>
                <AssetHoldingCard assetHolding={assetHolding} />
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
                    valueAsNumber: true,
                    required: 'Required',
                    min: {
                      value: 0.000001,
                      message: 'The Amount is zero or too small',
                    },
                  })}
                  disabled={transferAssets.txnProcessing}
                />
                <ErrorMessage
                  errors={errors}
                  name='toAddress'
                  render={({ message }) => (
                    <p className='ml-2 mt-1 text-error'>{message}</p>
                  )}
                />
              </div>
            </div>
          </div>
          <div className='mt-10 flex w-full gap-2'>
            <button
              className={cn('btn mr-3 w-1/2 bg-white')}
              onClick={onClose}
              disabled={transferAssets.txnProcessing}>
              Cancel
            </button>
            <button
              type='submit'
              disabled={transferAssets.txnProcessing}
              className={cn('btn btn-primary w-1/2 ', {
                'btn-disabled': !assetHolding.balance,
                loading: transferAssets.txnProcessing,
              })}>
              {buttonText()}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TransferAssetModal;
