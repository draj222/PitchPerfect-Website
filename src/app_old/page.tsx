"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-black bg-opacity-80 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C41E3A] rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">P</span>
            </div>
            <span className="font-bold text-xl">Pitch Perfect</span>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><a href="#features" className="hover:text-[#C41E3A] transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-[#C41E3A] transition-colors">How It Works</a></li>
              <li><a href="#privacy" className="hover:text-[#C41E3A] transition-colors">Privacy</a></li>
              <li><a href="#faq" className="hover:text-[#C41E3A] transition-colors">FAQ</a></li>
            </ul>
          </nav>
          
          <a 
            href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-3 px-6 rounded-md transition-all duration-300 hidden md:block"
          >
            Add to Discord
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Perfect Your Pitch with <span className="text-[#C41E3A]">AI Feedback</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Practice and improve your pitch presentations with instant AI-powered feedback right on Discord.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-3 px-6 rounded-md transition-all duration-300 text-center"
                >
                  Add to Discord
                </a>
                
                <a 
                  href="#how-it-works"
                  className="border-2 border-[#C41E3A] text-white hover:bg-[#C41E3A]/10 font-medium py-3 px-6 rounded-md transition-all duration-300 text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-[#C41E3A]/10 rounded-full flex items-center justify-center">
                <div className="w-48 h-48 md:w-60 md:h-60 bg-[#C41E3A]/20 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-[#C41E3A] rounded-full flex items-center justify-center text-4xl md:text-6xl font-bold">
                    P
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-black/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful <span className="text-[#C41E3A]">Features</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to perfect your pitch is right at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="text-4xl mb-4 text-[#C41E3A]">🎙️</div>
              <h3 className="text-xl font-bold mb-3">Voice Recording</h3>
              <p className="text-gray-300">Record your pitch directly within Discord with high-quality audio capture and processing.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="text-4xl mb-4 text-[#C41E3A]">✍️</div>
              <h3 className="text-xl font-bold mb-3">AI Transcription</h3>
              <p className="text-gray-300">Powerful Whisper API automatically converts your speech to text with remarkable accuracy.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="text-4xl mb-4 text-[#C41E3A]">🧠</div>
              <h3 className="text-xl font-bold mb-3">GPT-4 Analysis</h3>
              <p className="text-gray-300">Advanced AI evaluates your pitch content, structure, clarity, and persuasiveness.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="text-4xl mb-4 text-[#C41E3A]">📊</div>
              <h3 className="text-xl font-bold mb-3">Detailed Feedback</h3>
              <p className="text-gray-300">Receive constructive feedback on delivery, pacing, clarity, and areas for improvement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It <span className="text-[#C41E3A]">Works</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Perfecting your pitch is just a few simple steps away.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center">
            <div className="md:w-1/2 space-y-10">
              {/* Step 1 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#C41E3A] flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Add Bot to Server</h3>
                  <p className="text-gray-300">Invite Pitch Perfect to your Discord server with just a few clicks.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#C41E3A] flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Start Recording</h3>
                  <p className="text-gray-300">Use the /startpitch command to begin your pitch recording session.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#C41E3A] flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Practice Your Pitch</h3>
                  <p className="text-gray-300">Deliver your pitch presentation while Discord records your voice.</p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#C41E3A] flex items-center justify-center text-xl font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Receive Feedback</h3>
                  <p className="text-gray-300">Get comprehensive AI-powered feedback on your pitch content, delivery, and structure.</p>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 bg-black/40 border border-gray-800 rounded-xl p-6">
              <div className="rounded-lg bg-gray-900 p-4 font-mono text-sm">
                <p className="text-gray-300 mb-2"><span className="text-[#C41E3A]">@User</span>: /startpitch</p>
                <p className="text-gray-300 mb-2"><span className="text-blue-400">@PitchPerfect</span>: I'm ready to record your pitch! Press the button below when you're ready to start.</p>
                <p className="text-gray-300 mb-2 ml-4">[Start Recording] [Cancel]</p>
                <p className="text-gray-300 mb-2"><span className="text-[#C41E3A]">@User</span>: *clicks Start Recording*</p>
                <p className="text-gray-300 mb-2"><span className="text-blue-400">@PitchPerfect</span>: Recording started! I'll listen for up to 5 minutes. When you're done, click Stop.</p>
                <p className="text-gray-300 mb-2 ml-4">[Stop Recording]</p>
                <p className="text-gray-300 mb-2"><span className="text-[#C41E3A]">@User</span>: *delivers pitch and clicks Stop*</p>
                <p className="text-gray-300 mb-2"><span className="text-blue-400">@PitchPerfect</span>: Processing your pitch... This will take a moment.</p>
                <p className="text-gray-300 mb-2"><span className="text-blue-400">@PitchPerfect</span>: Here's my feedback on your pitch:</p>
                <div className="ml-4 border-l-2 border-[#C41E3A] pl-3 mt-3">
                  <p className="text-gray-300"><span className="font-bold text-[#C41E3A]">Content:</span> Clear value proposition, strong opener...</p>
                  <p className="text-gray-300"><span className="font-bold text-[#C41E3A]">Delivery:</span> Good pace, watch filler words...</p>
                  <p className="text-gray-300"><span className="font-bold text-[#C41E3A]">Structure:</span> Well-organized, consider stronger close...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#C41E3A] rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">P</span>
              </div>
              <span className="font-bold text-xl">Pitch Perfect</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 mb-6">
              Perfect your pitch with AI-powered feedback through our Discord bot.
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a 
                href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-3 px-6 rounded-md transition-all duration-300 text-center"
              >
                Add to Discord
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex justify-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Pitch Perfect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
} 