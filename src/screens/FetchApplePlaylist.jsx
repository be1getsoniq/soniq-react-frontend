import { useEffect, useState } from "react";

export default function AppleMusicPlaylists() {
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [developerToken, setDeveloperToken] = useState(null);
  const [musicUserToken, setMusicUserToken] = useState(null);

  // Load MusicKit script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
    script.onload = () => {
      console.log("MusicKit loaded");
      setupMusicKit();
    };
    document.body.appendChild(script);
  }, []);

  const setupMusicKit = async () => {
    try {
      const tokenResp = await fetch("http://localhost:3000/api/apple/token/cme6r5bhm0000h5kop1q2rv27");
      const { token } = await tokenResp.json();
      setDeveloperToken(token);

      window.MusicKit.configure({
        developerToken: token,
        app: { name: "PlaylistFetcher", build: "1.0" },
      });

      setLoading(false);
    } catch (err) {
      console.error("MusicKit setup failed:", err);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const mkInstance = window.MusicKit.getInstance();
      const userToken = await mkInstance.authorize();
      setMusicUserToken(userToken);
      setLoggedIn(true);
      fetchPlaylists(userToken);
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.message);
    }
  };

  const handleLogout = () => {
    const mkInstance = window.MusicKit.getInstance();
    mkInstance.musicUserToken = null;
    setLoggedIn(false);
    setPlaylists([]);
    setMusicUserToken(null);
    alert("Logged out!");
  };

  const fetchPlaylists = async (userToken) => {
    try {
      const resp = await fetch("https://api.music.apple.com/v1/me/library/playlists", {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          "Music-User-Token": userToken,
        },
      });
      const data = await resp.json();
      setPlaylists(data.data || []);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", background: "#f8f8f8" }}>
      <h1 style={{ textAlign: "center", color: "#ff2f56" }}>Apple Music Playlists</h1>
      {loading && <div style={{ color: "#ff2f56", fontWeight: "bold" }}>Loading Apple Music Kit...</div>}

      {!loading && (
        <>
          <button
            onClick={handleLogin}
            disabled={loggedIn}
            style={{
              display: "block",
              margin: "10px auto",
              padding: "10px 20px",
              background: "#ff2f56",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: loggedIn ? "not-allowed" : "pointer",
            }}
          >
            Login with Apple Music
          </button>
          {loggedIn && (
            <button
              onClick={handleLogout}
              style={{
                display: "block",
                margin: "10px auto",
                padding: "10px 20px",
                background: "#888",
                color: "white",
                border: "none",
                borderRadius: 8,
              }}
            >
              Revoke Access 
              
            </button>
          )}
        </>
      )}

      <div>
        {playlists.map((pl) => (
          <div
            key={pl.id}
            style={{
              background: "white",
              borderRadius: 8,
              padding: 15,
              marginBottom: 20,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={pl.attributes.artwork?.url?.replace("{w}x{h}", "200x200") || ""}
                alt={pl.attributes.name}
                style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover", marginRight: 10 }}
              />
              <h3>{pl.attributes.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
