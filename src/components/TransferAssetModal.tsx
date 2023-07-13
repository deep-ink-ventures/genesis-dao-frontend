import { ErrorMessage } from '@hookform/error-message';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useForm } from 'react-hook-form';

import type { Asset, AssetHolding } from '@/services/assets';
import type { Dao } from '@/services/daos';
import { isValidPolkadotAddress } from '@/utils';

import AssetHoldingCard from './AssetHoldingCard';

const TransferAssetModal = (props: {
  open?: boolean;
  assetHolding: AssetHolding & { asset?: Asset & { dao?: Dao } };
  onClose?: () => void;
}) => {
  const { assetHolding, open, onClose } = props;
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <Modal
      open={open}
      wrapClassName='a-modal-bg'
      className='a-modal'
      onCancel={onClose}
      footer={null}
      width={615}
      zIndex={99}>
      <div className='px-12'>
        <h2 className='text-center text-3xl font-semibold text-primary'>
          Transfer Asset
        </h2>
        <div className='w-full space-y-8'>
          <div className='flex w-full items-center'>
            <p className='w-1/4'>Transfer to</p>
            <div className='grow'>
              <input
                type='text'
                className='input-bordered input-primary input'
                placeholder='Recipient Address'
                {...register('toAddress', {
                  required: 'Required',
                  validate: (add) =>
                    isValidPolkadotAddress(add) === true ||
                    'Not a valid address',
                })}
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
                className='input-bordered input-primary input'
                placeholder='Amount'
                {...register('amount', {
                  valueAsNumber: true,
                  required: 'Required',
                  min: {
                    value: 0.000001,
                    message: 'The Amount is zero or too small',
                  },
                })}
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
        <div className='flex w-full gap-2'>
          <button className={cn('btn mr-3 w-1/2 bg-white')} onClick={onClose}>
            Cancel
          </button>
          <button
            className={cn('btn-primary btn w-1/2 ', {
              'btn-disabled': !assetHolding.balance,
            })}>
            Send
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransferAssetModal;
