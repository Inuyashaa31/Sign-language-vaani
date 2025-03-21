import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function Letstry() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [predictedText, setPredictedText] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let captureInterval = useRef(null);

  const startCamera = async () => {
    setIsCameraOn(true);
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }

    // Start capturing frames every 500ms
    captureInterval.current = setInterval(captureFrame, 500);
  };

  const stopCamera = () => {
    setIsCameraOn(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }

    clearInterval(captureInterval.current);
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas image to base64
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("image", blob);

      // Send frame to Flask backend
      axios
        .post("http://127.0.0.1:5000/predict", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          setPredictedText(response.data.prediction);
        })
        .catch((error) => console.error("Error sending frame:", error));
    }, "image/jpeg");
  };

  return (
    <div>
         <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Sign Language Detector</h2>

      <button onClick={startCamera} disabled={isCameraOn} style={{ marginRight: "10px" }}>
        Start Camera
      </button>

      <button onClick={stopCamera} disabled={!isCameraOn}>
        Stop Camera
      </button>

      <div style={{ marginTop: "20px" }}>
        <video ref={videoRef} autoPlay playsInline hidden={!isCameraOn} style={{ width: "640px" }} />
        <canvas ref={canvasRef} hidden />
      </div>

      <h3>Prediction: {predictedText}</h3>
    </div>



    </div>
  )

}



export default Letstry