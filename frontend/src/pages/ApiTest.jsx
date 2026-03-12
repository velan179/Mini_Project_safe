import { useEffect, useState } from "react";
import axios from "axios";

export default function ApiTest() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((res) => {
        setMessage(res.data);
      })
      .catch(() => {
        setMessage("❌ Backend not reachable");
      });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Backend Connection Test</h2>
      <p>{message}</p>
    </div>
  );
}
