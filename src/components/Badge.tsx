export type BadgeVariant = 'none' | 'danger' | 'warning' | 'success';

const BadgeVariantStyleMap: Record<BadgeVariant, string> = {
  none: 'dark:bg-white dark:text-black',
  danger: 'dark:bg-red-800 dark:text-white',
  warning: 'dark:bg-orange-800 dark:text-black',
  success: 'dark:bg-green-300 dark:text-black',
};

const Badge = ({
  variant = 'none',
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      id='badge'
      className={`container rounded-2xl px-2 py-1 ${BadgeVariantStyleMap[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Badge;
