interface TooltipProps {
  placement: 'top' | 'left' | 'right' | 'bottom';
  content: string;
  children?: React.ReactNode;
}
const Tooltip = ({ content, placement, children }: TooltipProps) => {
  const getPlacementStyles = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2';
      case 'right':
        return 'top-1/2 left-full transform translate-y-1/2 -translate-x-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 translate-y-2';
      case 'left':
        return 'top-1/2 right-full transform translate-y-1/2 translate-x-2';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 translate-y-2';
    }
  };

  return (
    <div className='group relative inline-block'>
      <div className='group'>{children}</div>
      <div
        className={`absolute z-10 hidden w-full rounded-xl bg-base-50 px-2 py-1 text-sm text-white group-hover:block ${getPlacementStyles()}`}>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
