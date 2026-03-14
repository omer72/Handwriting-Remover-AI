
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Handwriting Remover AI</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clean up your documents with a single click</p>
            </div>
        </div>
      </div>
    </header>
  );
};
