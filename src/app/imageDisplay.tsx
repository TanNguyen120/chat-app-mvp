'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ImageDisplayProps {
  src: string;
  alt?: string;
}

export function ImageDisplay({ src, alt = 'Chat image' }: ImageDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className='relative group cursor-zoom-in rounded-xl overflow-hidden border border-[#E8E5DF] bg-gray-50 hover:opacity-95 transition-all'
      >
        {/* 1. Optimized Preview */}
        <Image
          src={src}
          alt={alt}
          width={400} // Set a base width
          height={300} // This maintains aspect ratio with 'object-cover'
          className='object-cover w-full h-auto max-h-[300px]'
          unoptimized // Required if using external UploadThing URLs without config
        />

        {/* 2. Hover Overlay */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors' />
      </div>

      {/* 3. Full-Screen Lightbox */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src }]}
        render={{
          buttonPrev: () => null, // Hide arrows if only one image
          buttonNext: () => null,
        }}
      />
    </>
  );
}
