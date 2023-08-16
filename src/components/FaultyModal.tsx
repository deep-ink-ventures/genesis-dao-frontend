import { ErrorMessage } from '@hookform/error-message';
import Modal from 'antd/lib/modal';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';

import useGenesisStore from '../stores/genesisStore';

interface FaultyDescription {
  description: string;
}

const FaultyModal = (props: { propId: string; daoId: string }) => {
  const [faultyReason, setFaultyReason] = useState('');
  const [isFaultyModalOpen, updateIsFaultyModalOpen, txnProcessing] =
    useGenesisStore((s) => [
      s.isFaultyModalOpen,
      s.updateIsFaultyModalOpen,
      s.txnProcessing,
    ]);

  const { reportFaultyProposal } = useGenesisDao();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FaultyDescription>({
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = async (data: FaultyDescription) => {
    reportFaultyProposal(props.daoId, props.propId, data.description);
  };

  const handleSelect = (e: any) => {
    setFaultyReason(e.target.innerText);
  };

  const handleSubmitReason = () => {
    reportFaultyProposal(props.daoId, props.propId, faultyReason);
  };

  return (
    <Modal
      open={isFaultyModalOpen}
      wrapClassName='a-modal-bg'
      className='a-modal'
      onCancel={() => {
        updateIsFaultyModalOpen(false);
      }}
      footer={null}
      width={615}
      zIndex={99}>
      <div className='flex flex-col items-center gap-y-4 px-12'>
        <h2 className='text-3xl font-semibold text-primary'>
          Report as Faulty
        </h2>
        <div className='text-center text-lg'>
          {`You are reporting proposal ID #${props.propId} as faulty.`}
        </div>
        <div className='text-center text-lg'>Please select a reason</div>
        <div>
          <div className='w-[410px]'>
            <div
              className={`mb-3 flex h-[35px] items-center justify-center  rounded-xl bg-base-50 text-center text-lg hover:cursor-pointer hover:brightness-105 ${
                faultyReason.includes('Feasibility')
                  ? 'border-black bg-secondary text-black'
                  : 'border-neutral-focus bg-base-50'
              }`}
              onClick={handleSelect}>
              Lack of Feasibility
            </div>
            <div
              className={`mb-3 flex h-[35px] items-center justify-center  rounded-xl bg-base-50 text-center text-lg hover:cursor-pointer hover:brightness-105 ${
                faultyReason.includes('Violation')
                  ? 'border-black bg-secondary text-black'
                  : 'border-neutral-focus bg-base-50'
              }`}
              onClick={handleSelect}>
              Violation of Rules/Inappropriate
            </div>
            <div
              className={`mb-3 flex h-[35px] items-center justify-center  rounded-xl bg-base-50 text-center text-lg hover:cursor-pointer hover:brightness-105 ${
                faultyReason.includes('Clarity')
                  ? 'border-black bg-secondary text-black'
                  : 'border-neutral-focus bg-base-50'
              }`}
              onClick={handleSelect}>
              Lack of Clarity
            </div>
            <div
              className={`mb-3 flex h-[35px] items-center justify-center  rounded-xl bg-base-50 text-center text-lg hover:cursor-pointer hover:brightness-105 ${
                faultyReason.includes('Other')
                  ? 'border-black bg-secondary text-black'
                  : 'border-neutral-focus bg-base-50'
              }`}
              onClick={handleSelect}>
              Other
            </div>
          </div>
          {!faultyReason.includes('Other') ? (
            <div className='mt-4 flex justify-center'>
              <button
                className={`btn btn-primary w-[400px] ${
                  txnProcessing ? 'loading' : ''
                }`}
                onClick={handleSubmitReason}>
                Submit
              </button>
            </div>
          ) : null}
          {faultyReason.includes('Other') ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4 min-w-full'>
                <p className='mb-1 ml-2'>
                  Description (1000 characters max){' '}
                  <span className='text-lg font-medium text-red-600'>*</span>
                </p>
                <textarea
                  className='textarea h-48 w-[400px]'
                  {...register('description', {
                    required: 'Required',
                    min: { value: 1, message: 'Too short' },
                    maxLength: {
                      value: 1000,
                      message: 'Max character count is 1000',
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name='description'
                  render={({ message }) => (
                    <p className='ml-2 mt-1 text-error'>{message}</p>
                  )}
                />
              </div>
              <div>
                <button
                  className={`btn btn-primary w-[400px] ${
                    txnProcessing ? 'loading' : ''
                  }`}>
                  Submit
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default FaultyModal;
