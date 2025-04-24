import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';

export default function Home() {
  return (
    <>
      <Head>
        <title>Pitch Perfect - AI Pitch Feedback Discord Bot</title>
        <meta name="description" content="Pitch Perfect is a voice-enabled Discord bot that listens to your startup pitch in real-time, transcribes it using Whisper, and delivers instant investor-style feedback via GPT-4." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23000%22 stroke=%22%23C41E3A%22 stroke-width=%228%22/><path d=%22M50 75C42 75 35 68 35 60V40C35 32 42 25 50 25C58 25 65 32 65 40V60C65 68 58 75 50 75Z%22 fill=%22%23C41E3A%22/><rect x=%2240%22 y=%2235%22 width=%2220%22 height=%225%22 rx=%222%22 fill=%22%23000%22/><rect x=%2240%22 y=%2245%22 width=%2220%22 height=%225%22 rx=%222%22 fill=%22%23000%22/><rect x=%2240%22 y=%2255%22 width=%2220%22 height=%225%22 rx=%222%22 fill=%22%23000%22/></svg>" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#C41E3A" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pitch-perfect.app/" />
        <meta property="og:title" content="Pitch Perfect - AI Pitch Feedback Bot" />
        <meta property="og:description" content="Perfect Your Pitch with AI Feedback - Discord bot that listens to your startup pitch, transcribes it using Whisper, and delivers instant feedback via GPT-4." />
        <meta property="og:image" content="https://raw.githubusercontent.com/draj222/PitchPerfect-Website/main/public/images/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://pitch-perfect.app/" />
        <meta name="twitter:title" content="Pitch Perfect - AI Pitch Feedback Bot" />
        <meta name="twitter:description" content="Perfect Your Pitch with AI Feedback - Discord bot that listens to your startup pitch, transcribes it using Whisper, and delivers instant feedback via GPT-4." />
        <meta name="twitter:image" content="https://raw.githubusercontent.com/draj222/PitchPerfect-Website/main/public/images/og-image.jpg" />
      </Head>
      
      <main className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-[#C41E3A]/30 to-transparent rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-br from-[#C41E3A]/30 to-transparent rounded-full blur-3xl opacity-20"></div>
        </div>
        
        {/* Top left corner logo - original (now hidden) */}
        <a href="/" className="fixed top-5 left-5 z-[100] w-14 h-14 bg-black rounded-full p-1.5 backdrop-blur-lg border-2 border-[#C41E3A] shadow-[0_0_20px_rgba(196,30,58,0.4)] transition-transform duration-300 hover:scale-110 cursor-pointer flex items-center justify-center hidden">
          <Image 
            src="/logo.svg" 
            alt="Pitch Perfect Logo" 
            width={48}
            height={48}
            className="w-full h-full"
            priority
          />
        </a>
        
        {/* New top left corner logo - highly visible tab style */}
        <a href="/" className="fixed top-0 left-8 z-[100] bg-[#C41E3A] px-6 py-3 rounded-b-xl shadow-xl hover:bg-[#a01930] transition-colors duration-300 flex items-center gap-3 border-b-4 border-l-2 border-r-2 border-black">
          <div className="bg-white rounded-full p-1 w-7 h-7 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" fill="black" stroke="#C41E3A" strokeWidth="20"/>
              <path d="M200 320 C160 320 130 290 130 250 L130 150 C130 110 160 80 200 80 C240 80 270 110 270 150 L270 250 C270 290 240 320 200 320Z" fill="#C41E3A" stroke="#C41E3A" strokeWidth="5"/>
              <rect x="160" y="100" width="80" height="15" rx="5" fill="black"/>
              <rect x="160" y="125" width="80" height="15" rx="5" fill="black"/>
              <rect x="160" y="150" width="80" height="15" rx="5" fill="black"/>
              <rect x="160" y="175" width="80" height="15" rx="5" fill="black"/>
              <rect x="160" y="200" width="80" height="15" rx="5" fill="black"/>
            </svg>
          </div>
          <span className="font-bold text-white">Pitch Perfect</span>
        </a>
        
        {/* Header */}
        <header className="fixed w-full z-50 bg-black/80 backdrop-blur-lg py-4 border-b border-[#C41E3A]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3 ml-36 md:ml-32">
              <span className="font-bold text-xl hidden">Pitch Perfect</span>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#features" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">How It Works</a></li>
                <li><a href="#demo" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">Demo</a></li>
                <li><a href="#faq" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">FAQ</a></li>
              </ul>
            </nav>
            
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-2 px-4 rounded-md transition-all duration-300 text-sm hidden md:block relative overflow-hidden"
            >
              <span className="relative z-10">Add to Discord</span>
              <span className="absolute inset-0 bg-white/10 transform translate-y-full hover:translate-y-0 transition-transform duration-300"></span>
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2">
                <div className="inline-block px-3 py-1 bg-[#C41E3A]/10 rounded-full text-[#C41E3A] text-sm font-medium mb-6 border border-[#C41E3A]/20">
                  Voice-enabled Discord bot
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Perfect Your Pitch with <span className="text-[#C41E3A] relative">
                    AI Feedback
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#C41E3A]/30"></span>
                  </span>
                </h1>
                
                <p className="text-lg text-gray-300 mb-8 max-w-lg">
                  🎤 Pitch Perfect listens to your startup pitch in real-time, transcribes it using Whisper, 
                  and delivers instant investor-style feedback via GPT-4 — all from inside a Discord voice channel.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-3 px-6 rounded-md transition-all duration-300 text-center relative overflow-hidden"
                  >
                    <span className="relative z-10">Add to Discord</span>
                    <span className="absolute inset-0 bg-white/10 transform translate-y-full hover:translate-y-0 transition-transform duration-300"></span>
                  </a>
                  
                  <a 
                    href="#how-it-works"
                    className="border border-[#C41E3A] text-white hover:bg-[#C41E3A]/10 font-medium py-3 px-6 rounded-md transition-all duration-300 text-center"
                  >
                    See How It Works
                  </a>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-[#C41E3A]/20 to-transparent flex items-center justify-center animate-pulse-slow">
                    <div className="w-60 h-60 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-[#C41E3A]/30 to-transparent flex items-center justify-center">
                      <div className="relative w-48 h-48 md:w-64 md:h-64">
                        <Image 
                          src="/logo.svg"
                          alt="Pitch Perfect Logo"
                          width={256}
                          height={256}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-black/80 backdrop-blur-sm border border-[#C41E3A]/40 rounded-lg p-3 shadow-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#C41E3A] animate-pulse"></div>
                      <span className="text-sm font-medium">Listening...</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-black/80 backdrop-blur-sm border border-[#C41E3A]/40 rounded-lg p-3 shadow-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-medium">AI Analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-gradient-to-b from-black via-black/95 to-black relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-[#C41E3A]/10 rounded-full text-[#C41E3A] text-sm font-medium mb-4 border border-[#C41E3A]/20">
                Powerful Tools
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced <span className="text-[#C41E3A]">Features</span></h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Everything you need to perfect your pitch is right at your fingertips.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)] group">
                <div className="w-12 h-12 rounded-full bg-[#C41E3A]/10 flex items-center justify-center mb-6 text-[#C41E3A] group-hover:bg-[#C41E3A]/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Real-Time Voice Recording</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Record your pitch directly within Discord's voice channels with high-quality audio processing and no time limits.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)] group">
                <div className="w-12 h-12 rounded-full bg-[#C41E3A]/10 flex items-center justify-center mb-6 text-[#C41E3A] group-hover:bg-[#C41E3A]/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Whisper Transcription</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">State-of-the-art AI transcribes your speech to text with remarkable accuracy, even with technical terms and jargon.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)] group">
                <div className="w-12 h-12 rounded-full bg-[#C41E3A]/10 flex items-center justify-center mb-6 text-[#C41E3A] group-hover:bg-[#C41E3A]/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">GPT-4 Analysis</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Advanced AI evaluates your pitch content, structure, clarity, and persuasiveness through an investor's lens.</p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)] group">
                <div className="w-12 h-12 rounded-full bg-[#C41E3A]/10 flex items-center justify-center mb-6 text-[#C41E3A] group-hover:bg-[#C41E3A]/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Detailed Metrics</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Get specific metrics on clarity, conciseness, persuasiveness, and other key factors that investors look for.</p>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)] group">
                <div className="w-12 h-12 rounded-full bg-[#C41E3A]/10 flex items-center justify-center mb-6 text-[#C41E3A] group-hover:bg-[#C41E3A]/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Actionable Improvements</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Receive specific suggestions for improving your pitch, with concrete examples and actionable advice.</p>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)] group">
                <div className="w-12 h-12 rounded-full bg-[#C41E3A]/10 flex items-center justify-center mb-6 text-[#C41E3A] group-hover:bg-[#C41E3A]/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Track your improvement over time as you refine your pitch with multiple practice sessions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 relative">
          <div className="absolute inset-0 bg-[#C41E3A]/5 bg-opacity-5 backdrop-blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-[#C41E3A]/10 rounded-full text-[#C41E3A] text-sm font-medium mb-4 border border-[#C41E3A]/20">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How <span className="text-[#C41E3A]">It Works</span></h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Perfecting your pitch is just a few simple steps away.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex gap-6 group">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#C41E3A]/10 flex items-center justify-center text-xl font-bold text-[#C41E3A] border border-[#C41E3A]/30 group-hover:bg-[#C41E3A]/20 group-hover:border-[#C41E3A] transition-all duration-300">
                      1
                    </div>
                    <div className="absolute top-16 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-[#C41E3A]/10 hidden lg:block"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#C41E3A] transition-colors">Add Bot to Your Server</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Invite Pitch Perfect to your Discord server with just a few clicks. No complex setup required.</p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex gap-6 group">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#C41E3A]/10 flex items-center justify-center text-xl font-bold text-[#C41E3A] border border-[#C41E3A]/30 group-hover:bg-[#C41E3A]/20 group-hover:border-[#C41E3A] transition-all duration-300">
                      2
                    </div>
                    <div className="absolute top-16 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-[#C41E3A]/10 hidden lg:block"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#C41E3A] transition-colors">Join a Voice Channel</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Enter any voice channel in your server where you want to practice your pitch.</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex gap-6 group">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#C41E3A]/10 flex items-center justify-center text-xl font-bold text-[#C41E3A] border border-[#C41E3A]/30 group-hover:bg-[#C41E3A]/20 group-hover:border-[#C41E3A] transition-all duration-300">
                      3
                    </div>
                    <div className="absolute top-16 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-[#C41E3A]/10 hidden lg:block"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#C41E3A] transition-colors">Start Recording Session</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Use the /startpitch command in any text channel to begin your pitch recording session.</p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex gap-6 group">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#C41E3A]/10 flex items-center justify-center text-xl font-bold text-[#C41E3A] border border-[#C41E3A]/30 group-hover:bg-[#C41E3A]/20 group-hover:border-[#C41E3A] transition-all duration-300">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#C41E3A] transition-colors">Receive Detailed Feedback</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Get comprehensive AI-powered feedback on your pitch content, delivery, and structure instantly.</p>
                  </div>
                </div>
              </div>

              <div className="relative bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 overflow-hidden group hover:border-[#C41E3A]/40 transition-all duration-500 hover:shadow-[0_0_15px_rgba(196,30,58,0.15)]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#C41E3A]/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 group-hover:bg-[#C41E3A]/20 transition-all duration-700"></div>
                <div className="rounded-lg bg-black/80 p-6 font-mono text-sm relative z-10">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center text-gray-500 text-xs">Discord - Pitch Perfect Bot</div>
                  </div>
                  <p className="text-gray-400 mb-3"><span className="text-[#C41E3A]">@User</span>: /startpitch</p>
                  <p className="text-gray-300 mb-3 pl-4 border-l-2 border-blue-500"><span className="text-blue-400">@PitchPerfect</span>: I'm ready to record your pitch! Join a voice channel and press the button below when you're ready to start.</p>
                  <p className="text-gray-300 mb-4 pl-4"><button className="bg-[#C41E3A]/80 hover:bg-[#C41E3A] text-white text-xs py-1 px-3 rounded-md transition-colors mr-2">Start Recording</button> <button className="bg-gray-800 text-white text-xs py-1 px-3 rounded-md hover:bg-gray-700 transition-colors">Cancel</button></p>
                  <p className="text-gray-400 mb-3"><span className="text-[#C41E3A]">@User</span>: *clicks Start Recording*</p>
                  <p className="text-gray-300 mb-3 pl-4 border-l-2 border-blue-500"><span className="text-blue-400">@PitchPerfect</span>: 🎙️ Recording started! I'll listen for up to 5 minutes. Say your pitch clearly, and click Stop when you're done.</p>
                  <p className="text-gray-300 mb-4 pl-4"><button className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3 rounded-md transition-colors">Stop Recording</button></p>
                  <p className="text-gray-400 mb-3"><span className="text-[#C41E3A]">@User</span>: *delivers pitch and clicks Stop*</p>
                  <p className="text-gray-300 mb-3 pl-4 border-l-2 border-blue-500"><span className="text-blue-400">@PitchPerfect</span>: 🔄 Processing your pitch... This will take just a moment.</p>
                  <p className="text-gray-300 pl-4 border-l-2 border-blue-500"><span className="text-blue-400">@PitchPerfect</span>: Here's my feedback on your pitch:</p>
                  <div className="ml-6 mt-3 space-y-3">
                    <div className="bg-black border border-[#C41E3A]/20 rounded-md p-3">
                      <p className="text-gray-300 mb-1"><span className="font-bold text-[#C41E3A]">Content:</span> <span className="text-green-400">8.5/10</span></p>
                      <p className="text-gray-400 text-xs">Clear value proposition and strong market positioning. Consider expanding on competitive advantages.</p>
                    </div>
                    <div className="bg-black border border-[#C41E3A]/20 rounded-md p-3">
                      <p className="text-gray-300 mb-1"><span className="font-bold text-[#C41E3A]">Delivery:</span> <span className="text-yellow-400">7.2/10</span></p>
                      <p className="text-gray-400 text-xs">Good pace overall, but watch for filler words. Try to vary your tone for emphasis on key points.</p>
                    </div>
                    <div className="bg-black border border-[#C41E3A]/20 rounded-md p-3">
                      <p className="text-gray-300 mb-1"><span className="font-bold text-[#C41E3A]">Structure:</span> <span className="text-green-400">8.7/10</span></p>
                      <p className="text-gray-400 text-xs">Well-organized flow. Consider a stronger closing statement to reinforce your ask.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="py-20 bg-gradient-to-b from-black via-black/95 to-black relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-[#C41E3A]/10 rounded-full text-[#C41E3A] text-sm font-medium mb-4 border border-[#C41E3A]/20">
                See it in action
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Live <span className="text-[#C41E3A]">Demo</span></h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Watch how Pitch Perfect helps founders improve their pitches in real-time.
              </p>
            </div>

            <div className="border-2 border-[#C41E3A]/20 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(196,30,58,0.1)]">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-b from-[#C41E3A]/10 to-black/60 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24">
                    <Image 
                      src="/logo.svg"
                      alt="Pitch Perfect Logo"
                      width={96}
                      height={96}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-gray-200 text-lg font-medium">Demo Video Coming Soon</p>
                  <button className="bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-2 px-6 rounded-md transition-all duration-300 flex items-center gap-2 mt-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Watch Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-[#C41E3A]/10 rounded-full text-[#C41E3A] text-sm font-medium mb-4 border border-[#C41E3A]/20">
                Questions & Answers
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked <span className="text-[#C41E3A]">Questions</span></h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Everything you need to know about Pitch Perfect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* FAQ Item 1 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)]">
                <h3 className="text-xl font-bold mb-3">Is my pitch data private?</h3>
                <p className="text-gray-400">Absolutely. Your pitch recordings and transcripts are processed securely and never stored long-term or shared with third parties.</p>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)]">
                <h3 className="text-xl font-bold mb-3">Do I need technical knowledge?</h3>
                <p className="text-gray-400">Not at all. Pitch Perfect is designed to be user-friendly with simple slash commands that anyone can use, regardless of technical experience.</p>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)]">
                <h3 className="text-xl font-bold mb-3">Is there a time limit for pitches?</h3>
                <p className="text-gray-400">Each recording session can last up to 5 minutes, which is ideal for most elevator and seed pitches. If you need more time, you can start additional sessions.</p>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)]">
                <h3 className="text-xl font-bold mb-3">How many pitches can I practice?</h3>
                <p className="text-gray-400">The free tier allows for 5 pitch sessions per month. Premium plans offer unlimited pitch sessions with enhanced feedback features.</p>
              </div>
              
              {/* FAQ Item 5 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)]">
                <h3 className="text-xl font-bold mb-3">Can I use this in any Discord server?</h3>
                <p className="text-gray-400">Yes, you can add Pitch Perfect to any Discord server where you have the necessary permissions to add bots.</p>
              </div>
              
              {/* FAQ Item 6 */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#C41E3A]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,30,58,0.1)]">
                <h3 className="text-xl font-bold mb-3">What languages are supported?</h3>
                <p className="text-gray-400">Currently, Pitch Perfect supports English language pitches, with plans to expand to additional languages in the future.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-black to-[#C41E3A]/10 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Perfect Your <span className="text-[#C41E3A]">Pitch?</span></h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10">
                Add Pitch Perfect to your Discord server today and start receiving professional-quality feedback on your pitches.
              </p>
              
              <a 
                href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-4 px-8 rounded-md transition-all duration-300 text-center inline-flex items-center gap-2 group"
              >
                <span>Add to Discord</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
              
              <div className="mt-12 flex flex-wrap justify-center gap-12 items-center opacity-70">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C41E3A] mb-1">500+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C41E3A] mb-1">5,000+</div>
                  <div className="text-sm text-gray-400">Pitches Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C41E3A] mb-1">98%</div>
                  <div className="text-sm text-gray-400">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C41E3A] mb-1">200+</div>
                  <div className="text-sm text-gray-400">Discord Servers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-16 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="flex items-center gap-3 mb-8 md:mb-0">
                <div className="relative w-10 h-10">
                  <Image 
                    src="/logo.svg"
                    alt="Pitch Perfect Logo"
                    width={40}
                    height={40}
                    className="w-full h-full"
                  />
                </div>
                <span className="font-bold text-xl">Pitch Perfect</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8">
                <a href="#features" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">Features</a>
                <a href="#how-it-works" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">How It Works</a>
                <a href="#demo" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">Demo</a>
                <a href="#faq" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">FAQ</a>
                <a href="#" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">Terms of Service</a>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Pitch Perfect. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-[#C41E3A] transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#C41E3A] transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands" className="text-gray-400 hover:text-[#C41E3A] transition-colors">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3846-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Add CSS for the grid pattern */}
        <style jsx>{`
          .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(196, 30, 58, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(196, 30, 58, 0.1) 1px, transparent 1px);
            background-size: 24px 24px;
          }
        `}</style>
      </main>
    </>
  );
}