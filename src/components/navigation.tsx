'use client';

import { BookOpen } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';

type NavigationProps = {
  logo?: StaticImageData | string;
  title?: string;
};

export function Navigation({ logo, title = 'Teen Book Club' }: NavigationProps) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-40 bg-[var(--color-ink)]/95 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {logo ? (
              <div className="relative h-12">
                <Image src={logo} alt="Logo" height={48} width={120} className="h-12 w-auto object-contain" />
              </div>
            ) : (
              <BookOpen className="h-8 w-8 text-[var(--color-accent)]" />
            )}
            <span className="text-xl font-bold text-[var(--color-cream)]">{title}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
