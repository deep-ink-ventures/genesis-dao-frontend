const StatusCard = ({
  header,
  value,
  footer,
}: {
  header?: React.ReactNode;
  value?: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <div className='container flex w-full flex-col items-center justify-center py-6'>
      <span className='text-sm font-bold uppercase'>{header}</span>
      <span className='text-4xl font-semibold'>{value}</span>
      <div className='flex gap-1 text-sm'>{footer}</div>
    </div>
  );
};

export default StatusCard;
