import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

const Logo: React.FC<LogoProps> = ({ className, size = 32, width, height }) => {
  return (
    <svg
      width={width || size}
      height={height || size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="16" cy="8" rx="4" ry="7" fill="#C9A227" opacity="0.9" />
      <ellipse cx="24" cy="16" rx="7" ry="4" fill="#C9A227" opacity="0.75" />
      <ellipse cx="16" cy="24" rx="4" ry="7" fill="#C9A227" opacity="0.6" />
      <ellipse cx="8" cy="16" rx="7" ry="4" fill="#C9A227" opacity="0.75" />
      <circle cx="16" cy="16" r="3.5" fill="#C9A227" />
    </svg>
  );
};

export default Logo;
