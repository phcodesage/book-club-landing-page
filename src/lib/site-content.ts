import { BOOK_IMAGE_KEYS, DEFAULT_BOOK_IMAGE_KEY, type BookImageKey } from '@/lib/book-assets';

export type SiteBook = {
  month: string;
  title: string;
  author: string;
  meetings: string;
  time: string;
  imageKey: string;
  isCompleted?: boolean;
};

export type SiteContent = {
  navigation: {
    logoPath: string;
  };
  hero: {
    title: string;
    description: string;
    communityLabel: string;
    backgroundImage: string;
    communityStats: string;
    floatingCardTitle: string;
    floatingCardSubtitle: string;
  };
  pricing: {
    amount: string;
    intervalLabel: string;
    ctaLabel: string;
    ctaHref: string;
    helperText: string;
    sectionHeading: string;
  };
  schedule: {
    eyebrow: string;
    title: string;
    description: string;
    galleryTitle: string;
    galleryDescription: string;
  };
  modal: {
    ctaLabel: string;
    ctaHref: string;
  };
  footer: {
    highlightItems: string[];
    copyrightText: string;
  };
  contact: {
    phone: string;
    location: string;
    email: string;
    emailHref: string;
  };
  books: SiteBook[];
};

export const defaultSiteContent: SiteContent = {
  navigation: {
    logoPath: '/exceed-logo.png',
  },
  hero: {
    title: 'TEENS BOOK CLUB',
    description:
      'Connect with fellow readers, gain fresh perspectives, and share how each book relates to your life. It is where great reading helps you ignite your brilliance.',
    communityLabel: 'Join our growing community of readers',
    backgroundImage: '/site-bg.png',
    communityStats: 'Join 1000+ Members',
    floatingCardTitle: 'Next Meeting',
    floatingCardSubtitle: 'Join Our Discussion!',
  },
  pricing: {
    amount: '50',
    intervalLabel: '/ month',
    ctaLabel: 'Join Book Club Now',
    ctaHref: 'https://buy.stripe.com/eVq00caOo1ZM1lD50ndfG00',
    helperText: 'Join the teen reading community and reserve your spot.',
    sectionHeading: 'Join the Club and Ignite Your Brilliance',
  },
  schedule: {
    eyebrow: '2026 Reading List',
    title: 'Teen Books for 2026',
    description: 'Explore the full lineup and open any current title for the meeting details.',
    galleryTitle: 'Complete 2026 Reading Schedule',
    galleryDescription: 'Click on any current book to see the meeting details.',
  },
  modal: {
    ctaLabel: 'Reserve Your Spot',
    ctaHref: 'https://buy.stripe.com/eVq00caOo1ZM1lD50ndfG00',
  },
  footer: {
    highlightItems: ['Engaging Discussions', 'Strong Community', 'Practical Takeaways'],
    copyrightText: 'Exceed Learning Center. All rights reserved.',
  },
  contact: {
    phone: '+1 (516) 226-3114',
    location: '1360 Willis Ave., Albertson NY 11507',
    email: 'teenprograms@exceedlearningcenterny.com',
    emailHref: 'mailto:teenprograms@exceedlearningcenterny.com',
  },
  books: [
    {
      month: 'January 2026',
      title: 'You Are Stronger Than You Think',
      author: 'Gary Lew',
      meetings: 'January 15 and 29',
      time: '5:00 PM',
      imageKey: 'stronger-than-you-think',
    },
    {
      month: 'February 2026',
      title: "You: The Owner's Manual for Teens",
      author: '',
      meetings: 'February 11 and 25',
      time: '5:00 PM',
      imageKey: 'you-owners-manual',
    },
    {
      month: 'March 2026',
      title: 'Behind Happy Faces: Talking About Mental Health and Emotion',
      author: 'Ross Szabo',
      meetings: 'March 12 and 26',
      time: '5:00 PM',
      imageKey: 'behind-happy-faces',
    },
    {
      month: 'April 2026',
      title: 'The Leader in Me (Teens Edition)',
      author: 'Stephen Covey',
      meetings: 'April 9 and 30',
      time: '5:00 PM',
      imageKey: 'leader-in-me',
    },
    {
      month: 'May 2026',
      title: "Don't Sweat the Small Stuff for Teens",
      author: 'Richard Carlson',
      meetings: 'May 14 and 28',
      time: '5:00 PM',
      imageKey: 'dont-sweat-small-stuff',
    },
    {
      month: 'June 2026',
      title: "The Teen's Guide for Making and Making Friends",
      author: 'Lucie Hemmen, PhD',
      meetings: 'June 11 and 25',
      time: '5:00 PM',
      imageKey: 'teens-guide-friends',
    },
    {
      month: 'July 2026',
      title: 'Get Out of My Life, but First Could You Drive Me and Cheryl to the Mall?',
      author: '',
      meetings: 'July 9 and 30',
      time: '5:00 PM',
      imageKey: 'get-out-of-my-life',
    },
    {
      month: 'August 2026',
      title: 'BFF and NRF (Not Really Friends) - Friendship Health Guide',
      author: '',
      meetings: 'August 13 and 27',
      time: '6:00 PM',
      imageKey: 'bff-and-nrf',
    },
    {
      month: 'September 2026',
      title: 'The Teen Investor: How to Start Early, Invest Often and Build Wealth',
      author: 'Emmanuel Modu and Andrea Walker',
      meetings: 'September 10 and 24',
      time: '5:00 PM',
      imageKey: 'teen-investor',
    },
    {
      month: 'October 2026',
      title: 'Life Skills for Teens',
      author: 'Forne Bowe',
      meetings: 'October 8 and 29',
      time: '5:00 PM',
      imageKey: 'life-skills',
    },
    {
      month: 'November 2026',
      title: 'A Year of Positive Thinking for Teens',
      author: 'Katie Hurley',
      meetings: 'November 12 and 26',
      time: '5:00 PM',
      imageKey: 'positive-thinking',
    },
    {
      month: 'December 2026',
      title: 'What Do You Really Want? How to Set a Goal and Go for It!',
      author: 'Beverly K. Bachel',
      meetings: 'December 3 and 23',
      time: '5:00 PM',
      imageKey: 'what-do-you-really-want',
    },
  ],
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const validBookImageKeys = new Set(BOOK_IMAGE_KEYS);

function isBookImageKey(value: string): value is BookImageKey {
  return validBookImageKeys.has(value as BookImageKey);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function readLooseString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function normalizeBook(book: unknown, fallback: SiteBook): SiteBook {
  if (!isRecord(book)) {
    return fallback;
  }

  const imageKey = readString(book.imageKey, fallback.imageKey);

  return {
    month: readString(book.month, fallback.month),
    title: readString(book.title, fallback.title),
    author: readLooseString(book.author, fallback.author),
    meetings: readString(book.meetings, fallback.meetings),
    time: readString(book.time, fallback.time),
    imageKey: isBookImageKey(imageKey) ? imageKey : DEFAULT_BOOK_IMAGE_KEY,
    isCompleted: typeof book.isCompleted === 'boolean' ? book.isCompleted : fallback.isCompleted ?? false,
  };
}

export function normalizeSiteContent(input: unknown): SiteContent {
  if (!isRecord(input)) {
    return defaultSiteContent;
  }

  const navigationSource = isRecord(input.navigation) ? input.navigation : {};
  const heroSource = isRecord(input.hero) ? input.hero : {};
  const pricingSource = isRecord(input.pricing) ? input.pricing : {};
  const scheduleSource = isRecord(input.schedule) ? input.schedule : {};
  const modalSource = isRecord(input.modal) ? input.modal : {};
  const footerSource = isRecord(input.footer) ? input.footer : {};
  const contactSource = isRecord(input.contact) ? input.contact : {};
  const booksSource = Array.isArray(input.books) && input.books.length > 0 ? input.books : defaultSiteContent.books;

  return {
    navigation: {
      logoPath: readString(navigationSource.logoPath, defaultSiteContent.navigation.logoPath),
    },
    hero: {
      title: readString(heroSource.title, defaultSiteContent.hero.title),
      description: readString(heroSource.description, defaultSiteContent.hero.description),
      communityLabel: readString(heroSource.communityLabel, defaultSiteContent.hero.communityLabel),
      backgroundImage: readString(heroSource.backgroundImage, defaultSiteContent.hero.backgroundImage),
      communityStats: readString(heroSource.communityStats, defaultSiteContent.hero.communityStats),
      floatingCardTitle: readString(heroSource.floatingCardTitle, defaultSiteContent.hero.floatingCardTitle),
      floatingCardSubtitle: readString(heroSource.floatingCardSubtitle, defaultSiteContent.hero.floatingCardSubtitle),
    },
    pricing: {
      amount: readString(pricingSource.amount, defaultSiteContent.pricing.amount),
      intervalLabel: readString(pricingSource.intervalLabel, defaultSiteContent.pricing.intervalLabel),
      ctaLabel: readString(pricingSource.ctaLabel, defaultSiteContent.pricing.ctaLabel),
      ctaHref: readString(pricingSource.ctaHref, defaultSiteContent.pricing.ctaHref),
      helperText: readString(pricingSource.helperText, defaultSiteContent.pricing.helperText),
      sectionHeading: readString(pricingSource.sectionHeading, defaultSiteContent.pricing.sectionHeading),
    },
    schedule: {
      eyebrow: readString(scheduleSource.eyebrow, defaultSiteContent.schedule.eyebrow),
      title: readString(scheduleSource.title, defaultSiteContent.schedule.title),
      description: readString(scheduleSource.description, defaultSiteContent.schedule.description),
      galleryTitle: readString(scheduleSource.galleryTitle, defaultSiteContent.schedule.galleryTitle),
      galleryDescription: readString(
        scheduleSource.galleryDescription,
        defaultSiteContent.schedule.galleryDescription
      ),
    },
    modal: {
      ctaLabel: readString(modalSource.ctaLabel, defaultSiteContent.modal.ctaLabel),
      ctaHref: readString(modalSource.ctaHref, defaultSiteContent.modal.ctaHref),
    },
    footer: {
      highlightItems: Array.isArray(footerSource.highlightItems) && footerSource.highlightItems.length > 0
        ? footerSource.highlightItems
            .map((item, index) => readString(item, defaultSiteContent.footer.highlightItems[index] ?? 'New highlight'))
            .slice(0, 6)
        : defaultSiteContent.footer.highlightItems,
      copyrightText: readString(footerSource.copyrightText, defaultSiteContent.footer.copyrightText),
    },
    contact: {
      phone: readString(contactSource.phone, defaultSiteContent.contact.phone),
      location: readString(contactSource.location, defaultSiteContent.contact.location),
      email: readString(contactSource.email, defaultSiteContent.contact.email),
      emailHref: readString(contactSource.emailHref, defaultSiteContent.contact.emailHref),
    },
    books: booksSource.map((book, index) =>
      normalizeBook(book, defaultSiteContent.books[index] ?? defaultSiteContent.books.at(-1)!)
    ),
  };
}

export function isMonthPast(monthStr: string, referenceDate: Date, meetings?: string): boolean {
  const [monthName, yearStr] = monthStr.split(' ');
  const monthIndex = MONTH_NAMES.indexOf(monthName);
  const year = Number.parseInt(yearStr, 10);

  if (year < referenceDate.getFullYear()) {
    return true;
  }

  if (year > referenceDate.getFullYear()) {
    return false;
  }

  // If it's a future month in the same year, it's not past.
  if (monthIndex > referenceDate.getMonth()) {
    return false;
  }

  // If it's a past month in the same year, it's definitely past.
  if (monthIndex < referenceDate.getMonth()) {
    return true;
  }

  // If it's the current month, check the last meeting date if available.
  if (meetings) {
    // Extract all numbers from the meetings string (e.g., "March 12 and 26" -> [12, 26])
    const days = (meetings.match(/\d+/g) || []).map((d) => Number.parseInt(d, 10));
    if (days.length > 0) {
      const lastMeetingDay = Math.max(...days);
      // It's past if today is after the last meeting day.
      return referenceDate.getDate() > lastMeetingDay;
    }
  }

  // Fallback to month-level precision: it's only past if the month is over.
  return false;
}
