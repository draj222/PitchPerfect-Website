import React from 'react';
import { motion } from 'framer-motion';

// Feature card component
const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => {
  return (
    <motion.div 
      className="bg-black/40 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center"
      whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(196, 30, 58, 0.3)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-4xl mb-4 text-[#C41E3A]">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: '🎙️',
      title: 'Voice Recording',
      description: 'Record your pitch directly within Discord with high-quality audio capture and processing.',
    },
    {
      icon: '✍️',
      title: 'AI Transcription',
      description: 'Powerful Whisper API automatically converts your speech to text with remarkable accuracy.',
    },
    {
      icon: '🧠',
      title: 'GPT-4 Analysis',
      description: 'Advanced AI evaluates your pitch content, structure, clarity, and persuasiveness.',
    },
    {
      icon: '📊',
      title: 'Detailed Feedback',
      description: 'Receive constructive feedback on delivery, pacing, clarity, and areas for improvement.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-black to-black/70">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Powerful <span className="text-[#C41E3A]">Features</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to perfect your pitch is right at your fingertips.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 