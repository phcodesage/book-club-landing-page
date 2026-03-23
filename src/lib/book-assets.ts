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
] as const;

export const BOOK_IMAGE_KEYS = Object.keys(bookImageMap).filter(
  (key): key is BookImageKey => key !== 'site-bg'
);

export const DEFAULT_BOOK_IMAGE_KEY: BookImageKey = 'stronger-than-you-think';

export function getBookImage(imageKey: string): StaticImageData {
  return bookImageMap[imageKey as keyof typeof bookImageMap] ?? bookImageMap[DEFAULT_BOOK_IMAGE_KEY];
}

export { siteBg };
