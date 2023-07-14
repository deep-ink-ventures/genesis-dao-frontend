import cn from 'classnames';
import Image from 'next/image';

import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';

interface DaoImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  image?: string;
  alt?: string;
}

const DaoImage = ({ image, alt, className, ...props }: DaoImageProps) => {
  if (!image) {
    return (
      <div className='relative flex items-center justify-center'>
        <Image
          src={placeholderImage}
          alt='placeholder'
          height={60}
          width={60}
        />
        <div className='absolute'>
          <Image src={mountain} alt='mountain' width={30} height={17}></Image>
        </div>
      </div>
    );
  }
  return (
    <div className='relative flex items-center justify-center'>
      <img
        {...props}
        src={image}
        alt={`${alt} logo image`}
        className={cn('rounded-full', className)}
      />
    </div>
  );
};

export default DaoImage;
