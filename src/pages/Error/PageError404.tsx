import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4">
        Oops!
      </h1>
      <p className="text-xl font-medium text-gray-800 mb-2">404 - PAGE NOT FOUND</p>
      <p className="text-lg text-gray-600 mb-8">
        The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate('/homepage')}
        className="px-6 py-3 text-lg font-semibold text-white bg-[#6C6EDD] rounded-md hover:bg-indigo-600"
      >
        GO TO HOMEPAGE
      </button>
    </div>
  )
}

export default PageError
