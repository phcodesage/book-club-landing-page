import { BookOpen, Calendar, Clock } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0e1f3e' }}>
      <div className="relative h-[500px] mb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-20 h-20" style={{ color: '#ca3433' }} />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">BOOK CLUB</h1>
          <p className="text-2xl md:text-3xl font-light text-white max-w-2xl">
            Join us for transformative reading experiences
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 max-w-6xl">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#f7e0e0' }}>
            Upcoming Sessions
          </h2>
          <p className="text-lg" style={{ color: '#f7e0e0', opacity: 0.8 }}>
            Mark your calendars for these inspiring discussions
          </p>
        </header>

        <div className="text-center mb-8">
          <a
            href="https://buy.stripe.com/eVq00caOo1ZM1lD50ndfG00"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#ca3433', color: '#f7e0e0' }}
          >
            Join Book Club Now
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl p-8 shadow-2xl transition-transform hover:scale-105" style={{ backgroundColor: '#f7e0e0' }}>
            <div className="mb-6">
              <span className="text-sm font-bold tracking-wider" style={{ color: '#ca3433' }}>NOVEMBER</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0e1f3e' }}>
                The 6 Most Important Decisions You'll Ever Make: A Guide for Teens
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#ca3433' }} />
                <div>
                  <p className="font-semibold" style={{ color: '#0e1f3e' }}>Meeting Days</p>
                  <p className="text-sm" style={{ color: '#0e1f3e', opacity: 0.8 }}>
                    Thursdays: Nov 13 and Nov 26
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#ca3433' }} />
                <div>
                  <p className="font-semibold" style={{ color: '#0e1f3e' }}>Time</p>
                  <p className="text-sm" style={{ color: '#0e1f3e', opacity: 0.8 }}>4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-8 shadow-2xl transition-transform hover:scale-105" style={{ backgroundColor: '#f7e0e0' }}>
            <div className="mb-6">
              <span className="text-sm font-bold tracking-wider" style={{ color: '#ca3433' }}>DECEMBER</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0e1f3e' }}>
                Your Life, Your Way
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#ca3433' }} />
                <div>
                  <p className="font-semibold" style={{ color: '#0e1f3e' }}>Meeting Days</p>
                  <p className="text-sm" style={{ color: '#0e1f3e', opacity: 0.8 }}>
                    Thursdays: Dec 11 and Dec 25
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#ca3433' }} />
                <div>
                  <p className="font-semibold" style={{ color: '#0e1f3e' }}>Time</p>
                  <p className="text-sm" style={{ color: '#0e1f3e', opacity: 0.8 }}>4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center">
          <div className="inline-block rounded-full px-8 py-4" style={{ backgroundColor: '#ca3433' }}>
            <p className="text-white font-semibold text-lg">
              All meetings are held at 4:00 PM
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
