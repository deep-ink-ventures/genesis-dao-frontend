import Modal from 'antd/lib/modal';
import { v4 as uuidv4 } from 'uuid';

import useGenesisStore from '@/stores/genesisStore';

const FaultyReportsModal = (props: { proposalId: string }) => {
  const [isFaultyReportsOpen, updateIsFaultyReportsOpen, reports] =
    useGenesisStore((s) => [
      s.isFaultyReportsOpen,
      s.updateIsFaultyReportsOpen,
      s.currentProposalFaultyReports,
    ]);

  return (
    <Modal
      open={isFaultyReportsOpen}
      wrapClassName='a-modal-bg'
      className='a-modal'
      onCancel={() => {
        updateIsFaultyReportsOpen(false);
      }}
      footer={null}
      width={615}
      zIndex={99}>
      <div className='flex flex-col items-center justify-center p-4'>
        <div className='mb-4 text-2xl'>
          Faulty Reports for Proposal ID #{props.proposalId}
        </div>
        <div className='overflow-x-auto'>
          <table className='table w-full'>
            <thead>
              <tr>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {reports?.map((report) => {
                return (
                  <tr key={uuidv4()}>
                    <th>{report.reason}</th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default FaultyReportsModal;
