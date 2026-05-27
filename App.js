import React, { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Clean old preview (prevents disappearing issues)
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);

    setIsVideo(selectedFile.type.startsWith("video"));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Upload a file first");

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      alert("Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Deepfake Detector</h1>

        <div
          style={styles.dropArea}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            isVideo ? (
              <video src={preview} controls style={styles.image} />
            ) : (
              <img src={preview} alt="preview" style={styles.image} />
            )
          ) : (
            <p>Drag & Drop Image or Video Here</p>
          )}
        </div>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <button onClick={handleUpload} style={styles.button}>
          Detect
        </button>

        {/* ✅ Better loading UI */}
        {loading && (
          <div>
            <div style={styles.loader}></div>
            <p>Processing...</p>
          </div>
        )}

        {/* ✅ Result display improved */}
        {result && (
          <h2
            style={{
              marginTop: "10px",
              color: result.includes("FAKE")
                ? "#ef4444"
                : result.includes("REAL")
                ? "#22c55e"
                : "#facc15",
            }}
          >
            {result.includes("FAKE")
              ? "⚠️ " + result
              : result.includes("REAL")
              ? "✅ " + result
              : "🤔 " + result}
          </h2>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    color: "white",
    width: "350px",
  },
  dropArea: {
    border: "2px dashed #3b82f6",
    padding: "20px",
    marginBottom: "15px",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    background: "#3b82f6",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  loader: {
    margin: "20px auto",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite",
  },
};

export default App;