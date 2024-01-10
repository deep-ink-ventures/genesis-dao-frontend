// import useGenesisDao from '@/hooks/useGenesisDao';
import { ErrorMessage } from '@hookform/error-message';
import { ContractPromise } from '@polkadot/api-contract';
import { BN, BN_ONE } from '@polkadot/util';
import Modal from 'antd/lib/modal';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';
import { TxnResponse } from '@/types/response';
import { isValidPolkadotAddress, uiTokens } from '@/utils';

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);
const STORAGE_DEPOSIT_LIMIT = null;

interface CreateVestingWalletFormValues {
  account?: string;
  vestingTime?: number;
  amount?: number;
}

const CreateVestingWallet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formMethods = useForm<CreateVestingWalletFormValues>();
  // const [hasExtension, setHasExtension] = useState(false);
  // const [contract, setContract] = useState<ContractPromise | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = formMethods;

  const [
    currentWalletAccount,
    daoTokenTreasuryBalance,
    currentDao,
    apiConnection,
    createApiConnection,
    addTxnNotification,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.daoTokenTreasuryBalance,
    s.currentDao,
    s.apiConnection,
    s.createApiConnection,
    s.addTxnNotification,
  ]);

  const handleEnablePlugin = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const getContract = async (
    vestingWalletContractAddress: string,
    abiPath: string
  ) => {
    if (!apiConnection || !vestingWalletContractAddress) return null;

    const metadataResponse = await fetch(abiPath);
    const metadata = await metadataResponse.json();

    const contract = new ContractPromise(
      apiConnection,
      metadata,
      vestingWalletContractAddress
    );

    return contract;
  };

  const queryGetTotal = async (contract: ContractPromise | null) => {
    if (!currentWalletAccount || !contract) return false;

    try {
      if (contract?.query?.getTotal) {
        const totalTokens = await contract.query.getTotal(
          currentWalletAccount.address,
          {
            gasLimit: apiConnection?.registry.createType('WeightV2', {
              refTime: MAX_CALL_WEIGHT,
              proofSize: PROOFSIZE,
              storageDepositLimit: STORAGE_DEPOSIT_LIMIT,
            }) as any,
          },
          currentWalletAccount.address
        );

        return (
          totalTokens.result.isOk &&
          totalTokens.output?.toHex() &&
          (totalTokens.output.toHex() as any) > 0
        );
      }

      return false;
    } catch (ex) {
      return false;
    }
  };

  const createVestingWallet = async (
    contract: ContractPromise | null,
    amount?: number,
    duration?: number
  ) => {
    if (
      !contract?.tx?.createVestingWalletFor ||
      !currentWalletAccount?.address ||
      !apiConnection
    )
      return;

    // @ts-ignore
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { gasRequired } = await contract?.query?.createVestingWalletFor(
      currentWalletAccount.address,
      {
        storageDepositLimit: null,
        gasLimit: apiConnection.registry.createType('WeightV2', {
          refTime: MAX_CALL_WEIGHT,
          proofSize: PROOFSIZE,
        }) as any,
      },
      currentWalletAccount.address,
      1,
      duration
    );

    await contract.tx
      .createVestingWalletFor(
        {
          value: amount,
          gasLimit: gasRequired,
        },
        currentWalletAccount.address,
        amount,
        duration
      )
      .signAndSend(
        currentWalletAccount.address,
        { signer: currentWalletAccount.signer },
        (result) => {
          if (result.status.isInBlock || result.status.isFinalized) {
            addTxnNotification({
              type: TxnResponse.Success,
              title: `${TxnResponse.Success}`,
              message: 'Vesting Wallet Created',
              txnHash: result.status.asInBlock.toHex(),
              timestamp: Date.now(),
            });
          }
        }
      );
  };

  const onSubmit: SubmitHandler<CreateVestingWalletFormValues> = async (
    data
  ) => {
    setLoading(true);

    const inkVestingWalletContractAddress =
      currentDao?.inkVestingWalletContract;

    try {
      if (!inkVestingWalletContractAddress) {
        throw new Error('Missing Vesting Wallet Contract Address');
      }

      if (!currentDao?.inkAssetContract) {
        throw new Error('Missing DAO Asset Contract Address');
      }

      const contract = await getContract(
        inkVestingWalletContractAddress,
        '/contracts/vesting_wallet_contract.json'
      );

      const assetContract = await getContract(
        currentDao.inkAssetContract,
        '/contracts/dao_asset_contract.json'
      );

      const hasVestingWallet = await queryGetTotal(contract);

      if (hasVestingWallet) {
        addTxnNotification({
          title: `${TxnResponse.Error}`,
          message: `Vesting Wallet already exists`,
          type: TxnResponse.Error,
          timestamp: Date.now(),
        });
        setLoading(false);
        return;
      }

      if (!apiConnection || !currentWalletAccount) {
        setLoading(false);
        return;
      }

      if (assetContract?.tx?.['psp22::approve']) {
        await assetContract?.tx?.['psp22::approve'](
          {
            value: data.amount,
            gasLimit: 100000n * 1000000n,
          },
          inkVestingWalletContractAddress,
          data.amount
        ).signAndSend(
          currentWalletAccount.address,
          {
            signer: currentWalletAccount.signer,
          },
          async (result) => {
            if (result.status.isInBlock || result.status.isFinalized) {
              await createVestingWallet(
                contract,
                data.amount,
                data.vestingTime
              );
              onClose();
            }
          }
        );
      }
      setLoading(false);
    } catch (ex) {
      addTxnNotification({
        title: `${TxnResponse.Error}`,
        message: `${ex}`,
        type: TxnResponse.Error,
        timestamp: Date.now(),
      });
      setLoading(false);
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

  useEffect(() => {
    if (!apiConnection) {
      createApiConnection();
    }
    // eslint-disable-next-line
  }, [apiConnection]);

  return (
    <>
      <div className='flex justify-center'>
        <button
          className={`btn btn-primary w-[180px] ${loading ? 'loading' : ''}`}
          disabled={
            !currentWalletAccount || !currentDao?.inkVestingWalletContract
          }
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
