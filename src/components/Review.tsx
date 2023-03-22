import Image from 'next/image';
import Link from 'next/link';

import useGenesisStore from '@/stores/genesisStore';
import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import { truncateMiddle } from '@/utils';

const Review = (props: { daoId: string | null }) => {
  const daos = useGenesisStore((s) => s.daos);
  const dao = daos?.[props.daoId as string];
  const daoCreationValues = useGenesisStore((s) => s.daoCreationValues);
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);

  const displayCouncilMembers = () => {
    return daoCreationValues.councilMembers.map((member, index) => {
      return (
        <div
          className='mb-3 mt-1 flex justify-evenly'
          key={member.walletAddress}>
          <p className='mr-4 flex items-center justify-center'>{index + 1}</p>
          <div className='input mr-4 flex items-center justify-center border-[0.3px] border-neutral-focus bg-base-50/50'>
            {member.name}
          </div>
          <div className='input flex items-center justify-center border-[0.3px] border-neutral-focus bg-base-50/50'>
            {truncateMiddle(member.walletAddress)}
          </div>
        </div>
      );
    });
  };

  const handleBack = () => {
    updateCreateDaoSteps(4);
  };

  const handleNext = () => {
    updateCreateDaoSteps(6);
  };

  const displayTokenRecipients = () => {
    return daoCreationValues?.tokensRecipients?.map((recipient, index) => {
      return (
        <div
          key={recipient.walletAddress}
          className='mb-3 mt-1 flex justify-evenly'>
          <p className='mr-4 flex items-center justify-center'>{index + 1}</p>
          <div className='input mr-4 flex items-center justify-center border-[0.3px] border-neutral-focus bg-base-50/50'>
            {truncateMiddle(recipient.walletAddress)}
          </div>
          <div className='input mr-4 flex items-center justify-center border-[0.3px] border-neutral-focus bg-base-50/50'>
            {recipient.tokens.toLocaleString()}
          </div>
        </div>
      );
    });
  };

  return (
    <div className='flex flex-col items-center gap-y-5'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='90'
          max='100'></progress>
      </div>
      <div>
        <h2 className='text-center text-primary'>
          Review {dao?.daoName} Details
        </h2>
      </div>
      <div className='px-24'>
        <p className='text-center'>
          Please check all DAO details and configurations
        </p>
      </div>
      <div className='card mb-1 flex w-full flex-col items-center border-none py-5 px-20 hover:brightness-100'>
        <div className='flex w-full flex-col items-center'>
          <div className='dao-image mb-3 flex items-center justify-center'>
            <Image
              src={placeholderImage}
              alt='placeholder'
              height={140}
              width={140}
            />
            <div className='absolute'>
              <Image
                src={mountain}
                alt='mountain'
                width={60}
                height={34}></Image>
            </div>
          </div>
          <div className='mb-3 text-center'>
            <p className='text-sm text-neutral-focus'>DAO Name:</p>
            <h4>{daoCreationValues.daoName}</h4>
          </div>
          <div className='mb-3 text-center'>
            <p className='text-sm text-neutral-focus'>DAO ID:</p>
            <p>{daoCreationValues.daoId}</p>
          </div>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Email:</p>
          <p>{daoCreationValues.email}</p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Short Overview:</p>
          <p>{daoCreationValues.shortOverview}</p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Long Description</p>
          <p>{daoCreationValues.longDescription}</p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Governance Model</p>
          <p>Majority Vote</p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Proposal Token Cost</p>
          <p>
            {daoCreationValues.proposalTokensCost} {daoCreationValues.daoId}{' '}
            Tokens
          </p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Approval Threshold</p>
          <p>{daoCreationValues.approvalThreshold * 100} %</p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Proposal Duration</p>
          <p>{daoCreationValues.votingDays} Days</p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Council Members</p>
          {displayCouncilMembers()}
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>
            Council Signing Threshold
          </p>
          <p>
            <span className='text-primary'>
              {daoCreationValues.councilThreshold}
            </span>{' '}
            Signatures out of{' '}
            <span className='text-primary'>
              {daoCreationValues.councilMembers.length}{' '}
            </span>
            Council Member(s)
          </p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>
            Number of Tokens To Be Issued
          </p>
          <p>{daoCreationValues.tokensToIssue.toLocaleString()}</p>
        </div>
        <div className='mb-3 text-center'>
          <p className='text-sm text-neutral-focus'>Token Recipients</p>
          {displayTokenRecipients()}
        </div>
      </div>
      <div className=' flex w-full justify-end'>
        <button className='btn mr-3 w-48' onClick={handleBack} type='button'>
          Back
        </button>
        <Link href={`/dao/${encodeURIComponent(props.daoId as string)}`}>
          <button
            className='btn-primary btn'
            type='submit'
            onClick={handleNext}>
            Go To DAO Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Review;
