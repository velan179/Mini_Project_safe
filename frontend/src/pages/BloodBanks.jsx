import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../services/apiConfig";

export default function BloodBanks() {
  const [banks, setBanks] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBanks = async (searchCity = "") => {
    try {
      setLoading(true);
      setError("");

      const url = searchCity.trim()
        ? `${API_ENDPOINTS.BANKS_SEARCH}?city=${encodeURIComponent(searchCity.trim())}`
        : API_ENDPOINTS.BANKS_LIST;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to load blood banks");
      }

      setBanks(Array.isArray(data.data) ? data.data : data);
    } catch (err) {
      setError(err.message || "Failed to load blood banks");
      setBanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadBanks(city);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Blood Banks</h1>
        <p style={styles.subtitle}>
          Find nearby blood banks and check availability
        </p>
      </div>

      <form onSubmit={handleSearch} style={styles.searchBar}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search by city"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Search
        </button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => {
            setCity("");
            loadBanks("");
          }}
        >
          Reset
        </button>
      </form>

      {loading && <p style={styles.status}>Loading blood banks...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {banks.length > 0 ? (
          banks.map((bank) => (
            <div key={bank._id || bank.id || bank.name} style={styles.card}>
              <h3 style={styles.cardTitle}>{bank.name}</h3>
              <p style={styles.cardText}>
                {bank.address || "Address unavailable"}
              </p>
              <p style={styles.cardText}>
                {bank.city || bank.location?.city || "City unavailable"}
              </p>
              <p style={styles.cardText}>
                Phone: {bank.phone || "Not provided"}
              </p>
              <p style={styles.cardText}>
                Rating: {bank.rating ?? "N/A"}
              </p>
              <p style={styles.cardText}>
                Status: {bank.isActive === false ? "Inactive" : "Active"}
              </p>
            </div>
          ))
        ) : (
          !loading && !error && (
            <p style={styles.status}>No blood banks found.</p>
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px 20px",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.95), rgba(34,197,94,0.95))",
    fontFamily: "Segoe UI, system-ui, sans-serif",
    color: "white",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.9,
  },
  searchBar: {
    maxWidth: 720,
    margin: "0 auto 24px",
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  input: {
    flex: "1 1 240px",
    minWidth: 220,
    padding: "12px 14px",
    borderRadius: 14,
    border: "none",
    outline: "none",
    fontSize: 14,
  },
  button: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "none",
    background: "#0f172a",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.5)",
    background: "transparent",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  status: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.9,
  },
  error: {
    textAlign: "center",
    fontSize: 14,
    color: "#fecaca",
    marginBottom: 18,
  },
  grid: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
  },
  card: {
    background: "rgba(255,255,255,0.16)",
    backdropFilter: "blur(12px)",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    opacity: 0.92,
    margin: "6px 0 0",
    lineHeight: 1.5,
  },
};
