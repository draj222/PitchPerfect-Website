import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Pitch Perfect</title>
        <meta name="description" content="Privacy Policy for the Pitch Perfect Discord bot." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23000%22 stroke=%22%23C41E3A%22 stroke-width=%228%22/><path d=%22M50 75C42 75 35 68 35 60V40C35 32 42 25 50 25C58 25 65 32 65 40V60C65 68 58 75 50 75Z%22 fill=%22%23C41E3A%22/><rect x=%2240%22 y=%2235%22 width=%2220%22 height=%225%22 rx=%222%22 fill=%22%23000%22/><rect x=%2240%22 y=%2245%22 width=%2220%22 height=%225%22 rx=%222%22 fill=%22%23000%22/><rect x=%2240%22 y=%2255%22 width=%2220%22 height=%225%22 rx=%222%22 fill=%22%23000%22/></svg>" />
      </Head>
      
      <main className="min-h-screen bg-black text-white">
        {/* Background elements */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-[#C41E3A]/30 to-transparent rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-br from-[#C41E3A]/30 to-transparent rounded-full blur-3xl opacity-20"></div>
        </div>
        
        {/* Top left corner logo */}
        <Link href="/" className="fixed top-0 left-8 z-[100] bg-[#C41E3A] px-6 py-3 rounded-b-xl shadow-xl hover:bg-[#a01930] transition-colors duration-300 flex items-center gap-3 border-b-4 border-l-2 border-r-2 border-black">
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
        </Link>
        
        {/* Header */}
        <header className="fixed w-full z-50 bg-black/80 backdrop-blur-lg py-4 border-b border-[#C41E3A]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3 ml-36 md:ml-32">
              <span className="font-bold text-xl hidden">Pitch Perfect</span>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><Link href="/#features" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">Features</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">How It Works</Link></li>
                <li><Link href="/#demo" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">Demo</Link></li>
                <li><Link href="/#faq" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">Terms</Link></li>
                <li><Link href="/privacy" className="text-[#C41E3A] transition-colors text-sm font-medium">Privacy</Link></li>
              </ul>
            </nav>
            
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=36702208&integration_type=0&scope=applications.commands+bot"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-2 px-4 rounded-md transition-all duration-300 text-sm hidden md:block relative overflow-hidden"
            >
              <span className="relative z-10">Add to Discord</span>
              <span className="absolute inset-0 bg-white/10 transform translate-y-full hover:translate-y-0 transition-transform duration-300"></span>
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-gray-400 mb-4">Last Updated: April 24, 2025</p>
          </div>
          
          <div className="space-y-10 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
              <p className="mb-4">
                At Pitch Perfect ("we", "us", "our"), we are committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our Discord bot service 
                ("Pitch Perfect", "Service").
              </p>
              <p>
                Please read this Privacy Policy carefully. By using the Service, you consent to the data practices described 
                in this statement. If you do not agree with the practices described in this policy, please do not use the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Information We Collect</h2>
              <p className="mb-4">We collect several types of information for various purposes to provide and improve our Service:</p>
              
              <h3 className="text-xl font-semibold mb-3 text-white">2.1 Personal Information</h3>
              <p className="mb-4">
                While using our Service, we may ask you to provide certain personally identifiable information that can be used 
                to contact or identify you ("Personal Information"). This information includes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Discord User ID</li>
                <li>Discord Server ID</li>
                <li>Discord Username</li>
                <li>Audio recordings of your voice when you use the pitch recording feature</li>
                <li>Transcriptions of your pitch recordings</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 text-white">2.2 Usage Data</h3>
              <p className="mb-4">
                We may also collect information about how the Service is accessed and used ("Usage Data"). This may include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Commands used</li>
                <li>Frequency of usage</li>
                <li>Duration of voice recordings</li>
                <li>Time and date of usage</li>
                <li>Technical information about how you access our Service (device, browser type, IP address)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 text-white">2.3 Discord Permissions</h3>
              <p>
                When you add Pitch Perfect to your Discord server, we request specific permissions that allow our bot to 
                function properly. These permissions include access to voice channels, message reading and sending capabilities, 
                and other functionalities necessary for the Service to operate.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for various purposes, including to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide and maintain our Service</li>
                <li>Process your voice recordings to generate transcripts and feedback</li>
                <li>Improve and personalize your experience with the Service</li>
                <li>Track usage of the Service</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Provide customer support</li>
                <li>Communicate with you about Service-related matters</li>
                <li>Develop and improve our AI models for better feedback generation</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Data Processing and Storage</h2>
              <p className="mb-4">
                Your voice recordings are processed in real-time to provide you with transcription and feedback. 
                The processing involves several steps:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your voice is recorded through Discord's voice channels</li>
                <li>The recording is processed by our transcription service (OpenAI Whisper)</li>
                <li>The transcript is analyzed by our AI system (GPT-4) to generate feedback</li>
                <li>The feedback is delivered back to you in Discord</li>
              </ul>
              <p className="mb-4">
                By default, we store your voice recordings and transcripts for 30 days to allow you to review and 
                access your past sessions. After this period, the data is automatically deleted from our servers.
              </p>
              <p>
                We use industry-standard security measures to protect your data while it's being processed and stored.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Data Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information in the following situations:</p>
              
              <h3 className="text-xl font-semibold mb-3 text-white">5.1 Service Providers</h3>
              <p className="mb-4">
                We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), 
                to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing 
                how our Service is used. These third parties have access to your Personal Information only to perform 
                these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
              <p className="mb-4">Our Service Providers include:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>OpenAI (for transcription and AI analysis)</li>
                <li>Cloud hosting providers</li>
                <li>Analytics services</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 text-white">5.2 Legal Requirements</h3>
              <p>
                We may disclose your Personal Information if required to do so by law or in response to valid requests 
                by public authorities (e.g., a court or a government agency).
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. Data Security</h2>
              <p className="mb-4">
                The security of your data is important to us. We strive to use commercially acceptable means to protect 
                your Personal Information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Using encryption for data in transit</li>
                <li>Limiting access to your data to only those employees who need it</li>
                <li>Regular security audits</li>
                <li>Implementing standard security practices</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or method of electronic storage is 100% secure. 
                While we strive to use commercially acceptable means to protect your Personal Information, we cannot 
                guarantee its absolute security.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">7. Your Data Protection Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information. These may include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Access:</strong> You have the right to request copies of your personal information.</li>
                <li><strong>Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                <li><strong>Erasure:</strong> You have the right to request that we erase your personal information, under certain conditions.</li>
                <li><strong>Restrict processing:</strong> You have the right to request that we restrict the processing of your personal information, under certain conditions.</li>
                <li><strong>Object to processing:</strong> You have the right to object to our processing of your personal information, under certain conditions.</li>
                <li><strong>Data portability:</strong> You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
              <p className="mb-4">
                To exercise any of these rights, please contact us at <a href="mailto:privacy@pitch-perfect.app" className="text-[#C41E3A] hover:underline">privacy@pitch-perfect.app</a>.
              </p>
              <p>
                We will respond to your request within 30 days. In some cases, we may not be able to fulfill your request, 
                but we will provide an explanation if that is the case.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">8. Children's Privacy</h2>
              <p className="mb-4">
                Our Service is not intended for anyone under the age of 13 ("Children"). We do not knowingly collect 
                personally identifiable information from anyone under the age of 13. If you are a parent or guardian 
                and you are aware that your child has provided us with Personal Information, please contact us.
              </p>
              <p>
                If we become aware that we have collected Personal Information from children without verification of 
                parental consent, we take steps to remove that information from our servers.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">9. Links to Other Sites</h2>
              <p>
                Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, 
                you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every 
                site you visit. We have no control over and assume no responsibility for the content, privacy policies, or 
                practices of any third-party sites or services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">10. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
                are effective when they are posted on this page.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">11. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>By email: <a href="mailto:privacy@pitch-perfect.app" className="text-[#C41E3A] hover:underline">privacy@pitch-perfect.app</a></li>
                <li>By visiting the contact section on our website</li>
              </ul>
            </section>
          </div>
        </div>

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
                <Link href="/#features" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">Features</Link>
                <Link href="/#how-it-works" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">How It Works</Link>
                <Link href="/#demo" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">Demo</Link>
                <Link href="/#faq" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">FAQ</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">Terms of Service</Link>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Pitch Perfect. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="https://twitter.com/PitchPerfectBot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C41E3A] transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://github.com/pitch-perfect-app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C41E3A] transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=36702208&integration_type=0&scope=applications.commands+bot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C41E3A] transition-colors">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3846-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
} 