import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from '@zxing/browser';
import { NotFoundException, ChecksumException, FormatException } from "@zxing/library";


const ScanButton = () => {
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleSuccess = (stream) => {
    videoRef.current.srcObject = stream;
    streamRef.current = stream; // Store the stream reference

    const codeReader = new BrowserQRCodeReader();
    try {
        codeReader.decodeFromVideoElement(videoRef.current, (result, error) => {
            if(error) {
                if (error instanceof NotFoundException) {
                    console.log('No QR code found.')
                  }
            
                  if (error instanceof ChecksumException) {
                    console.log('A code was found, but it\'s read value was not valid.')
                  }
            
                  if (error instanceof FormatException) {
                    console.log('A code was found, but it was in a invalid format.')
                  }
            }
            if (result) {
            let pathname = result.getText();           
            pathname = pathname.replaceAll('"', '');
            window.location.href= pathname
            }
            //ignore errors
        });
    } catch(e) {
        console.error("ignorethis:", e)
    }
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
      const constraints = { video: true, facingMode: "environment" };
      
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
