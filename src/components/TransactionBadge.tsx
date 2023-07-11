export const statusColors = {
  Active: 'bg-neutral text-base-100',
  Counting: 'bg-secondary text-base-100',
  Accepted: 'bg-accent text-base-100',
  Rejected: 'bg-error',
  Faulty: 'bg-error',
  undefined: 'bg-neutral text-base-100',
};

export const TransactionBadge = (props: { status?: string }) => {
  const { status } = props;
  return (
    <div
      className={`rounded-lg ${
        !status ? '' : statusColors[status as keyof typeof statusColors]
      } h-7 rounded-3xl px-3 text-center text-[0.625rem] leading-7`}>
      {status}
    </div>
  );
};
