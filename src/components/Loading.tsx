import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/Animation - 1721629855151.json';

interface LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, children }) => {
  return (
    <div className={`relative overflow-auto ${isLoading ? 'no-scroll' : ''}`}>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50 pointer-events-none">
          <Lottie animationData={animationData} style={{ height: 200, width: 200 }} />
        </div>
      )}
      <div className={isLoading ? 'pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Loading;
