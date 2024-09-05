import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForbiddenError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-4">
        Forbidden
      </h1>
      <p className="text-xl font-medium text-gray-800 mb-2">403 - ACCESS DENIED</p>
      <p className="text-lg text-gray-600 mb-8">
        You do not have permission to view this page. Please check your credentials or contact the site administrator.
      </p>
      <button
        onClick={() => navigate('/homepage')}
        className="px-6 py-3 text-lg font-semibold text-white bg-[#FF6B6B] rounded-md hover:bg-red-600"
      >
        GO TO HOMEPAGE
      </button>
    </div>
  );
}

export default ForbiddenError;
