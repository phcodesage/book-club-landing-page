import { BookOpen, Calendar, Clock, Sparkles, Users, Zap } from 'lucide-react';
import yourLifeYourWay from './assets/your-life-your-way.jpg';
import divergentBook from './assets/divergent-book.webp';
import siteBg from './assets/site-bg.png';

function App() {
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
              📚 What's Next
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight" style={{ color: '#f7e0e0' }}>
            Upcoming Sessions
          </h2>
          <p className="text-xl font-light" style={{ color: '#f7e0e0', opacity: 0.9 }}>
            Mark your calendars for these <span className="font-bold">epic</span> discussions 🎯
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

        {/* Book Club Cards */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16 max-w-5xl mx-auto">
          {/* Teens Book Club */}
          <div className="group rounded-3xl p-10 shadow-2xl transition-all duration-500 hover:scale-105 card-glow animate-slide-in relative overflow-hidden"
            style={{ backgroundColor: '#f7e0e0' }}>
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{ background: 'radial-gradient(circle, #ca3433 0%, transparent 70%)' }}></div>

            <div className="mb-8">
              <div className="flex justify-center mb-8 relative">
                <div className="relative group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={yourLifeYourWay}
                    alt="Your Life, Your Way Book Cover"
                    className="w-56 h-auto rounded-xl shadow-2xl"
                  />
                  <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl"
                    style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}>
                    🎯
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full mb-3"
                  style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}>
                  👥 Teens Book Club
                </span>
                <h2 className="text-3xl md:text-4xl font-black mt-2 leading-tight" style={{ color: '#0e1f3e' }}>
                  Your Life, Your Way
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-2"
                style={{ backgroundColor: 'rgba(14, 31, 62, 0.05)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#ca3433' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#f7e0e0' }} />
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: '#0e1f3e' }}>Meeting Days</p>
                  <p className="text-base font-semibold" style={{ color: '#0e1f3e', opacity: 0.7 }}>
                    📅 Thursdays: Dec 11 & Dec 25
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-2"
                style={{ backgroundColor: 'rgba(14, 31, 62, 0.05)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#ca3433' }}>
                  <Clock className="w-6 h-6" style={{ color: '#f7e0e0' }} />
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: '#0e1f3e' }}>Time</p>
                  <p className="text-base font-semibold" style={{ color: '#0e1f3e', opacity: 0.7 }}>
                    ⏰ 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divergent Book Club */}
          <div className="group rounded-3xl p-10 shadow-2xl transition-all duration-500 hover:scale-105 card-glow animate-slide-in relative overflow-hidden"
            style={{ backgroundColor: '#f7e0e0', animationDelay: '0.2s' }}>
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{ background: 'radial-gradient(circle, #ca3433 0%, transparent 70%)' }}></div>

            <div className="mb-8">
              <div className="flex justify-center mb-8 relative">
                <div className="relative group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={divergentBook}
                    alt="Divergent Book Cover"
                    className="w-56 h-auto rounded-xl shadow-2xl"
                  />
                  <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl"
                    style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}>
                    🔥
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full mb-3"
                  style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}>
                  � Teen Book Club
                </span>
                <h2 className="text-3xl md:text-4xl font-black mt-2 leading-tight" style={{ color: '#0e1f3e' }}>
                  Divergent
                </h2>
                <p className="text-sm font-semibold mt-1" style={{ color: '#0e1f3e', opacity: 0.6 }}>
                  by Veronica Roth
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-2"
                style={{ backgroundColor: 'rgba(14, 31, 62, 0.05)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#ca3433' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#f7e0e0' }} />
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: '#0e1f3e' }}>Meeting Days</p>
                  <p className="text-base font-semibold" style={{ color: '#0e1f3e', opacity: 0.7 }}>
                    📅 Wednesdays: Jan 14 & Jan 28
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-2"
                style={{ backgroundColor: 'rgba(14, 31, 62, 0.05)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#ca3433' }}>
                  <Clock className="w-6 h-6" style={{ color: '#f7e0e0' }} />
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: '#0e1f3e' }}>Time</p>
                  <p className="text-base font-semibold" style={{ color: '#0e1f3e', opacity: 0.7 }}>
                    ⏰ 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="text-center">
          <div className="inline-block rounded-full px-10 py-5 shadow-xl relative overflow-hidden group"
            style={{ backgroundColor: '#ca3433' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <p className="text-white font-bold text-xl relative z-10">
              ⏰ December meetings at 4:00 PM • January meetings at 6:00 PM
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
    </div>
  );
}

export default App;
