import React, { useRef, useEffect } from "react";

export default function WebcamView({ streamActive, onStreamReady }) {
  const videoRef = useRef();

  useEffect(() => {
    if (streamActive && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
        videoRef.current.srcObject = stream;
        if (onStreamReady) onStreamReady(stream);
      });
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [streamActive, onStreamReady]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ width: "210px", height: "160px", borderRadius: "18px", background: "#22283b", margin: "8px 0" }}
    />
  );
}