import React from 'react';

export default function Test() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Pitch Perfect Test Page</h1>
      <p className="text-lg mb-6">If you can see this page, Next.js is working!</p>
      <img src="/logo.svg" alt="Pitch Perfect Logo" className="w-40 h-40" />
      <a 
        href="/"
        className="mt-8 bg-[#C41E3A] hover:bg-[#a01930] text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
      >
        Go to Home Page
      </a>
    </div>
  );
}