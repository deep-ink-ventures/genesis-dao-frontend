// import useGenesisDao from '@/hooks/useGenesisDao';
import { ErrorMessage } from '@hookform/error-message';
import { BN } from '@polkadot/util';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';
import { isValidPolkadotAddress, uiTokens } from '@/utils';

interface CreateVestingWalletFormValues {
  account?: string;
  vestingTime?: number;
  amount?: number;
}

const CreateVestingWallet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const formMethods = useForm<CreateVestingWalletFormValues>();
  const [hasExtension, setHasExtension] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = formMethods;

  const [currentWalletAccount, daoTokenTreasuryBalance, currentDao] =
    useGenesisStore((s) => [
      s.currentWalletAccount,
      s.daoTokenTreasuryBalance,
      s.currentDao,
    ]);

  const handleEnablePlugin = () => {
    setIsOpen(true);
  };

  const loading = false;

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit: SubmitHandler<CreateVestingWalletFormValues> = () => {
    if (!hasExtension) {
      setHasExtension(true);
    } else {
      onClose();
    }
  };

  const buttonText = () => {
    if (!currentWalletAccount) {
      return 'Please Connect Wallet';
    }
    if (loading) {
      return 'Processing';
    }

    return 'Send';
  };

  return (
    <>
      <div className='flex justify-center'>
        <button
          className={`btn btn-primary w-[180px] ${loading ? 'loading' : ''}`}
          disabled={!currentWalletAccount}
          onClick={handleEnablePlugin}>
          Create Wallet
        </button>
      </div>
      <Modal
        open={isOpen}
        wrapClassName='a-modal-bg'
        className='a-modal'
        onCancel={onClose}
        footer={null}
        width={615}
        zIndex={99}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='px-12'>
            <h2 className='mb-4 text-center text-3xl font-semibold text-primary'>
              Create Vesting Wallet
            </h2>
            <div className='w-full space-y-8'>
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
                    disabled={loading}
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
                    disabled={loading}
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
                      required: 'Required',
                      validate: (amount) =>
                        daoTokenTreasuryBalance?.gte(new BN(`${amount}`)) ||
                        `Maximum value is ${uiTokens(
                          daoTokenTreasuryBalance || new BN(0),
                          'dao',
                          currentDao?.daoId
                        )}`,
                    })}
                    disabled={loading}
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
    </>
  );
};

export default CreateVestingWallet;
