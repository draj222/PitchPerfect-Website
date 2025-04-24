import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-28 pb-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Perfect Your Pitch with <span className="text-[#C41E3A]">AI Feedback</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Practice and improve your pitch presentations with instant AI-powered feedback right on Discord.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a 
                href="https://discord.com/oauth2/authorize?client_id=1364144204359401522&permissions=3147776&integration_type=0&scope=bot+applications.commands"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add to Discord
              </motion.a>
              
              <motion.a 
                href="#how-it-works"
                className="btn-secondary text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/images/logo.svg"
                alt="Pitch Perfect Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 