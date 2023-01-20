import { ErrorMessage } from '@hookform/error-message';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { ISubmittableResult } from '@polkadot/types/types';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { CreateDaoData } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

const CreateDaoForm = () => {
  const createDaoData = useGenesisStore((s) => s.createDaoData);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const updateCreateDaoData = useGenesisStore((s) => s.updateCreateDaoData);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateDaoData>();

  const onSubmit: SubmitHandler<CreateDaoData> = (data: CreateDaoData) => {
    updateCreateDaoData(data);
  };

  const connect = async () => {
    const wsProvider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({ provider: wsProvider });
    await api.isReady;
    if (
      typeof api.tx.daoCore !== 'undefined' &&
      currentWalletAccount !== undefined &&
      currentWalletAccount.signer
    ) {
      try {
        api.setSigner(currentWalletAccount.signer);
        const createDaoExtrinsic = api?.tx?.daoCore?.createDao?.(
          createDaoData?.daoId,
          createDaoData?.daoName
        );
        await createDaoExtrinsic?.signAndSend(
          currentWalletAccount.address,
          { signer: currentWalletAccount.signer },
          (result: ISubmittableResult) => {
            console.log('Transaction status:', result.status.type);

            if (result.status.isInBlock) {
              console.log(
                'Included at block hash',
                result.status.asInBlock.toHex()
              );
              console.log('Events:');

              result.events.forEach(
                ({ event: { data, method, section }, phase }) => {
                  console.log(
                    '\t',
                    phase.toString(),
                    `: ${section}.${method}`,
                    data.toString()
                  );
                }
              );
            } else if (result.status.isFinalized) {
              console.log(
                'Finalized block hash',
                result.status.asFinalized.toHex()
              );
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const transfer = async () => {
    const wsProvider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({ provider: wsProvider });
    await api.isReady;
    if (
      typeof api.tx.daoCore !== 'undefined' &&
      currentWalletAccount !== undefined &&
      currentWalletAccount.signer
    ) {
      try {
        api.setSigner(currentWalletAccount.signer);
        const transferExtrinsic = api?.tx?.balances?.transfer?.(
          '5GpGweMfmUe8rV5ScXJgfhEAVU3Aom4yVF2YH9pscNQGzZgw',
          4000000000000
        );
        await transferExtrinsic?.signAndSend(
          currentWalletAccount.address,
          { signer: currentWalletAccount.signer },
          (result) => {
            console.log('transfer result', result.toHuman());
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    console.log('form errors', errors);
    if (isSubmitSuccessful) {
      reset(
        {
          daoId: '',
          daoName: '',
        },
        { keepErrors: true }
      );
    }

    console.log('gensis store create dao data', createDaoData);
  }, [createDaoData, isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <input
          type='text'
          className='input-bordered input-primary input'
          placeholder='DAO ID'
          {...register('daoId', {
            required: 'required',
            minLength: 3,
            maxLength: 22,
          })}
        />
        <ErrorMessage
          errors={errors}
          name='daoId'
          render={({ message }) => <p>{message}</p>}
        />
      </div>
      <div className='mb-3'>
        <input
          type='text'
          className='input-bordered input-primary input'
          placeholder='DAO NAME'
          {...register('daoName', {
            required: 'required',
            minLength: 3,
            maxLength: 22,
          })}
        />
        <ErrorMessage
          errors={errors}
          name='daoName'
          render={({ message }) => <p>{message}</p>}
        />
      </div>

      <div className='mb-3'>
        <button type='submit' className='btn-primary btn'>
          Create a DAO
        </button>
      </div>
      <button className='btn-primary btn' onClick={connect}>
        connect
      </button>
      <button className='btn-primary btn' onClick={transfer}>
        transfer
      </button>
    </form>
  );
};

export default CreateDaoForm;
