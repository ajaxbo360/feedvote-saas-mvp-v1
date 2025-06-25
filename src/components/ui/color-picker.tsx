'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(({ color, onChange, className, ...props }, ref) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        ref={ref}
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded border border-input cursor-pointer"
        {...props}
      />
      <span className="text-sm font-mono text-muted-foreground">{color}</span>
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
