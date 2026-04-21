'use client';

import { BookOpen, Facebook, Instagram, Linkedin, Mail, MapPin, X, Youtube, Menu } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type NavigationProps = {
  logo?: StaticImageData | string;
  title?: string;
  email?: string;
  emailHref?: string;
};

export function Navigation({ 
  logo, 
  title = 'Teen Book Club',
  email = 'teenprograms@exceedlearningcenterny.com',
  emailHref = 'mailto:teenprograms@exceedlearningcenterny.com'
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Reading List', href: '#reading-list' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/ExceedLearningCenter', label: 'Facebook' },
    { icon: Linkedin, href: 'https://linkedin.com/company/exceed-learning-center-ny', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/exceed_learning_center/', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/@ExceedLearningCenterNY', label: 'YouTube' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#') && href.length > 1) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="hidden border-b border-gray-100 bg-white py-2 md:block">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 text-[13px] text-gray-600">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[var(--color-accent)]" />
              <span>1360 Willis Ave, Albertson, NY 11507</span>
            </div>
            <a href={emailHref} className="flex items-center gap-1.5 transition-colors hover:text-[var(--color-accent)]">
              <Mail className="h-4 w-4 text-[var(--color-accent)]" />
              <span>{email}</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">Follow us on Social Media</span>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--color-accent)]"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {logo ? (
              <div className="relative h-14 w-40">
                <Image 
                  src={logo} 
                  alt="Exceed Learning Center" 
                  fill 
                  className="object-contain object-left" 
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-[var(--color-accent)]" />
                <span className="text-xl font-bold text-[var(--color-ink)]">{title}</span>
              </div>
            )}
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-wider text-[var(--color-ink)]">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="transition-colors hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Call Our Office:</span>
                <a href="tel:+15162263114" className="text-lg font-black text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors">
                  +1 (516) 226-3114
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="rounded-lg bg-gray-50 p-2 text-[var(--color-ink)] md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 top-[80px] z-40 bg-white transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left text-lg font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                {link.label}
              </button>
            ))}
          </div>
          
          <div className="mt-8 border-t border-gray-100 pt-8">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Call Our Office:</p>
            <a href="tel:+15162263114" className="mt-2 block text-xl font-black text-[var(--color-ink)]">
              +1 (516) 226-3114
            </a>
            
            <div className="mt-8 flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-[var(--color-accent)]"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
