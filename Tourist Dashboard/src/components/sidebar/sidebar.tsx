import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-full max-w-sm border-l bg-background h-screen flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {children}
        </div>
      </ScrollArea>
    </aside>
  );
}
