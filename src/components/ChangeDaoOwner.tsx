// import useGenesisDao from '@/hooks/useGenesisDao';
import { ErrorMessage } from '@hookform/error-message';
import { sortAddresses } from '@polkadot/util-crypto';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import { MultiSigsService } from '@/services/multiSigs';
import type { MultiSigTxnBody } from '@/services/multiSigTransactions';
import useGenesisStore from '@/stores/genesisStore';
import type { CouncilMember } from '@/types/council';
import type { AsMultiParameters } from '@/types/multiSigTransaction';
import { getMultisigAddress } from '@/utils';

import { CouncilMembersForm } from './CouncilMembersForm';

interface ChangeDaoOwnerFormValues {
  newCouncilMembers: CouncilMember[];
  councilThreshold: number;
}

const ChangeDaoOwner = () => {
  const { makeChangeOwnerTxn, makeMultiSigTxnAndSend, postMultiSigTxn } =
    useGenesisDao();
  const [
    currentWalletAccount,
    handleErrors,
    fetchDaoFromDB,
    daoTokenBalance,
    currentDao,
    updateTxnProcessing,
    createApiConnection,
    apiConnection,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.handleErrors,
    s.fetchDaoFromDB,
    s.daoTokenBalance,
    s.currentDao,
    s.updateTxnProcessing,
    s.createApiConnection,
    s.apiConnection,
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [threshold, setThreshold] = useState<number>();
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);

  const handleTransferDao = () => {
    setIsOpen(true);
  };

  const formMethods = useForm<ChangeDaoOwnerFormValues>({
    defaultValues: {
      councilThreshold: 2,
      newCouncilMembers: [
        {
          name: '',
          walletAddress: '',
        },
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
    if (!currentWalletAccount || !currentDao?.daoId) {
      return;
    }

    const transferToAddresses = data.newCouncilMembers.map((el) => {
      return el.walletAddress;
    });

    const addresses = transferToAddresses?.filter((address) => address.length);

    const multisigAddress = getMultisigAddress(
      addresses,
      data.councilThreshold
    );

    if (!currentDao.daoId || !multisigAddress) {
      handleErrors(
        `Sorry we've run into some issues related to the multisig account`
      );
      return;
    }
    if (!threshold) {
      handleErrors(`Error in getting multisig threshold`);
      return;
    }

    const withChangeOwner = makeChangeOwnerTxn(
      [],
      currentDao.daoId,
      multisigAddress
    );

    const tx = withChangeOwner.pop();
    if (!tx) {
      handleErrors('Error in making change ownership transaction');
      return;
    }
    const callHashInHex = tx.method.hash.toHex();
    const callDataInHex = tx.method.toHex();

    const otherSignatories = sortAddresses([
      ...currentDao.adminAddresses.filter((address) => {
        return address !== currentWalletAccount.address;
      }),
    ]);

    // if current multisig does not exist, create a new one
    try {
      const multiSig = await MultiSigsService.get(multisigAddress);
      if (!multiSig) {
        await MultiSigsService.create(addresses, data.councilThreshold);
      }
    } catch (err) {
      handleErrors(err);
      return;
    }

    try {
      const multiArgs: AsMultiParameters = {
        threshold,
        txnInHex: callDataInHex,
        otherSignatories,
      };
      makeMultiSigTxnAndSend(multiArgs, async () => {
        updateTxnProcessing(true);

        let timepoint = {};

        try {
          const multiSigInfo =
            await apiConnection?.query?.multisig?.multisigs?.(
              currentDao.daoOwnerAddress,
              tx.method.hash.toHex()
            );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((multiSigInfo as any).isSome) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            timepoint = (multiSigInfo as any).unwrap().when;
          }
        } catch (err) {
          handleErrors('Error in fetching multisig transaction info', err);
        }

        const body: MultiSigTxnBody = {
          hash: callHashInHex,
          module: 'DaoCore',
          function: 'change_owner',
          args: {
            daoId: currentDao.daoId,
            newOwner: multisigAddress,
          },
          data: callDataInHex,
          timepoint,
        };

        try {
          await postMultiSigTxn(currentDao.daoId, body);
          updateTxnProcessing(false);
          setIsOpen(false);
          fetchDaoFromDB(currentDao?.daoId);
          reset();
        } catch (err) {
          handleErrors('Error in creating multisig transaction off-chain');
        }
      });
    } catch (err) {
      handleErrors('Error in Changing Ownership', err);
      updateTxnProcessing(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const getThreshold = async () => {
      if (!currentDao) {
        return;
      }
      try {
        const multiSig = await MultiSigsService.get(
          currentDao?.daoOwnerAddress
        );
        if (multiSig) {
          setThreshold(multiSig?.threshold);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    getThreshold();
  }, [currentDao, handleErrors]);

  useEffect(() => {
    if (!apiConnection) {
      createApiConnection();
    }
    // eslint-disable-next-line
  }, []);

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
            <div className='mb-4 text-center text-xl'>
              Transfer Ownership To Another Multisignature Account
            </div>
            <div className='text-center text-xl'>
              Enter a minimum of 2 Council Members
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex w-full flex-col items-center gap-y-5 border-none hover:brightness-100'>
              <CouncilMembersForm
                formName='newCouncilMembers'
                disabled={txnProcessing}
              />
              <div>
                <h4 className='text-center text-xl'>
                  Enter Council Approval Threshold
                </h4>
                <p className='px-24 text-center'>
                  The approval threshold is a the minimum number of signatures
                  needed to approve a multi-signature transaction. The minimum
                  threshold is 2.
                </p>
              </div>
              <div className='w-[100px]'>
                <input
                  className='input input-primary text-center'
                  type='number'
                  placeholder='1'
                  disabled={txnProcessing}
                  {...register('councilThreshold', {
                    required: 'Required',
                    min: { value: 2, message: 'Minimum is 2' },
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
                disabled={txnProcessing}
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
