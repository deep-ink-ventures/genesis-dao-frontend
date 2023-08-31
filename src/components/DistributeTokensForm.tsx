import { ErrorMessage } from '@hookform/error-message';
import { BN } from '@polkadot/util';
import Image from 'next/image';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { DAO_UNITS } from '@/config';
import useGenesisStore from '@/stores/genesisStore';
import d from '@/svg/delete.svg';
import plus from '@/svg/plus.svg';
import type { TokenRecipient } from '@/types/council';
import { isValidPolkadotAddress, uiTokens } from '@/utils';

export const DistributeTokensForm = ({
  multiple = true,
  isNew,
}: {
  multiple?: boolean;
  isNew?: boolean;
}) => {
  const {
    watch,
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const {
    fields: tokenRecipientsFields,
    append: tokenRecipientsAppend,
    remove: tokenRecipientsRemove,
  } = useFieldArray({
    control,
    name: 'tokenRecipients',
  });

  const tokensValues = watch('tokenRecipients');
  const [daoTokenTreasuryBalance, daoTokenBalance, currentDao] =
    useGenesisStore((s) => [
      s.daoTokenTreasuryBalance,
      s.daoTokenBalance,
      s.currentDao,
    ]);

  const getTotalRecipientsTokens = (recipients: TokenRecipient[]) => {
    let total = new BN(0);
    if (!recipients) {
      return new BN(0);
    }
    // eslint-disable-next-line
    for (const item of recipients) {
      total = total.add(item.tokens);
    }
    // multiply by DAO units to get the right tokens
    return total;
  };

  const daoBalance = isNew ? daoTokenBalance : daoTokenTreasuryBalance;

  const remain = daoBalance
    ? daoBalance.sub(getTotalRecipientsTokens(tokensValues))
    : new BN(0);

  const handleAddRecipient = () => {
    tokenRecipientsAppend({
      walletAddress: '',
      tokens: new BN(0),
    });
  };

  const recipientsFields = () => {
    if (!daoBalance) {
      return <div className='text-center'>Please issue tokens first</div>;
    }
    return tokenRecipientsFields.map((item, index) => {
      return (
        <div className='flex' key={item.id} data-k={item.id}>
          <div className='flex'>
            <div className='w-[370px] flex-col'>
              <p className='pl-8'>Wallet Address</p>
              <div className='flex'>
                {multiple && (
                  <div className='mr-4 flex flex-col justify-center'>
                    {index + 1}
                  </div>
                )}
                <input
                  type='text'
                  placeholder='Wallet Address'
                  className='input input-primary'
                  {...register(`tokenRecipients.${index}.walletAddress`, {
                    required: 'Required',
                    validate: (add) =>
                      isValidPolkadotAddress(add) === true ||
                      'Not a valid address',
                  })}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name={`tokenRecipients.${index}.walletAddress`}
                render={({ message }) => (
                  <p className='mt-1 pl-8 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='mx-3 flex flex-col'>
              <p className='ml-1'>Number of Tokens</p>
              <input
                type='number'
                className='input input-primary text-center'
                {...register(`tokenRecipients.${index}.tokens`, {
                  required: 'Required',
                  min: { value: 1, message: 'Minimum is 1' },
                  validate: { onRemainingTokens: () => remain.gte(new BN(0)) },
                  setValueAs: (tokens) => {
                    const bnTokens = new BN(tokens);
                    return bnTokens.mul(new BN(DAO_UNITS));
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name={`tokenRecipients.${index}.tokens`}
                render={({ message }) => (
                  <p className='ml-2 mt-1 text-error'>{message}</p>
                )}
                // {errors?.tokenRecipients?.[index]?.tokens && <p>error</p>}
              />
            </div>
            {/*
            <div className='flex w-[65px] items-center justify-center pt-5'>
              {watch(`tokenRecipients.${index}.tokens`)
                    .div(daoTokenBalance)
                    .mul(new BN(100))
                    .gte(new BN(100))
                    ? 'NaN'
                    : watch(`tokenRecipients.${index}.tokens`)
                        ?.div(daoTokenBalance)
                        .mul(new BN(100))
                        .toString()}{' '}
                  %
            </div>
             */}
          </div>
          {multiple && (
            <div className='ml-3 flex items-center pt-5'>
              <Image
                className='duration-150 hover:cursor-pointer hover:brightness-125 active:brightness-90'
                src={d}
                width={18}
                height={18}
                alt='delete button'
                onClick={() => {
                  tokenRecipientsRemove(index);
                }}
              />
            </div>
          )}
        </div>
      );
    });
  };
  return (
    <>
      <div className='flex flex-col gap-y-4'>
        <div className='w-full text-center'>
          <h4 className='text-center'>Add DAO Token Recipients</h4>
          <p className='text-sm'>Distribute Tokens To Other Wallet Addresses</p>
        </div>
        {recipientsFields()}
      </div>
      <div>
        {daoBalance && multiple ? (
          <button
            className='btn border-white bg-[#403945] text-white hover:bg-[#403945] hover:brightness-110'
            type='button'
            onClick={handleAddRecipient}>
            <Image
              src={plus}
              width={17}
              height={17}
              alt='add one'
              className='mr-2'
            />
            Add a Recipient
          </button>
        ) : null}
      </div>
      <div>
        <div className='w-full text-center'>
          <h4 className='mb-2 text-center'>Treasury</h4>
        </div>
        <div className='flex flex-col justify-center px-10 text-center'>
          <p>Distribute the remaining</p>
          <p>
            <span className='mx-3 w-[70px] text-center text-primary'>
              {uiTokens(remain, 'dao', currentDao?.daoId)}
              {' Tokens'}
            </span>
          </p>
          <p> to multi-signature account controlled by council members</p>
        </div>
      </div>
    </>
  );
};
