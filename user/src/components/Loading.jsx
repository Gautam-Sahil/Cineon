import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {
  const { nexturl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nexturl) {
      const timer = setTimeout(() => {
        navigate('/' + nexturl);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [nexturl, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      {/* Neon Spinner */}
      <div className="relative flex justify-center items-center mb-6">
        <div className="w-16 h-16 border-4 border-t-[#A992F2] border-pink-600 border-solid rounded-full animate-spin shadow-[0_0_15px_#A992F2]"></div>
        <div className="absolute text-white font-bold tracking-wide text-lg animate-pulse">🎬</div>
      </div>

      {/* Bouncing Dots */}
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-[#A992F2] rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-[#DFAB9B] rounded-full animate-bounce animation-delay-200"></span>
        <span className="w-3 h-3 bg-[#A992F2] rounded-full animate-bounce animation-delay-400"></span>
      </div>

      <p className="text-white mt-6 text-center text-sm md:text-base opacity-80">
        Loading your cinematic experience...
      </p>
    </div>
  );
};

export default Loading;
