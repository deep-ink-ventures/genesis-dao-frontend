// import useGenesisDao from '@/hooks/useGenesisDao';
import { BN } from '@polkadot/util';
import Modal from 'antd/lib/modal';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';
import type { TokenRecipient } from '@/types/council';

import { DistributeTokensForm } from './DistributeTokensForm';

interface TransferAssetFormValues {
  tokenRecipients: TokenRecipient[];
}

const TransferAsset = () => {
  const { makeBatchTransferTxn, sendBatchTxns } = useGenesisDao();
  const [currentDaoFromChain] = useGenesisStore((s) => [s.currentDaoFromChain]);

  const [
    currentDao,
    fetchDaoFromDB,
    currentWalletAccount,
    txnProcessing,
    daoTokenBalance,
    handleErrors,
    updateShowCongrats,
  ] = useGenesisStore((s) => [
    s.currentDao,
    s.fetchDaoFromDB,
    s.currentWalletAccount,
    s.txnProcessing,
    s.daoTokenBalance,
    s.handleErrors,
    s.updateShowCongrats,
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const formMethods = useForm<TransferAssetFormValues>({
    defaultValues: {
      tokenRecipients: [
        {
          walletAddress: '',
          tokens: new BN(0),
        },
      ],
    },
  });

  const { handleSubmit, reset } = formMethods;

  const handleTransferAsset = () => {
    setIsOpen(true);
  };

  const onSubmit: SubmitHandler<TransferAssetFormValues> = async (data) => {
    if (
      !currentWalletAccount ||
      !currentDao?.daoId ||
      !currentDaoFromChain?.daoAssetId
    ) {
      handleErrors(
        `Sorry we've run into some issues related to the multisig account`
      );
      return;
    }

    const recipients = data.tokenRecipients.map((recipient) => {
      return {
        walletAddress: recipient.walletAddress,
        tokens: recipient.tokens,
      };
    });

    const withRecipients = makeBatchTransferTxn(
      [],
      recipients,
      Number(currentDaoFromChain?.daoAssetId)
    );

    try {
      await sendBatchTxns(
        withRecipients,
        'Tokens Issued!',
        'Transaction failed',
        () => {
          reset();
          updateShowCongrats(true);
          setTimeout(() => {
            fetchDaoFromDB(currentDao.daoId as string);
          }, 3000);
        }
      );
    } catch (err) {
      handleErrors(err);
    }
  };

  return (
    <>
      <div className='flex justify-center'>
        <button
          className={`btn-primary btn w-[180px] ${
            txnProcessing ? 'loading' : ''
          }`}
          disabled={!currentWalletAccount}
          onClick={handleTransferAsset}>
          Transfer Asset
        </button>
      </div>
      <Modal
        open={isOpen}
        wrapClassName='a-modal-bg'
        className='a-modal'
        onCancel={() => {
          setIsOpen(false);
        }}
        footer={null}
        width={615}
        zIndex={99}>
        <FormProvider {...formMethods}>
          <div className='mb-6'>
            <h3 className='text-center text-primary'>{currentDao?.daoName}</h3>
            <div className='text-center text-xl'>
              Transfer tokens from your treasury to other accounts
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-5 flex w-full flex-col items-center justify-center gap-y-6 border-none hover:brightness-100'>
              <DistributeTokensForm />
            </div>
            <div className='mt-6 flex w-full justify-end'>
              <button
                className={`btn-primary btn mr-3 w-48 ${
                  !daoTokenBalance ? 'btn-disabled' : ''
                } ${txnProcessing ? 'loading' : ''}`}
                type='submit'>
                {`${txnProcessing ? 'Processing' : 'Approve and Sign'}`}
              </button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default TransferAsset;
