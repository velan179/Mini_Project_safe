import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const EVIDENCE_PHOTOS_KEY = "evidenceCapturedPhotos";

export default function EvidenceCamera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraError, setCameraError] = useState("");
  const [capturedPhoto, setCapturedPhoto] = useState("");

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        setCameraError(
          "Camera access was blocked or unavailable. Please allow camera permission to continue."
        );
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedPhoto(canvas.toDataURL("image/jpeg", 0.92));
    stopCamera();
  };

  const usePhoto = () => {
    if (!capturedPhoto) {
      return;
    }

    const nextPhoto = {
      id: Date.now(),
      src: capturedPhoto,
      name: `evidence-${new Date().toISOString().replace(/[:.]/g, "-")}.jpg`,
    };

    const existingPhotos = JSON.parse(
      sessionStorage.getItem(EVIDENCE_PHOTOS_KEY) || "[]"
    );

    sessionStorage.setItem(
      EVIDENCE_PHOTOS_KEY,
      JSON.stringify([...existingPhotos, nextPhoto])
    );
    navigate("/evidence");
  };

  const retakePhoto = async () => {
    setCapturedPhoto("");
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      setCameraError(
        "Camera access was blocked or unavailable. Please allow camera permission to continue."
      );
    }
  };

  return (
    <div style={container}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={topBar}>
        <button style={backBtn} onClick={() => navigate("/evidence")}>
          ← Back
        </button>
        <div>
          <h1 style={title}>Camera Capture</h1>
          <p style={subtitle}>Adjust the angle and capture evidence clearly.</p>
        </div>
      </div>

      {cameraError && <p style={errorText}>{cameraError}</p>}

      {!capturedPhoto ? (
        <div style={cameraShell}>
          <video ref={videoRef} autoPlay playsInline muted style={videoStyle} />
          <div style={guideFrame} />
        </div>
      ) : (
        <div style={cameraShell}>
          <img
            src={capturedPhoto}
            alt="Captured evidence"
            style={videoStyle}
          />
        </div>
      )}

      <div style={hintBox}>
        {!capturedPhoto
          ? "Camera is ready. Hold steady and adjust the frame before capturing."
          : "Photo captured. Retake if you want a clearer angle."}
      </div>

      <div style={actions}>
        {!capturedPhoto ? (
          <button style={captureBtn} onClick={capturePhoto}>
            Capture Photo
          </button>
        ) : (
          <>
            <button style={captureBtn} onClick={usePhoto}>
              Use This Photo
            </button>
            <button style={secondaryBtn} onClick={retakePhoto}>
              Retake Photo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  padding: "24px 20px 40px",
  background:
    "linear-gradient(180deg, rgba(2,6,23,1), rgba(15,23,42,0.98))",
  color: "white",
  fontFamily: "Segoe UI, system-ui, sans-serif",
};

const topBar = {
  maxWidth: 900,
  margin: "0 auto 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const backBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.45)",
  color: "white",
  padding: "10px 18px",
  borderRadius: 999,
  cursor: "pointer",
};

const title = {
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
};

const subtitle = {
  margin: "6px 0 0",
  opacity: 0.82,
  fontSize: 14,
};

const errorText = {
  maxWidth: 900,
  margin: "0 auto 16px",
  color: "#fca5a5",
  textAlign: "center",
};

const cameraShell = {
  position: "relative",
  maxWidth: 900,
  margin: "0 auto",
  borderRadius: 28,
  overflow: "hidden",
  background: "#020617",
  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
};

const videoStyle = {
  width: "100%",
  display: "block",
  minHeight: 320,
  objectFit: "cover",
  background: "#020617",
};

const guideFrame = {
  position: "absolute",
  inset: "12% 10%",
  border: "3px solid rgba(255,255,255,0.75)",
  borderRadius: 24,
  boxShadow: "0 0 0 9999px rgba(0,0,0,0.18)",
  pointerEvents: "none",
};

const hintBox = {
  maxWidth: 900,
  margin: "18px auto 0",
  textAlign: "center",
  opacity: 0.82,
  fontSize: 14,
};

const actions = {
  maxWidth: 900,
  margin: "24px auto 0",
  display: "flex",
  justifyContent: "center",
  gap: 14,
  flexWrap: "wrap",
};

const captureBtn = {
  padding: "16px 30px",
  borderRadius: 999,
  border: "none",
  background: "#f97316",
  color: "white",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
  boxShadow: "0 16px 40px rgba(249,115,22,0.35)",
};

const secondaryBtn = {
  padding: "14px 26px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.45)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
};
