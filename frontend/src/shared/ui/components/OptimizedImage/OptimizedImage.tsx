import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = props => {
  return (
    <Image
      {...props}
      src={props.src || '/images/placeholder.jpg'}
      alt={props.alt}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
    />
  );
};
