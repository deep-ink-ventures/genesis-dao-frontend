// import useGenesisDao from '@/hooks/useGenesisDao';
import { ErrorMessage } from '@hookform/error-message';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import { MultiSigsService } from '@/services/multiSigs';
import useGenesisStore from '@/stores/genesisStore';
import type { CouncilMember } from '@/types/council';
import { getMultisigAddress } from '@/utils';

import { CouncilMembersForm } from './CouncilMembersForm';

interface ChangeDaoOwnerFormValues {
  newCouncilMembers: CouncilMember[];
  councilThreshold: number;
}

const ChangeDaoOwner = () => {
  const { makeChangeOwnerTxn, sendBatchTxns } = useGenesisDao();
  const [
    currentWalletAccount,
    currentDaoFromChain,
    handleErrors,
    updateShowCongrats,
    fetchDaoFromDB,
    daoTokenBalance,
    currentDao,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.currentDaoFromChain,
    s.handleErrors,
    s.updateShowCongrats,
    s.fetchDaoFromDB,
    s.daoTokenBalance,
    s.currentDao,
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);

  const handleTransferDao = () => {
    setIsOpen(true);
  };

  const formMethods = useForm<ChangeDaoOwnerFormValues>({
    defaultValues: {
      councilThreshold: 1,
      newCouncilMembers: [
        {
          name: '',
          walletAddress: '',
        },
      ],
    },
  });

  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods;

  const newCouncilMembers = watch('newCouncilMembers');

  const onSubmit: SubmitHandler<ChangeDaoOwnerFormValues> = async (data) => {
    const transferToAddresses = data.newCouncilMembers.map((el) => {
      return el.walletAddress;
    });

    let noMultisig = false;
    const addresses = transferToAddresses?.filter((address) => address.length);

    if (addresses.length < 1) {
      noMultisig = true;
    }

    const multisigAddress = getMultisigAddress(
      addresses,
      data.councilThreshold
    );

    if (
      !currentDao?.daoCreatorAddress ||
      !currentDao.daoId ||
      !currentDaoFromChain?.daoAssetId ||
      !multisigAddress
    ) {
      handleErrors(
        `Sorry we've run into some issues related to the multisig account`
      );
      return;
    }

    const withChangeOwner = makeChangeOwnerTxn(
      [],
      currentDao.daoId,
      noMultisig ? currentDao.daoCreatorAddress : multisigAddress
    );

    try {
      await MultiSigsService.create(addresses, data.councilThreshold);
      await sendBatchTxns(
        withChangeOwner,
        'Tokens Issued and Transferred DAO Ownership!',
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
          className={`btn btn-primary w-[180px] ${
            txnProcessing ? 'loading' : ''
          }`}
          disabled={!currentWalletAccount}
          onClick={handleTransferDao}>
          Change Owner
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
              Transfer Ownership to another multisig account
            </div>
            <div className='text-center text-xl'>
              Enter minimum of 2 addresses of the council members
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex w-full flex-col items-center gap-y-5 border-none hover:brightness-100'>
              <CouncilMembersForm formName='newCouncilMembers' />
              <div>
                <h4 className='text-center'>
                  Enter Council Approval Threshold
                </h4>
                <p className='px-24 text-center text-sm'>
                  The approval threshold is a defined level of consensus that
                  must be reached in order for proposals to be approved and
                  implemented
                </p>
              </div>
              <div className='w-[100px]'>
                <input
                  className='input input-primary text-center'
                  type='number'
                  placeholder='1'
                  {...register('councilThreshold', {
                    required: 'Required',
                    min: { value: 1, message: 'Minimum is 1' },
                    max: {
                      value: newCouncilMembers.length,
                      message: 'Cannot exceed # of council members',
                    },
                  })}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name='councilThreshold'
                render={({ message }) => (
                  <p className='ml-2 mt-1 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='mt-6 flex w-full justify-end'>
              <button
                className={cn(
                  `btn btn-primary mr-3 w-48 ${txnProcessing ? 'loading' : ''}`,
                  {
                    'btn-disabled':
                      !daoTokenBalance || newCouncilMembers.length < 2,
                    loading: txnProcessing,
                  }
                )}
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

export default ChangeDaoOwner;
