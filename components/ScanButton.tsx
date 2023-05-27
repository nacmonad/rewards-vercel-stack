import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from '@zxing/browser';


const ScanButton = () => {
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleSuccess = (stream) => {
    videoRef.current.srcObject = stream;
    streamRef.current = stream; // Store the stream reference

    const codeReader = new BrowserQRCodeReader();
    codeReader.decodeFromVideoElement(videoRef.current, (result, error) => {
        if (result) {
        // QR code successfully decoded, do something with the result
        console.log('QR code result:', result.getText());
        } else if (error) {
        // Error occurred while decoding QR code
        console.error('Error decoding QR code:', error);
        }
    });
  };

  const handleError = (error) => {
    console.error("Error accessing camera:", error);
  };

  const stopScanner = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null; // Clear the stream reference
    }
    setIsScanning(false)
  };

  const startScanner = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
      setIsScanning(true)
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    // // Start the scanner when the component mounts
    // startScanner();

    // Clean up the video stream when the component unmounts
    return () => {
      const videoStream = videoRef.current.srcObject;
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      {!isScanning && <button onClick={startScanner}>Scan</button>}
      {isScanning &&  <button onClick={stopScanner}>Cancel</button>}
      
      <video style={{display: isScanning ? 'block' : 'none'}} ref={videoRef} autoPlay playsInline />

    </div>
  );
};

export default ScanButton;
