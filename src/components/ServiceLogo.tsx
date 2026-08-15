'use client';

import React from 'react';
import { matchBrandByName } from '@/utils/brandLogos';

interface ServiceLogoProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ServiceLogo: React.FC<ServiceLogoProps> = ({ name, size = 'md' }) => {
  const brand = matchBrandByName(name);

  const dimensions = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];

  const svgDimensions = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  if (brand) {
    return (
      <div
        className={`${dimensions} rounded-xl flex items-center justify-center border border-white/10 shrink-0 transition-transform hover:scale-105`}
        style={{ backgroundColor: brand.bgColor }}
      >
        {brand.svg(svgDimensions)}
      </div>
    );
  }

  // Stylish Fallback Monogram Avatar
  const initial = name ? name.charAt(0).toUpperCase() : 'S';
  return (
    <div
      className={`${dimensions} rounded-xl bg-[#292932] border border-[#34343d] flex items-center justify-center font-bold text-[#8083ff] shrink-0`}
    >
      {initial}
    </div>
  );
};
