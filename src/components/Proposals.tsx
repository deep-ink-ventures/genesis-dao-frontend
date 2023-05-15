import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// import useGenesisStore from '@/stores/genesisStore';
import Spinner from '@/components/Spinner';
import useGenesisStore from '@/stores/genesisStore';
import plusBlack from '@/svg/plus-black.svg';

import ProposalCard from './ProposalCard';

const Proposals = (props: { daoId: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [
    currentProposals,
    fetchProposalsFromDB,
    currentBlockNumber,
    updateBlockNumber,
  ] = useGenesisStore((s) => [
    s.currentProposals,
    s.fetchProposalsFromDB,
    s.currentBlockNumber,
    s.updateBlockNumber,
  ]);
  const filteredProposals = currentProposals?.filter((prop) => {
    return (
      prop.proposalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.proposalName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const displayProposal = () => {
    if (!filteredProposals || filteredProposals?.length === 0) {
      return <div>Sorry no proposals found</div>;
    }
    return (
      <div className='flex flex-col gap-y-4'>
        {filteredProposals.map((prop) => {
          return (
            <Link
              href={`/dao/${encodeURIComponent(
                prop.daoId
              )}/proposal/${encodeURIComponent(prop.proposalId)}`}
              key={prop.proposalId}>
              <ProposalCard p={prop} />
            </Link>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (!props.daoId) {
      return;
    }

    const timer = setTimeout(() => {
      fetchProposalsFromDB(props.daoId);
    }, 500);
    // eslint-disable-next-line
    return () => clearTimeout(timer);
  }, [props.daoId, fetchProposalsFromDB]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (!currentBlockNumber) {
      return;
    }
    const timeout = setTimeout(() => {
      updateBlockNumber(currentBlockNumber + 1);
    }, 6000);
    // eslint-disable-next-line
    return () => clearTimeout(timeout);
  }, [currentBlockNumber, updateBlockNumber]);

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <h1 className='text-2xl'>Proposals</h1>
        </div>
        <div className='flex gap-x-4'>
          <div>
            <input
              id='search-input'
              className='input-primary input w-72 text-sm'
              placeholder='Search Proposals'
              onChange={handleSearch}
            />
          </div>
          {/* <div className='flex items-center justify-center'>
            <div className='flex h-12 min-w-[76px] items-center justify-center rounded-full border'>
              <p>All</p>
              <Image
                src={downArrow}
                height={15}
                width={12}
                alt='down-arrow'
                className='ml-2'
              />
            </div>
          </div> */}
          <div>
            <Link
              href={`/dao/${encodeURIComponent(props.daoId)}/create-proposal`}>
              <button className='btn-primary btn flex items-center gap-x-1'>
                <Image src={plusBlack} height={16} width={16} alt='plus' />
                <p className='flex items-center pt-[1px]'>New Proposal</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        {!currentProposals ? (
          <div className='mt-10'>
            <Spinner />
          </div>
        ) : (
          displayProposal()
        )}
      </div>
    </div>
  );
};

export default Proposals;
