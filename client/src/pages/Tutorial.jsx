import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { NavbarDefault } from '../components/Navbar';

const Tutorial = () => {
    const videoRef = useRef(null);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        // Access webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(err => {
                console.error("Error accessing webcam: ", err);
            });
    }, []);

    // Function to capture video frame
    const captureFrame = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    };

    // Send frame to the backend for prediction
    const sendFrameForPrediction = async () => {
        const frame = captureFrame();
        try {
            const response = await axios.post('http://localhost:8000/predict/', {
                input_image: frame,
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error in prediction:', error);
        }
    };

    // Automatically send frames every X milliseconds
    useEffect(() => {
        const interval = setInterval(() => {
            sendFrameForPrediction();
        }, 1000); // Adjust frame sending interval (in ms) for real-time processing

        return () => clearInterval(interval);  // Cleanup interval on component unmount
    }, []);

    return (
        <div>
          <NavbarDefault/>
            <div className='flex flex-col justify-center items-center'>
            <video className='flex justify-center' ref={videoRef} width="640" height="480" />
            <div>
                {prediction ? (
                    <p>Prediction: {prediction}</p>
                ) : (
                    <p>Waiting for prediction...</p>
                )}
            </div>
            </div>
        </div>
    );
};

export default Tutorial;
