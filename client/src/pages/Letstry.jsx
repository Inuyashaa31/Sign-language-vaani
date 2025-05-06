import React, { useEffect } from 'react';
import { NavbarDefault } from '../components/Navbar';
import '../scss/Letstry.scss';

function Letstry() {
  const stopStream = async () => {
    try {
      await fetch("http://localhost:5000/stop_video_feed", {
        method: "POST",
      });
    } catch (err) {
      console.error("Error stopping video feed", err);
    }
  };

  useEffect(() => {
    return () => {
      stopStream(); // Cleanup on unmount
    };
  }, []);

  return (
    <div class="letstry-page-wrapper">
      <NavbarDefault />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Sign Language Detection</h1>
        <img
          src="http://localhost:5000/video_feed"
          alt="Sign Language Detection Feed"
          className="w-[640px] h-[480px] border rounded-lg shadow-lg"
        />
        <button
          onClick={stopStream}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default Letstry;
