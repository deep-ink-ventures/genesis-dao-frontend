// import useGenesisDao from '@/hooks/useGenesisDao';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useMemo, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';

interface EnablePluginFormValues {}

const EnablePlugins = () => {
  const [isOpen, setIsOpen] = useState(false);
  const formMethods = useForm<EnablePluginFormValues>();
  const [hasExtension, setHasExtension] = useState(false);

  const { handleSubmit } = formMethods;

  const [currentWalletAccount] = useGenesisStore((s) => [
    s.currentWalletAccount,
  ]);

  const handleEnablePlugin = () => {
    setIsOpen(true);
  };

  const loading = false;

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit: SubmitHandler<EnablePluginFormValues> = () => {
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

    if (hasExtension) {
      return 'Connect to your DAO';
    }

    return 'Create Extension';
  };

  const descriptionText = useMemo(
    () =>
      hasExtension
        ? `Your plugin store is ready, you can now connect it to your DAO.`
        : `Connect your DAO to ink! - a smart contract layer that allows you
  to extend the functionality of your ink layer.`,
    [hasExtension]
  );

  return (
    <>
      <div className='flex justify-center'>
        <button
          className={`btn btn-primary w-[180px] ${loading ? 'loading' : ''}`}
          disabled={!currentWalletAccount}
          onClick={handleEnablePlugin}>
          Enable Plugins
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
              Enable Plugins
            </h2>
            <div className='w-full space-y-8'>{descriptionText}</div>
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
        </form>
      </Modal>
    </>
  );
};

export default EnablePlugins;
