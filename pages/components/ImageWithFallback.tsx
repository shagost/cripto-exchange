import React, { useState } from 'react';
import Image from 'next/image';

const ImageWithFallback = ({
  ...props
}: {
  src?: string;
  alt?: string;
  width: number;
  height: number;
}) => {
  const { alt, width, height } = props;
  const [src, setSrc] = useState(props.src);

  return (
    <Image
      {...props}
      src={
        !src?.startsWith('/') && !src?.startsWith('http')
          ? '/no-image.png'
          : src
      }
      alt={alt ?? ''}
      width={width}
      height={height}
      onError={() => setSrc('/no-image.png')}
    />
  );
};

export default ImageWithFallback;
