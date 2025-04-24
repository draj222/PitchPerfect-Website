import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Step = ({ number, title, description }: { number: number, title: string, description: string }) => {
  return (
    <motion.div 
      className="flex gap-5"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: number * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-[#C41E3A] flex items-center justify-center text-xl font-bold">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: 'Add Bot to Server',
      description: 'Invite Pitch Perfect to your Discord server with just a few clicks.',
    },
    {
      title: 'Start Recording',
      description: 'Use the /startpitch command to begin your pitch recording session.',
    },
    {
      title: 'Practice Your Pitch',
      description: 'Deliver your pitch presentation while Discord records your voice.',
    },
    {
      title: 'Receive Feedback',
      description: 'Get comprehensive AI-powered feedback on your pitch content, delivery, and structure.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="section-title">How It <span className="text-[#C41E3A]">Works</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Perfecting your pitch is just a few simple steps away.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center">
          <div className="md:w-1/2 space-y-10">
            {steps.map((step, index) => (
              <Step
                key={index}
                number={index + 1}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          <motion.div
            className="md:w-1/2 bg-black/40 border border-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 