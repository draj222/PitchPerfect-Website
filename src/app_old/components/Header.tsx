import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="fixed w-full z-50 bg-black bg-opacity-80 backdrop-blur-sm py-4">
      <div className="container-custom flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/logo.svg" 
              alt="Pitch Perfect Logo" 
              width={40} 
              height={40}
              className="w-10 h-10" 
            />
            <span className="font-bold text-xl">Pitch Perfect</span>
          </div>
        </Link>
        
        <nav>
          <ul className="flex space-x-8">
            <li>
              <motion.a 
                href="#features" 
                className="hover:text-[#C41E3A] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Features
              </motion.a>
            </li>
            <li>
              <motion.a 
                href="#how-it-works" 
                className="hover:text-[#C41E3A] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                How It Works
              </motion.a>
            </li>
            <li>
              <motion.a 
                href="#privacy" 
                className="hover:text-[#C41E3A] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Privacy
              </motion.a>
            </li>
            <li>
              <motion.a 
                href="#faq" 
                className="hover:text-[#C41E3A] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                FAQ
              </motion.a>
            </li>
          </ul>
        </nav>
        
        <motion.a 
          href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary hidden md:block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add to Discord
        </motion.a>
      </div>
    </header>
  );
};

export default Header; 