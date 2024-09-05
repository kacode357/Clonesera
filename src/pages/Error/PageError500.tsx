import React from 'react';
import { useNavigate } from 'react-router-dom';

const InternalServerError: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 mb-4">
                Server Error
            </h1>
            <p className="text-xl font-medium text-gray-800 mb-2">500 - INTERNAL SERVER ERROR</p>
            <p className="text-lg text-gray-600 mb-8">
                Something went wrong on our end. Please try again later or contact support if the issue persists.
            </p>
            <button
                onClick={() => navigate('/homepage')}
                className="px-6 py-3 text-lg font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
            >
                GO TO HOMEPAGE
            </button>
        </div>
    );
}

export default InternalServerError;
