import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  const policies = [
    {
      title: 'Audio Recordings',
      description: 'Your audio is processed securely and temporarily stored only for the duration needed to provide feedback.',
    },
    {
      title: 'Data Usage',
      description: 'We use your recordings solely to generate pitch feedback and never share your data with third parties.',
    },
    {
      title: 'API Integration',
      description: 'We use OpenAI\'s Whisper API for transcription and GPT-4 for analysis, adhering to their privacy standards.',
    },
    {
      title: 'Security Measures',
      description: 'All communications are encrypted and we follow industry best practices to protect your information.',
    },
  ];

  return (
    <section id="privacy" className="py-20 bg-gradient-to-b from-black/70 to-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Privacy & <span className="text-[#C41E3A]">Security</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We take your privacy seriously. Here's how we protect your data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              className="bg-black/40 border border-gray-800 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <span className="text-[#C41E3A] mr-2">✓</span>
                {policy.title}
              </h3>
              <p className="text-gray-300">{policy.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-gray-300">
            For more details, please review our complete
            <a href="#" className="text-[#C41E3A] hover:underline ml-1">Privacy Policy</a> and
            <a href="#" className="text-[#C41E3A] hover:underline ml-1">Terms of Service</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Privacy; 