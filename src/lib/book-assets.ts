import type { StaticImageData } from 'next/image';

import yearOfPositiveThinking from "@/assets/a-year-of-positive-thinking-for-teens.jpg";
import behindHappyFaces from '@/assets/behind-happy-faces.jpg';
import bffAndNrf from '@/assets/bff-or-nrf.jpg';
import dontSweatSmallStuff from "@/assets/don't-sweat-the-small-stuff.jpg";
import divergentBook from '@/assets/divergent-book.webp';
import getOutOfMyLife from '@/assets/get-out-of-my-life-but-first-could-you-drive-me-and-cherly-to-the-mall.jpg';
import lifeSkillsForTeens from '@/assets/life-skills-for-tweens.jpg';
import strongerThanYouThink from '@/assets/stronger-than-you-think.webp';
import siteBg from '@/assets/site-bg.png';
import teenInvestor from '@/assets/teenvestor-the-practical-investment-guide-for-teens-and-their-parents.jpg';
import leaderInMe from '@/assets/the-leader-in-me.jpg';
import teensGuideForMakingFriends from "@/assets/the-teen-girl's-survival-guide.jpg";
import whatDoYouReallyWant from '@/assets/what-do-you-really-want.jpg';
import youOwnersManual from "@/assets/You-the-ownser's-manual-for-teens.jpg";
import yourLifeYourWay from '@/assets/your-life-your-way.jpg';

// Adults Books
import mindGutConnection from '@/assets/the-mind-gut-connection.jpg';
import bookOfJoy from '@/assets/the-book-of-joy.jpg';
import atlasOfTheHeart from '@/assets/atlas-of-the-heart.jpg';
import grit from '@/assets/grit.jpg';
import sacredRest from '@/assets/the-sacred-rest.jpg';
import setBoundaries from '@/assets/set-bounderies-find-peace.jpg';
import goodInside from '@/assets/good-inside.jpg';
import bravingWilderness from '@/assets/braving-the-wilderness.jpg';
import moneyMagic from '@/assets/money-magic.webp';
import leanStartup from '@/assets/the-lean-startup.jpg';
import essentialism from '@/assets/the-desciplined-pursuit-of-less.jpg';
import bestYearEver from '@/assets/your-best-year-ever.jpg';

export const bookImageMap = {
  'behind-happy-faces': behindHappyFaces,
  'bff-and-nrf': bffAndNrf,
  'divergent-book': divergentBook,
  'dont-sweat-small-stuff': dontSweatSmallStuff,
  'get-out-of-my-life': getOutOfMyLife,
  'leader-in-me': leaderInMe,
  'life-skills': lifeSkillsForTeens,
  'positive-thinking': yearOfPositiveThinking,
  'site-bg': siteBg,
  'stronger-than-you-think': strongerThanYouThink,
  'teen-investor': teenInvestor,
  'teens-guide-friends': teensGuideForMakingFriends,
  'what-do-you-really-want': whatDoYouReallyWant,
  'you-owners-manual': youOwnersManual,
  'your-life-your-way': yourLifeYourWay,
  // Adults Books
  'mind-gut-connection': mindGutConnection,
  'book-of-joy': bookOfJoy,
  'atlas-of-the-heart': atlasOfTheHeart,
  'grit': grit,
  'sacred-rest': sacredRest,
  'set-boundaries': setBoundaries,
  'good-inside': goodInside,
  'braving-wilderness': bravingWilderness,
  'money-magic': moneyMagic,
  'lean-startup': leanStartup,
  'essentialism': essentialism,
  'best-year-ever': bestYearEver,
} satisfies Record<string, StaticImageData>;

export type BookImageKey = Exclude<keyof typeof bookImageMap, 'site-bg'>;

export const bookImageOptions = [
  { value: 'stronger-than-you-think', label: 'You Are Stronger Than You Think' },
  { value: 'you-owners-manual', label: "You: The Owner's Manual for Teens" },
  { value: 'behind-happy-faces', label: 'Behind Happy Faces' },
  { value: 'leader-in-me', label: 'The Leader in Me' },
  { value: 'dont-sweat-small-stuff', label: "Don't Sweat the Small Stuff" },
  { value: 'teens-guide-friends', label: "The Teen's Guide for Making Friends" },
  { value: 'get-out-of-my-life', label: 'Get Out of My Life' },
  { value: 'bff-and-nrf', label: 'BFF and NRF' },
  { value: 'teen-investor', label: 'The Teen Investor' },
  { value: 'life-skills', label: 'Life Skills for Teens' },
  { value: 'positive-thinking', label: 'A Year of Positive Thinking' },
  { value: 'what-do-you-really-want', label: 'What Do You Really Want?' },
  { value: 'divergent-book', label: 'Divergent' },
  { value: 'your-life-your-way', label: 'Your Life, Your Way' },
  // Adults Books
  { value: 'mind-gut-connection', label: 'Mind-Gut Connection' },
  { value: 'book-of-joy', label: 'The Book of Joy' },
  { value: 'atlas-of-the-heart', label: 'Atlas of the Heart' },
  { value: 'grit', label: 'Grit' },
  { value: 'sacred-rest', label: 'Sacred Rest' },
  { value: 'set-boundaries', label: 'Set Boundaries, Find Peace' },
  { value: 'good-inside', label: 'Good Inside' },
  { value: 'braving-wilderness', label: 'Braving the Wilderness' },
  { value: 'money-magic', label: 'Money Magic' },
  { value: 'lean-startup', label: 'The Lean Startup' },
  { value: 'essentialism', label: 'Essentialism' },
  { value: 'best-year-ever', label: 'Your Best Year Ever' },
] as const;

export const BOOK_IMAGE_KEYS = Object.keys(bookImageMap).filter(
  (key): key is BookImageKey => key !== 'site-bg'
);

export const DEFAULT_BOOK_IMAGE_KEY: BookImageKey = 'stronger-than-you-think';

export function getBookImage(imageKey: string): StaticImageData {
  return bookImageMap[imageKey as keyof typeof bookImageMap] ?? bookImageMap[DEFAULT_BOOK_IMAGE_KEY];
}

export { siteBg };
