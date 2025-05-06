import React, { useRef, useState, useEffect } from "react";
import { NavbarDefault } from "../components/Navbar";

function Tutorial() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("");
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    startVideo();
    const id = setInterval(captureFrame, 1000); // Capture frame every second
    setIntervalId(id);
    return () => stopVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  const stopVideo = () => {
    if (intervalId) clearInterval(intervalId);
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg"); // Convert frame to base64
    sendFrameToBackend(imageData);
  };

  const sendFrameToBackend = async (frame) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict_alphabet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame }),
      });
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error sending frame:", error);
    }
  };

  return (
    <div>
      <div>
        <NavbarDefault />
      </div>
      <div className="flex justify-center w-full text-4xl font-bold mt-[35px]">
        <h1>Sign Language Detection</h1>
      </div>
      <div className="flex gap-24">
        <div className="flex flex-col w-1/3 justify-center items-center">
          <video ref={videoRef} autoPlay playsInline width="640" height="480" />
          <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />

          <button onClick={stopVideo} className="mt-2 px-4 py-2 w-1/3 bg-red-600 text-white rounded">
            Stop
          </button>
        </div>
        <div className="flex flex-col w-1/3 justify-center items-center">
          <h3 className="font-bold text-2xl">Prediction</h3>
          <h1 className="text-9xl h-[128px]">{prediction}</h1>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
