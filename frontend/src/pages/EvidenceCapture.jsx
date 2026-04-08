import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const EVIDENCE_PHOTOS_KEY = "evidenceCapturedPhotos";

export default function EvidenceCapture() {
  const navigate = useNavigate();
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [audioPreview, setAudioPreview] = useState("");
  const [audioName, setAudioName] = useState("");
  const [audioError, setAudioError] = useState("");

  useEffect(() => {
    const savedPhotos = JSON.parse(
      sessionStorage.getItem(EVIDENCE_PHOTOS_KEY) || "[]"
    );
    setCapturedPhotos(savedPhotos);
  }, []);

  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

  const hasPhoto = capturedPhotos.length > 0;
  const hasAudio = Boolean(audioPreview);
  const latestPhoto = hasPhoto ? capturedPhotos[capturedPhotos.length - 1] : null;
  const olderPhotos = hasPhoto ? capturedPhotos.slice(0, -1).reverse() : [];

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setAudioError("Voice recording is not supported in this browser.");
      return;
    }

    setAudioError("");
    setUploaded(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      audioStreamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        if (audioPreview) {
          URL.revokeObjectURL(audioPreview);
        }

        const nextAudioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(nextAudioUrl);
        setAudioName(
          `voice-note-${new Date().toISOString().replace(/[:.]/g, "-")}.webm`
        );

        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
      };

      mediaRecorder.start();
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((current) => current + 1);
      }, 1000);
      setRecording(true);
    } catch (error) {
      setAudioError(
        "Microphone access was blocked or unavailable. Please allow microphone permission and try again."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setRecording(false);
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
      return;
    }

    startRecording();
  };

  const resetEvidenceCapture = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }

    sessionStorage.removeItem(EVIDENCE_PHOTOS_KEY);

    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
    setRecording(false);
    setRecordingSeconds(0);
    setUploaded(false);
    setCapturedPhotos([]);
    setAudioPreview("");
    setAudioName("");
    setAudioError("");
  };

  const formatRecordingTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div style={container}>
      <div style={ambientGlowOne}></div>
      <div style={ambientGlowTwo}></div>

      <div style={shell}>
        <div style={heroRow}>
          <div>
            <p style={eyebrow}>Evidence Studio</p>
            <h1 style={title}>Evidence Capture</h1>
            <p style={subTitle}>
              Capture visual proof, record voice, and keep everything ready in
              one screen.
            </p>
          </div>

          <div style={actions}>
            <button style={actionBtn} onClick={() => navigate("/evidence/camera")}>
              📸 Take Photo
            </button>
            <button
              style={recording ? actionBtnActive : actionBtn}
              onClick={toggleRecording}
            >
              🎙 {recording ? "Stop Recording" : "Start Recording"}
            </button>
            <button
              style={{
                ...uploadBtn,
                opacity: hasPhoto || hasAudio ? 1 : 0.55,
                cursor: hasPhoto || hasAudio ? "pointer" : "not-allowed",
              }}
              onClick={() => setUploaded(hasPhoto || hasAudio)}
              disabled={!hasPhoto && !hasAudio}
            >
              ☁️ Upload Securely
            </button>
            <button style={refreshBtn} onClick={resetEvidenceCapture}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {audioError && <p style={errorText}>{audioError}</p>}

        <div style={mainGrid}>
          <div style={stageCard}>
            <div style={sectionHeader}>
              <div>
                <p style={sectionEyebrow}>Visual Evidence</p>
                <h2 style={sectionTitle}>Captured Evidence</h2>
              </div>
              <div style={statusPill}>
                {hasPhoto
                  ? `${capturedPhotos.length} Photo${capturedPhotos.length > 1 ? "s" : ""} Ready`
                  : "Waiting for Capture"}
              </div>
            </div>

            {hasPhoto ? (
              <>
                <div style={previewFrame}>
                  <img
                    src={latestPhoto.src}
                    alt="Captured evidence"
                    style={previewImage}
                  />
                </div>
                {latestPhoto?.name && (
                  <p style={metaPill}>Latest Photo: {latestPhoto.name}</p>
                )}
                {olderPhotos.length > 0 && (
                  <div style={thumbnailStrip}>
                    {olderPhotos.map((photo) => (
                      <div key={photo.id} style={thumbnailCard}>
                        <img
                          src={photo.src}
                          alt={photo.name}
                          style={thumbnailImage}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={placeholderFrame}>
                <div style={placeholderIcon}>📷</div>
                <p style={placeholderTitle}>No photo captured yet</p>
                <p style={placeholderSub}>
                  Use `Take Photo` to open the camera and place the evidence
                  here.
                </p>
              </div>
            )}
          </div>

          <div style={utilityColumn}>
            {recording && (
              <div style={recorderCard}>
                <div style={recorderHeader}>
                  <span style={recordingDot}></span>
                  <p style={recorderTitle}>Voice Recorder Is On</p>
                </div>
                <p style={recorderTime}>{formatRecordingTime(recordingSeconds)}</p>
                <div style={recorderBars}>
                  <span style={recorderBarTall}></span>
                  <span style={recorderBar}></span>
                  <span style={recorderBarTall}></span>
                  <span style={recorderBar}></span>
                  <span style={recorderBarTall}></span>
                </div>
                <p style={recorderHint}>
                  Recording your voice now. Tap Stop Recording when you are
                  done.
                </p>
              </div>
            )}

            <div style={audioCard}>
              <div style={sectionHeaderCompact}>
                <div>
                  <p style={sectionEyebrow}>Audio Evidence</p>
                  <h2 style={utilityTitle}>Recorded Voice</h2>
                </div>
                <div style={audioBadge}>
                  {hasAudio ? "Saved" : recording ? "Live" : "Empty"}
                </div>
              </div>

              {hasAudio ? (
                <>
                  <audio controls src={audioPreview} style={audioPlayer} />
                  {audioName && <p style={metaPill}>Audio: {audioName}</p>}
                </>
              ) : (
                <div style={utilityEmpty}>
                  <span style={utilityEmptyIcon}>🎧</span>
                  <p style={utilityEmptyText}>
                    Your recorded voice clip will appear here.
                  </p>
                </div>
              )}
            </div>

            <div style={statusCard}>
              <div style={sectionHeaderCompact}>
                <div>
                  <p style={sectionEyebrow}>Mission Status</p>
                  <h2 style={utilityTitle}>Capture Summary</h2>
                </div>
              </div>

              <div style={metricList}>
                <div style={metricRow}>
                  <span style={metricLabel}>Photo</span>
                  <span style={metricValue}>{hasPhoto ? "Captured" : "Pending"}</span>
                </div>
                <div style={metricRow}>
                  <span style={metricLabel}>Recording</span>
                  <span style={metricValue}>
                    {recording ? "Recording..." : "Stopped"}
                  </span>
                </div>
                <div style={metricRow}>
                  <span style={metricLabel}>Voice Clip</span>
                  <span style={metricValue}>{hasAudio ? "Saved" : "Pending"}</span>
                </div>
                <div style={metricRow}>
                  <span style={metricLabel}>Upload</span>
                  <span style={metricValue}>
                    {uploaded ? "Uploaded Securely" : "Pending"}
                  </span>
                </div>
              </div>

              {uploaded && (
                <p style={secureBanner}>
                  🔒 Evidence encrypted and stored securely in cloud.
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={bottomBar}>
          <button style={backBtn} onClick={() => navigate("/home")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  padding: 18,
  background:
    "radial-gradient(circle at top, rgba(37,99,235,0.18), transparent 26%), linear-gradient(135deg, #020617, #0f172a 48%, #111827)",
  fontFamily: "Segoe UI, system-ui, sans-serif",
  color: "white",
  overflow: "hidden",
  position: "relative",
};

const ambientGlowOne = {
  position: "absolute",
  top: -120,
  right: -60,
  width: 300,
  height: 300,
  borderRadius: "50%",
  background: "rgba(34,197,94,0.12)",
  filter: "blur(70px)",
  pointerEvents: "none",
};

const ambientGlowTwo = {
  position: "absolute",
  bottom: -100,
  left: -40,
  width: 260,
  height: 260,
  borderRadius: "50%",
  background: "rgba(59,130,246,0.12)",
  filter: "blur(70px)",
  pointerEvents: "none",
};

const shell = {
  position: "relative",
  zIndex: 1,
  maxWidth: 1280,
  height: "calc(100vh - 36px)",
  margin: "0 auto",
  padding: "18px 20px 16px",
  borderRadius: 30,
  border: "1px solid rgba(148,163,184,0.14)",
  background: "rgba(15,23,42,0.78)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
  display: "grid",
  gridTemplateRows: "auto auto 1fr auto",
  gap: 14,
  overflow: "hidden",
};

const heroRow = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(360px, 0.9fr)",
  gap: 18,
  alignItems: "start",
};

const eyebrow = {
  margin: 0,
  fontSize: 11,
  letterSpacing: 2.4,
  textTransform: "uppercase",
  color: "#7dd3fc",
};

const title = {
  margin: "6px 0 6px",
  fontSize: 32,
  lineHeight: 1.05,
  fontWeight: 800,
};

const subTitle = {
  margin: 0,
  maxWidth: 540,
  fontSize: 14,
  color: "rgba(226,232,240,0.78)",
};

const actions = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 12,
};

const actionBtn = {
  padding: "14px 14px",
  borderRadius: 18,
  border: "1px solid rgba(96,165,250,0.22)",
  background: "linear-gradient(180deg, rgba(37,99,235,0.92), rgba(29,78,216,0.92))",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 14,
  boxShadow: "0 14px 24px rgba(37,99,235,0.24)",
};

const actionBtnActive = {
  ...actionBtn,
  background: "linear-gradient(180deg, rgba(220,38,38,0.96), rgba(153,27,27,0.96))",
  border: "1px solid rgba(248,113,113,0.28)",
  boxShadow: "0 14px 24px rgba(220,38,38,0.24)",
};

const uploadBtn = {
  ...actionBtn,
  background: "linear-gradient(180deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95))",
  border: "1px solid rgba(134,239,172,0.24)",
  boxShadow: "0 14px 24px rgba(34,197,94,0.2)",
};

const refreshBtn = {
  ...actionBtn,
  background: "linear-gradient(180deg, rgba(148,163,184,0.95), rgba(100,116,139,0.95))",
  border: "1px solid rgba(226,232,240,0.18)",
  boxShadow: "0 14px 24px rgba(100,116,139,0.2)",
};

const errorText = {
  margin: "0 auto",
  padding: "10px 14px",
  borderRadius: 16,
  background: "rgba(127,29,29,0.5)",
  border: "1px solid rgba(248,113,113,0.22)",
  color: "#fecaca",
  fontSize: 13,
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.85fr)",
  gap: 18,
  minHeight: 0,
};

const stageCard = {
  minHeight: 0,
  padding: "16px 16px 14px",
  borderRadius: 28,
  background:
    "linear-gradient(180deg, rgba(30,41,59,0.92), rgba(15,23,42,0.98))",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const utilityColumn = {
  minHeight: 0,
  display: "grid",
  gridTemplateRows: "auto auto 1fr",
  gap: 12,
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 12,
};

const sectionHeaderCompact = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 12,
};

const sectionEyebrow = {
  margin: 0,
  fontSize: 10,
  letterSpacing: 1.8,
  textTransform: "uppercase",
  color: "#93c5fd",
};

const sectionTitle = {
  margin: "4px 0 0",
  fontSize: 22,
  fontWeight: 800,
};

const utilityTitle = {
  margin: "4px 0 0",
  fontSize: 18,
  fontWeight: 800,
};

const statusPill = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  fontSize: 12,
  color: "#e2e8f0",
  whiteSpace: "nowrap",
};

const audioBadge = {
  padding: "7px 11px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.14)",
  border: "1px solid rgba(96,165,250,0.18)",
  fontSize: 12,
  color: "#bfdbfe",
  whiteSpace: "nowrap",
};

const previewFrame = {
  flex: 1,
  minHeight: 0,
  padding: 8,
  borderRadius: 24,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
};

const previewImage = {
  width: "100%",
  height: "100%",
  borderRadius: 18,
  objectFit: "cover",
  aspectRatio: "1 / 1",
  background: "#0f172a",
};

const placeholderFrame = {
  flex: 1,
  minHeight: 0,
  borderRadius: 24,
  border: "1px dashed rgba(148,163,184,0.28)",
  background:
    "radial-gradient(circle at top, rgba(59,130,246,0.08), rgba(15,23,42,0.92))",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};

const placeholderIcon = {
  fontSize: 46,
  marginBottom: 10,
};

const placeholderTitle = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
};

const placeholderSub = {
  margin: "8px 0 0",
  maxWidth: 300,
  fontSize: 13,
  color: "rgba(226,232,240,0.72)",
  lineHeight: 1.5,
};

const recorderCard = {
  padding: "14px 16px",
  borderRadius: 22,
  background: "linear-gradient(180deg, rgba(127,29,29,0.92), rgba(69,10,10,0.95))",
  border: "1px solid rgba(248,113,113,0.24)",
  boxShadow: "0 18px 30px rgba(0,0,0,0.24)",
};

const recorderHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
};

const recordingDot = {
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: "#ef4444",
  boxShadow: "0 0 0 6px rgba(239,68,68,0.18)",
};

const recorderTitle = {
  margin: 0,
  fontSize: 16,
  fontWeight: 800,
};

const recorderTime = {
  margin: "8px 0 6px",
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: 1.5,
  textAlign: "center",
};

const recorderBars = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  gap: 8,
  height: 30,
};

const recorderBar = {
  width: 8,
  height: 16,
  borderRadius: 999,
  background: "rgba(255,255,255,0.85)",
};

const recorderBarTall = {
  width: 8,
  height: 26,
  borderRadius: 999,
  background: "#fca5a5",
};

const recorderHint = {
  margin: "10px 0 0",
  fontSize: 12,
  color: "rgba(254,226,226,0.84)",
  textAlign: "center",
};

const audioCard = {
  padding: "16px 16px 14px",
  borderRadius: 22,
  background: "rgba(15,23,42,0.92)",
  border: "1px solid rgba(59,130,246,0.18)",
  boxShadow: "0 18px 30px rgba(0,0,0,0.2)",
};

const audioPlayer = {
  width: "100%",
  height: 38,
};

const statusCard = {
  padding: "16px 16px 14px",
  borderRadius: 22,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column",
};

const metricList = {
  display: "grid",
  gap: 10,
};

const metricRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "10px 12px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.04)",
};

const metricLabel = {
  fontSize: 13,
  color: "rgba(226,232,240,0.72)",
};

const metricValue = {
  fontSize: 13,
  fontWeight: 700,
  color: "#f8fafc",
};

const utilityEmpty = {
  minHeight: 94,
  borderRadius: 18,
  border: "1px dashed rgba(148,163,184,0.24)",
  background: "rgba(255,255,255,0.02)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const utilityEmptyIcon = {
  fontSize: 28,
  marginBottom: 8,
};

const utilityEmptyText = {
  margin: 0,
  fontSize: 12,
  color: "rgba(226,232,240,0.72)",
  textAlign: "center",
};

const secureBanner = {
  margin: "12px 0 0",
  padding: "10px 12px",
  borderRadius: 14,
  background: "rgba(34,197,94,0.12)",
  color: "#bbf7d0",
  fontSize: 12,
};

const metaPill = {
  margin: "10px 0 0",
  padding: "8px 12px",
  fontSize: 11,
  opacity: 0.84,
  wordBreak: "break-word",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 999,
  display: "inline-block",
  alignSelf: "flex-start",
};

const thumbnailStrip = {
  marginTop: 10,
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 2,
};

const thumbnailCard = {
  flex: "0 0 64px",
  width: 64,
  height: 64,
  padding: 4,
  borderRadius: 14,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const thumbnailImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 10,
  display: "block",
};

const bottomBar = {
  display: "flex",
  justifyContent: "center",
};

const backBtn = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.16)",
  color: "white",
  padding: "11px 20px",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 700,
};
