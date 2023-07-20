const ThumbsUp = ({
  fill = 'none',
  stroke = '#FAFAFA',
  width = 16,
  height = 16,
  className,
}: {
  fill?: string;
  stroke?: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 19 20'
      fill={fill}
      xmlns='http://www.w3.org/2000/svg'>
      <path
        className='vote-up'
        d='M5.83341 18.3332V9.1665M1.66675 10.8332V16.6665C1.66675 17.587 2.41294 18.3332 3.33341 18.3332H14.522C15.7559 18.3332 16.8053 17.4329 16.9929 16.2133L17.8903 10.38C18.1233 8.86558 16.9516 7.49984 15.4194 7.49984H12.5001C12.0398 7.49984 11.6667 7.12674 11.6667 6.6665V3.72137C11.6667 2.5865 10.7468 1.6665 9.61188 1.6665C9.3412 1.6665 9.0959 1.82592 8.98596 2.07327L6.05336 8.67162C5.91961 8.97256 5.62118 9.1665 5.29185 9.1665H3.33341C2.41294 9.1665 1.66675 9.9127 1.66675 10.8332Z'
        stroke={stroke}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default ThumbsUp;
