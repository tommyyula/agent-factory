import React, { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export function Collapsible({ open: controlledOpen, onOpenChange, children, className }: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <div className={cn('', className)} data-state={isOpen ? 'open' : 'closed'}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ isOpen?: boolean; onToggle?: () => void }>, {
            isOpen,
            onToggle: () => setOpen(!isOpen)
          });
        }
        return child;
      })}
    </div>
  );
}

interface CollapsibleTriggerProps {
  children: ReactNode;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  asChild?: boolean;
}

export function CollapsibleTrigger({ children, className, onToggle, asChild }: CollapsibleTriggerProps) {
  return (
    <button onClick={onToggle} className={cn('w-full text-left', className)} type="button">
      {children}
    </button>
  );
}

interface CollapsibleContentProps {
  children: ReactNode;
  className?: string;
  isOpen?: boolean;
}

export function CollapsibleContent({ children, className, isOpen }: CollapsibleContentProps) {
  if (!isOpen) return null;
  return <div className={cn('', className)}>{children}</div>;
}
