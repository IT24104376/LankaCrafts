import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}
export function Card({ className, hoverEffect = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl overflow-hidden border border-stone-200',
        hoverEffect &&
        'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-mustard',
        className
      )}
      {...props} />);


}