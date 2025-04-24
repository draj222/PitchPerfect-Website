import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <span className={`text-[#C41E3A] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pt-4 pb-2 text-gray-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: 'What is Pitch Perfect?',
      answer: 'Pitch Perfect is a Discord bot that helps you practice and improve your pitch presentations through AI-powered feedback. It records your pitch, transcribes it, and provides detailed analysis on content, delivery, and structure.',
    },
    {
      question: 'How does the recording process work?',
      answer: 'When you use the /startpitch command, the bot will prompt you to start recording. After you start, it will capture your voice through Discord\'s voice channels for up to 5 minutes. You can stop the recording anytime by clicking the stop button.',
    },
    {
      question: 'Is there a limit to how many pitches I can record?',
      answer: 'Free tier users can record up to 3 pitches per day, with a maximum duration of 5 minutes each. Premium users get unlimited recordings and extended durations up to 15 minutes.',
    },
    {
      question: 'What technical requirements are needed?',
      answer: 'You need a Discord account, a microphone, and permissions to add bots to your server. The bot works best in a quiet environment with minimal background noise for optimal recording quality.',
    },
    {
      question: 'How accurate is the AI feedback?',
      answer: 'Our AI feedback system uses state-of-the-art models from OpenAI, including Whisper for transcription and GPT-4 for analysis. While very accurate, it\'s designed to complement human feedback rather than replace it completely.',
    },
  ];

  return (
    <section id="faq" className="py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Frequently Asked <span className="text-[#C41E3A]">Questions</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about Pitch Perfect.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-gray-300">
            Can't find what you're looking for?
            <a href="#contact" className="text-[#C41E3A] hover:underline ml-1">Contact our support team</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 