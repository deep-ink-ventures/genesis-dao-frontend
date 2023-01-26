import Spinner from '@/components/Spinner';
import useGenesisStore from '@/stores/genesisStore';
// we wil use this later

const LoadingModal = () => {
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);

  if (!txnProcessing) {
    return null;
  }

  return (
    <div
      className='relative z-10'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'>
      <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

      <div className='fixed inset-0 z-10 overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <div className='min-h-100px] flex min-w-[100px] justify-center rounded-2xl border border-slate-200 bg-slate-700 align-middle'>
            <div className='my-3'>
              <div className='mx-4 mb-2'>Loading</div>
              <Spinner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
