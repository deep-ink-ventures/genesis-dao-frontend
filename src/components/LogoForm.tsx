import { ErrorMessage } from '@hookform/error-message';
import { stringToHex } from '@polkadot/util';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import type { LogoFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import upload from '@/svg/upload.svg';
import { hexToBase64, readFileAsB64 } from '@/utils';

const LogoForm = (props: { daoId: string | null }) => {
  const currentDao = useGenesisStore((s) => s.currentDao);
  const [daoLogo, setDaoLogo] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LogoFormValues>({
    defaultValues: {
      email: '',
      shortOverview: 'N/A',
      longDescription: 'N/A',
      imageString: '',
    },
  });
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  // const currentDao = useGenesisStore((s) => s.currentDao);
  // const currentDaoFromChain = useGenesisStore((s) => s.currentDaoFromChain);

  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const fetchDao = useGenesisStore((s) => s.fetchDao);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const { makeSetMetadataTxn, sendBatchTxns } = useGenesisDao();

  const onSubmit = async (data: LogoFormValues) => {
    if (!data.logoImage[0] || !props.daoId) {
      return;
    }
    const jsonData = JSON.stringify({
      email: data.email,
      description_short: data.shortOverview,
      description_long: data.longDescription,
      logo: data.imageString,
    });

    try {
      const challengeRes = await fetch(
        `https://service.genesis-dao.org/daos/${props.daoId}/challenge/`
      );
      const challengeString = await challengeRes.json();
      if (!challengeString.challenge) {
        handleErrors('Not able to validate ownership');
        return;
      }
      const signerResult = await currentWalletAccount?.signer?.signRaw?.({
        address: currentWalletAccount.address,
        data: stringToHex(challengeString.challenge),
        type: 'bytes',
      });

      if (!signerResult) {
        handleErrors('Not able to validate ownership');
        return;
      }

      const base64Signature = hexToBase64(signerResult.signature.substring(2));

      const metadataResponse = await fetch(
        `https://service.genesis-dao.org/daos/${props.daoId}/metadata/`,
        {
          method: 'POST',
          body: jsonData,
          headers: {
            'Content-Type': 'application/json',
            Signature: base64Signature,
          },
        }
      );

      const metadata = await metadataResponse.json();
      if (!metadata.metadata_url) {
        return;
      }
      const txns = makeSetMetadataTxn(
        [],
        props.daoId,
        metadata.metadata_url,
        metadata.metadata_hash
      );
      await sendBatchTxns(
        txns,
        'Set metadata successfully',
        'Transaction failed',
        () => {
          if (props.daoId) {
            fetchDao(props.daoId as string);
            fetchDaoFromDB(props.daoId as string);
            reset();
          }
        }
      );
    } catch (err) {
      handleErrors(err);
    }
  };

  const imageFile = watch('logoImage');

  useEffect(() => {
    fetchDao(props.daoId as string);
    fetchDaoFromDB(props.daoId as string);
  }, [fetchDao, fetchDaoFromDB, txnProcessing, props.daoId]);

  useEffect(() => {
    if (daoLogo) {
      readFileAsB64(daoLogo)
        .then((data) => {
          setValue('imageString', data as string);
        })
        .catch((error) => {
          handleErrors(error);
        });
    }
  });

  return (
    <div className='flex flex-col items-center gap-y-6 px-12'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='25'
          max='100'></progress>
      </div>
      <div className='text-center'>
        <h2 className='text-primary' data-testid='daoName'>
          {currentDao?.daoName} Logo And DAO Details
        </h2>
        <p className='px-24'>
          {`Add a logo and describe in a short way what your DAO is all about.
            If you don't have a logo yet, just skip that and come back to it once 
            the DAO is set-up.`}
        </p>
      </div>
      <div className='flex w-full items-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='min-w-full'>
          <div className='mb-8 flex flex-col items-center gap-y-8'>
            <div className='min-w-full'>
              <p className='mb-1 ml-1'>Email</p>
              <input
                className='input-primary input'
                type='text'
                placeholder='Email'
                {...register('email', {
                  required: 'Required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Entered value does not match email format',
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name='email'
                render={({ message }) => (
                  <p className='mt-1 ml-2 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='min-w-full flex-col'>
              <p className='mb-1 ml-1'>
                Upload Logo File (JPEG or PNG. Max 2MB)
              </p>
              <div className='file-drop relative h-48'>
                <input
                  className='absolute z-10 h-full w-full cursor-pointer opacity-0'
                  type='file'
                  accept='image/*'
                  id='file'
                  {...register('logoImage', {
                    required: 'Required',
                    validate: {
                      fileSize: (data) => {
                        const validSize =
                          data[0] && data[0].size <= 2 * 1024 * 1024;
                        if (validSize) {
                          return true;
                        }
                        return 'The file is too big';
                      },
                      fileType: (data) => {
                        const type = data[0] && data[0].type;
                        if (
                          type === ('image/jpeg' || 'image/jpg' || 'image/png')
                        ) {
                          return true;
                        }
                        return 'Only JPEG(JPG) or PNG please';
                      },
                    },
                    onChange: (e) => {
                      setDaoLogo(e.target.files[0]);
                    },
                  })}
                />
                <div className='flex items-center justify-evenly'>
                  <div className='h-[124px] w-[124px] rounded-[8px] border-[1px] border-dashed'>
                    {imageFile?.[0] && (
                      <Image
                        src={URL.createObjectURL(imageFile[0])}
                        height={124}
                        width={124}
                        alt='logo photo'></Image>
                    )}
                  </div>
                  <div className='flex flex-col py-6 text-center opacity-80'>
                    <Image
                      className='mx-auto mb-2'
                      src={upload}
                      width={45}
                      height={32}
                      alt='upload'
                    />
                    <p>Drop your image or browse</p>
                    <p className='text-sm'>{`Image size: Recommended 124px x 124px`}</p>
                    <p className='text-sm'>{`File format: .jpg or .png`}</p>
                    <p className='text-sm'>{`File size: max 2 mb`}</p>
                  </div>
                </div>
              </div>
              <ErrorMessage
                errors={errors}
                name='logoImage'
                render={({ message }) => (
                  <p className='mt-1 ml-2 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='min-w-full'>
              <p className='mb-1 ml-1'>
                Short Overview (250 characters or less)
              </p>
              <textarea
                className='textarea h-48'
                {...register('shortOverview', {
                  required: 'Required',
                  min: { value: 1, message: 'Too short' },
                  max: { value: 250, message: 'Max character count is 250' },
                })}
              />
              <ErrorMessage
                errors={errors}
                name='shortOverview'
                render={({ message }) => (
                  <p className='mt-1 ml-2 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='min-w-full'>
              <p className='mb-1 ml-2'>
                Long Description (2000 characters or less)
              </p>
              <textarea
                className='textarea h-64'
                {...register('longDescription', {
                  required: 'Required',
                  min: { value: 1, message: 'Minimum character count is 1' },
                  max: { value: 2000, message: 'Max character count is 2000' },
                })}
              />
              <ErrorMessage
                errors={errors}
                name='longDescription'
                render={({ message }) => (
                  <p className='mt-1 ml-2 text-error'>{message}</p>
                )}
              />
            </div>
          </div>
          <div className='flex justify-end'>
            <button
              className={`btn-primary btn mr-3 w-48 ${
                txnProcessing ? 'loading' : ''
              }`}
              type='submit'>
              {`${txnProcessing ? 'Processing' : 'Upload and Sign'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogoForm;
