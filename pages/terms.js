import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - Pitch Perfect</title>
        <meta name="description" content="Terms of Service for the Pitch Perfect Discord bot." />
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
                <li><Link href="/terms" className="text-[#C41E3A] transition-colors text-sm font-medium">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-[#C41E3A] transition-colors text-sm font-medium">Privacy</Link></li>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-gray-400 mb-4">Last Updated: April 24, 2025</p>
          </div>
          
          <div className="space-y-10 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
              <p className="mb-4">
                Welcome to Pitch Perfect ("we," "us," "our"). By accessing or using our Discord bot service ("Pitch Perfect", "Service"), 
                you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service, 
                you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Service Description</h2>
              <p className="mb-4">
                Pitch Perfect is a Discord bot designed to help users practice and improve their pitching skills. The Service allows 
                users to record their pitches in Discord voice channels, receive transcriptions of their recordings, and get AI-powered 
                feedback on their delivery and content.
              </p>
              <p>
                The Service utilizes artificial intelligence technologies, including but not limited to OpenAI's models, 
                to process voice recordings and provide feedback.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Discord Integration</h2>
              <p className="mb-4">
                Our Service is integrated with the Discord platform and is subject to Discord's Terms of Service 
                and Community Guidelines. By using our Service, you acknowledge and agree that you will comply with 
                Discord's terms and policies in addition to ours.
              </p>
              <p className="mb-4">
                When you add Pitch Perfect to your Discord server, you grant us the permissions necessary to provide our services, 
                including but not limited to accessing voice channels, reading and sending messages, and interacting with server members.
              </p>
              <p>
                We are not affiliated with, endorsed by, or sponsored by Discord Inc. Discord and its logo are trademarks of Discord Inc.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. User Accounts and Eligibility</h2>
              <p className="mb-4">
                To use our Service, you must have a valid Discord account and be at least 13 years of age or the minimum age 
                required in your country to use Discord and our Service.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your Discord account and for all activities that occur 
                under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Voice Recording Consent</h2>
              <p className="mb-4">
                By using our Service to record your voice, you understand and consent to the following:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your voice will be recorded when you use specific recording commands</li>
                <li>Your recordings will be processed by our systems and third-party AI services</li>
                <li>Transcriptions of your recordings will be generated and stored</li>
                <li>AI-powered feedback will be generated based on your recordings</li>
              </ul>
              <p className="mb-4">
                You must obtain consent from all parties before recording their voices. Do not record others without their knowledge and consent.
                You are solely responsible for obtaining any necessary consent from individuals whose voices may be recorded.
              </p>
              <p>
                Please refer to our Privacy Policy for more information on how we handle and store your voice recordings and transcriptions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. User Content and Conduct</h2>
              <p className="mb-4">
                You are solely responsible for the content of your recordings and any other information you provide through the Service. 
                You agree not to use the Service for any illegal or unauthorized purpose and to comply with all applicable laws.
              </p>
              <p className="mb-4">
                Specifically, you agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Use the Service to record, transmit, or distribute any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another's privacy, or otherwise objectionable</li>
                <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>Attempt to gain unauthorized access to any portion of the Service or any systems or networks connected to the Service</li>
                <li>Use the Service for any commercial purposes without our express written consent</li>
                <li>Engage in any activity that could disable, overburden, damage, or impair the Service</li>
              </ul>
              <p>
                We reserve the right to remove any content that violates these Terms or is otherwise objectionable, 
                as determined in our sole discretion.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">7. Intellectual Property</h2>
              <p className="mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of 
                Pitch Perfect and its licensors. The Service is protected by copyright, trademark, and other laws of both the 
                United States and foreign countries.
              </p>
              <p className="mb-4">
                You retain your rights to any content you submit, post, or display on or through the Service. By submitting, 
                posting, or displaying content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free 
                license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display 
                such content in connection with providing the Service.
              </p>
              <p>
                This license is solely for the purpose of enabling us to operate, improve, and promote the Service, 
                and it does not grant us the right to sell your content or use it for purposes unrelated to the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">8. Disclaimer of Warranties</h2>
              <p className="mb-4">
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, 
                including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p className="mb-4">
                We do not warrant that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>The Service will function uninterrupted, secure, or available at any particular time or location</li>
                <li>Any errors or defects will be corrected</li>
                <li>The Service is free of viruses or other harmful components</li>
                <li>The results of using the Service will meet your requirements</li>
                <li>The accuracy, reliability, or quality of any information, content, or service obtained through the Service will meet your expectations</li>
              </ul>
              <p>
                The feedback provided by our AI system is generated automatically and should be used for informational purposes only. 
                We do not guarantee the accuracy, quality, or appropriateness of the feedback.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">9. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall Pitch Perfect, its officers, directors, employees, or agents, be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>The accuracy, quality, or content of feedback provided by our AI system</li>
              </ul>
              <p>
                This limitation of liability shall apply to the fullest extent permitted by law in the applicable jurisdiction.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">10. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Pitch Perfect and its officers, directors, employees, and agents, 
                from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including 
                but not limited to attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your use of and access to the Service</li>
                <li>Your violation of any term of these Terms</li>
                <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
                <li>Any claim that your content caused damage to a third party</li>
              </ul>
              <p>
                This defense and indemnification obligation will survive these Terms and your use of the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">11. Service Changes and Termination</h2>
              <p className="mb-4">
                We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) 
                with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or 
                discontinuance of the Service.
              </p>
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach these Terms. All provisions of these 
                Terms which by their nature should survive termination shall survive termination, including, without limitation, 
                ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">12. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to 
                its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered 
                a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the 
                remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us 
                regarding our Service, and supersede and replace any prior agreements we might have had between us regarding the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">13. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
                we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will 
                be determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. 
                If you do not agree to the new terms, you are no longer authorized to use the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">14. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>By email: <a href="mailto:terms@pitch-perfect.app" className="text-[#C41E3A] hover:underline">terms@pitch-perfect.app</a></li>
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
                <a href="https://twitter.com/PitchPerfectBot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C41E3A] transition-colors p-2">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://github.com/pitch-perfect-app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C41E3A] transition-colors p-2">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=36702208&integration_type=0&scope=applications.commands+bot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C41E3A] transition-colors p-2">
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