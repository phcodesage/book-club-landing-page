import { BookOpen, Calendar, Clock, Sparkles, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import siteBg from './assets/site-bg.png';

// Import all teen book images
import strongerThanYouThink from './assets/stronger-than-you-think.webp';
import youOwnersManual from "./assets/You-the-ownser's-manual-for-teens.jpg";
import behindHappyFaces from './assets/behind-happy-faces.jpg';
import leaderInMe from './assets/the-leader-in-me.jpg';
import dontSweatSmallStuff from "./assets/don't-sweat-the-small-stuff.jpg";
import teensGuideForMakingFriends from "./assets/the-teen-girl's-survival-guide.jpg";
import getOutOfMyLife from './assets/get-out-of-my-life-but-first-could-you-drive-me-and-cherly-to-the-mall.jpg';
import bffAndNrf from './assets/bff-or-nrf.jpg';
import teenInvestor from './assets/teenvestor-the-practical-investment-guide-for-teens-and-their-parents.jpg';
import lifeSkillsForTeens from './assets/life-skills-for-tweens.jpg';
import yearOfPositiveThinking from './assets/a-year-of-positive-thinking-for-teens.jpg';
import whatDoYouReallyWant from './assets/what-do-you-really-want.jpg';

// Teen books data for 2026
const teenBooks = [
  {
    id: 1,
    month: 'January 2026',
    title: 'You Are Stronger Than You Think',
    author: 'Gary Lew',
    meetings: 'January 15 & 29',
    time: '5:00 PM',
    image: strongerThanYouThink,
    emoji: '💪'
  },
  {
    id: 2,
    month: 'February 2026',
    title: "You: The Owner's Manual for Teens",
    author: '',
    meetings: 'February 11 & 25',
    time: '5:00 PM',
    image: youOwnersManual,
    emoji: '📖'
  },
  {
    id: 3,
    month: 'March 2026',
    title: 'Behind Happy Faces: Talking About Mental Health & Emotion',
    author: 'Ross Szabo',
    meetings: 'March 12 & 26',
    time: '5:00 PM',
    image: behindHappyFaces,
    emoji: '😊'
  },
  {
    id: 4,
    month: 'April 2026',
    title: 'The Leader in Me (Teens Edition)',
    author: 'Stephen Covey',
    meetings: 'April 9 & 30',
    time: '5:00 PM',
    image: leaderInMe,
    emoji: '🌟'
  },
  {
    id: 5,
    month: 'May 2026',
    title: "Don't Sweat the Small Stuff for Teens",
    author: 'Richard Carlson',
    meetings: 'May 14 & 28',
    time: '5:00 PM',
    image: dontSweatSmallStuff,
    emoji: '😎'
  },
  {
    id: 6,
    month: 'June 2026',
    title: "The Teen's Guide for Making & Making Friends",
    author: 'Lucie Hemmon, PhD',
    meetings: 'June 11 & 25',
    time: '5:00 PM',
    image: teensGuideForMakingFriends,
    emoji: '🤝'
  },
  {
    id: 7,
    month: 'July 2026',
    title: 'Get Out of My Life, but First Could You Drive Me & Cheryl to the Mall?',
    author: '',
    meetings: 'July 9 & 30',
    time: '5:00 PM',
    image: getOutOfMyLife,
    emoji: '🚗'
  },
  {
    id: 8,
    month: 'August 2026',
    title: 'BFF & NRF (Not Really Friends) – Friendship Health Guide',
    author: '',
    meetings: 'August 13 & 27',
    time: '6:00 PM',
    image: bffAndNrf,
    emoji: '👯'
  },
  {
    id: 9,
    month: 'September 2026',
    title: 'The Teen Investor: How to Start Early, Invest Often & Build Wealth',
    author: 'Emmanuel Modu & Andrea Walker',
    meetings: 'September 10 & 24',
    time: '5:00 PM',
    image: teenInvestor,
    emoji: '💰'
  },
  {
    id: 10,
    month: 'October 2026',
    title: 'Life Skills for Teens',
    author: 'Forne Bowe',
    meetings: 'October 8 & 29',
    time: '5:00 PM',
    image: lifeSkillsForTeens,
    emoji: '🛠️'
  },
  {
    id: 11,
    month: 'November 2026',
    title: 'A Year of Positive Thinking for Teens',
    author: 'Katie Hurley',
    meetings: 'November 12 & 26',
    time: '5:00 PM',
    image: yearOfPositiveThinking,
    emoji: '✨'
  },
  {
    id: 12,
    month: 'December 2026',
    title: 'What Do You Really Want? How to Set a Goal & Go for it!',
    author: 'Beverly K. Bachel',
    meetings: 'December 3 & 23',
    time: '5:00 PM',
    image: whatDoYouReallyWant,
    emoji: '🎯'
  }
];

function App() {
  const [selectedBook, setSelectedBook] = useState<typeof teenBooks[0] | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0e1f3e' }}>
      {/* Hero Section with Gradient Overlay */}
      <div className="relative h-[600px] mb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${siteBg})`,
            filter: 'brightness(0.7)'
          }}
        />
        {/* Gradient Overlay for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(202, 52, 51, 0.15) 0%, rgba(14, 31, 62, 0.25) 100%)'
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center justify-center mb-6 animate-float">
            <div className="relative">
              <BookOpen className="w-24 h-24" style={{ color: '#ca3433' }} />
              <Sparkles className="w-8 h-8 absolute -top-2 -right-2" style={{ color: '#f7e0e0' }} />
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-white mb-4 tracking-tight animate-slide-in">
            TEENS BOOK CLUB
          </h1>

          <div className="flex items-center gap-3 mb-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="h-1 w-16 rounded-full" style={{ backgroundColor: '#ca3433' }}></div>
            <Zap className="w-6 h-6" style={{ color: '#ca3433' }} />
            <div className="h-1 w-16 rounded-full" style={{ backgroundColor: '#ca3433' }}></div>
          </div>

          <p className="text-xl md:text-2xl font-light text-white max-w-3xl leading-relaxed animate-slide-in" style={{ animationDelay: '0.2s' }}>
            Connect with fellow readers, gain <span className="font-bold" style={{ color: '#f7e0e0' }}>fresh perspectives</span>,
            and share how the book's themes truly relate to <span className="font-bold" style={{ color: '#f7e0e0' }}>your life</span>.
            It's where great reading helps you <span className="font-bold text-gradient">Ignite Your Brilliance!</span>
          </p>

          <div className="flex items-center gap-2 mt-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <Users className="w-5 h-5" style={{ color: '#f7e0e0' }} />
            <p className="text-lg font-semibold" style={{ color: '#f7e0e0' }}>Join our growing community of readers</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 max-w-7xl">
        {/* Section Header */}
        <header className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-full"
              style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}>
              📚 2026 Reading List
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight" style={{ color: '#f7e0e0' }}>
            Teen Books for 2026
          </h2>
          <p className="text-xl font-light" style={{ color: '#f7e0e0', opacity: 0.9 }}>
            Explore our exciting lineup of books for the year! 🎯
          </p>
        </header>

        {/* Pricing & CTA Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 blur-xl opacity-50" style={{ backgroundColor: '#ca3433' }}></div>
            <div className="relative px-10 py-5 rounded-2xl font-black text-3xl"
              style={{ backgroundColor: '#f7e0e0', color: '#ca3433' }}>
              <span className="text-lg align-super">$</span>50
              <span className="text-xl font-semibold ml-2">/ month</span>
            </div>
          </div>

          <div>
            <a
              href="https://buy.stripe.com/eVq00caOo1ZM1lD50ndfG00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-12 py-5 text-xl font-black rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-2xl animate-pulse-glow uppercase tracking-wide"
              style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}
            >
              🚀 Join Book Club Now
            </a>
            <p className="mt-4 text-sm font-semibold" style={{ color: '#f7e0e0', opacity: 0.7 }}>
              ✨ Join our vibrant teen reading community
            </p>
          </div>
        </div>

        {/* Book Gallery Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold" style={{ color: '#f7e0e0' }}>
              📖 Complete 2026 Reading Schedule
            </h3>
            <p className="mt-2 text-lg" style={{ color: '#f7e0e0', opacity: 0.8 }}>
              Click on any book to see more details
            </p>
          </div>

          {/* Responsive Grid Book Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teenBooks.map((book, index) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="group rounded-2xl p-5 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden animate-fade-in"
                style={{
                  backgroundColor: '#f7e0e0',
                  animationDelay: `${index * 0.05}s`
                }}
              >
                {/* Month badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
                    style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}>
                    {book.month}
                  </span>
                </div>

                {/* Book Image */}
                <div className="flex justify-center mb-4 mt-8">
                  <div className="relative group-hover:scale-110 transition-transform duration-500">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-32 h-48 sm:w-36 sm:h-52 object-cover rounded-lg shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-base shadow-md"
                      style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}>
                      {book.emoji}
                    </div>
                  </div>
                </div>

                {/* Book Info */}
                <div className="text-center">
                  <h4 className="font-bold text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]" style={{ color: '#0e1f3e' }}>
                    {book.title}
                  </h4>
                  {book.author ? (
                    <p className="text-xs mb-3 line-clamp-1" style={{ color: '#0e1f3e', opacity: 0.7 }}>
                      by {book.author}
                    </p>
                  ) : (
                    <p className="text-xs mb-3" style={{ color: '#0e1f3e', opacity: 0.5 }}>
                      &nbsp;
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-1 text-xs" style={{ color: '#ca3433' }}>
                    <Calendar className="w-3 h-3" />
                    <span className="font-semibold">{book.meetings}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs mt-1" style={{ color: '#ca3433' }}>
                    <Clock className="w-3 h-3" />
                    <span className="font-semibold">{book.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Book Modal */}
        {selectedBook && (
          <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBook(null)}
          >
            <div
              className="max-w-lg w-full rounded-3xl p-8 shadow-2xl relative"
              style={{ backgroundColor: '#f7e0e0' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:scale-110"
                style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}
              >
                ×
              </button>

              <div className="text-center">
                <span className="inline-block text-sm font-bold px-4 py-2 rounded-full mb-4"
                  style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}>
                  {selectedBook.month}
                </span>

                <div className="flex justify-center mb-6">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-48 h-auto rounded-xl shadow-2xl"
                  />
                </div>

                <h3 className="text-2xl font-black mb-2" style={{ color: '#0e1f3e' }}>
                  {selectedBook.title}
                </h3>
                {selectedBook.author && (
                  <p className="text-base font-semibold mb-4" style={{ color: '#0e1f3e', opacity: 0.7 }}>
                    by {selectedBook.author}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(14, 31, 62, 0.08)' }}>
                    <Calendar className="w-5 h-5" style={{ color: '#ca3433' }} />
                    <span className="font-bold" style={{ color: '#0e1f3e' }}>
                      Meetings: {selectedBook.meetings}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(14, 31, 62, 0.08)' }}>
                    <Clock className="w-5 h-5" style={{ color: '#ca3433' }} />
                    <span className="font-bold" style={{ color: '#0e1f3e' }}>
                      Time: {selectedBook.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <footer className="text-center">
          <div className="inline-block rounded-full px-10 py-5 shadow-xl relative overflow-hidden group"
            style={{ backgroundColor: '#ca3433' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <p className="text-white font-bold text-xl relative z-10">
              ⏰ Most meetings at 5:00 PM • August meetings at 6:00 PM
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full"
              style={{ backgroundColor: 'rgba(247, 224, 224, 0.1)' }}>
              <Sparkles className="w-5 h-5" style={{ color: '#f7e0e0' }} />
              <span className="font-semibold" style={{ color: '#f7e0e0' }}>Engaging Discussions</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full"
              style={{ backgroundColor: 'rgba(247, 224, 224, 0.1)' }}>
              <Users className="w-5 h-5" style={{ color: '#f7e0e0' }} />
              <span className="font-semibold" style={{ color: '#f7e0e0' }}>Amazing Community</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full"
              style={{ backgroundColor: 'rgba(247, 224, 224, 0.1)' }}>
              <Zap className="w-5 h-5" style={{ color: '#f7e0e0' }} />
              <span className="font-semibold" style={{ color: '#f7e0e0' }}>Life-Changing Insights</span>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
