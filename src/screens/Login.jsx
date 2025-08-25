import React, { useEffect, useState } from "react";
import { getCallBackUri, getSpotifyClientId, getBaseUrl } from "../utils/helper";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = getSpotifyClientId();
const callbackBaseUrl = getCallBackUri();
const baseUrl = getBaseUrl();
// const REDIRECT_URI = "https://soniqfrontend.loca.lt/artistsearch";
// const REDIRECT_URI = "https://8c2a5d3fbb02.ngrok-free.app/artistsearch";

const REDIRECT_URI = `${callbackBaseUrl}/artistsearch`;
console.log(REDIRECT_URI);

console.log(" GET base url : ", baseUrl);



const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "user-library-modify",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-top-read",
].join(" ");

const Login = () => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [appleToken, setAppleToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();


  
  // spotify
  // useEffect(() => {
  //   try {
  //     const hash = window.location.hash;
  //     if (hash) {
  //       const token = hash
  //         .substring(1)
  //         .split("&")
  //         .find((elem) => elem.startsWith("access_token"))
  //         ?.split("=")[1];

  //       const errorParam = hash
  //         .substring(1)
  //         .split("&")
  //         .find((elem) => elem.startsWith("error"))
  //         ?.split("=")[1];

  //       if (token) {
  //         console.log("Spotify access token obtained:", token);
  //         setSpotifyToken(token);
  //       } else if (errorParam) {
  //         console.error("Spotify auth error:", errorParam);
  //         setError(`Spotify auth error: ${errorParam}`);
  //       }
  //       window.history.replaceState({}, document.title, "/");
  //     }
  //   } catch (err) {
  //     console.error("Error parsing Spotify token:", err);
  //     setError("Error parsing Spotify token");
  //   }
  // }, []);


  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        ?.split("=")[1];

      if (token) {
        console.log("Spotify access token obtained:", token);
        setSpotifyToken(token);
        localStorage.setItem("spotifyToken", token); // Save in localStorage
        window.history.replaceState({}, document.title, "/"); // Clean URL
      }
    }
  }, []);
  useEffect(() => {
    const savedToken = localStorage.getItem("spotifyToken");
    if (savedToken) {
      console.log("Spotify token loaded from localStorage:", savedToken);
      setSpotifyToken(savedToken);
    }
  }, []);

  // Spotify Login
  const loginSpotify = () => {
    try {
      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
        SPOTIFY_SCOPES
      )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&show_dialog=true`;
      console.log("Redirecting to Spotify auth URL:", authUrl);
      window.location.href = authUrl;
    } catch (err) {
      console.error("Spotify login error:", err);
      setError("Spotify login failed");
    }
  };

  // Spotify Revoke
  const revokeSpotify = () => {
    console.log("Revoking Spotify access");
    setSpotifyToken(null);
    localStorage.removeItem("spotifyToken"); // Clear saved token
  };


  // apple login
  
  const handleLogin = async () => {
    try {
      const mkInstance = window.MusicKit.getInstance();
      const userToken = await mkInstance.authorize();
      setLoggedIn(true);
      navigate('/artistsearch');

    } catch (err) {
      console.error("Login failed:", err);
      alert(err.message);
    }
  };

  const handleLogout = () => {
    const mkInstance = window.MusicKit.getInstance();
    mkInstance.musicUserToken = null;
      setLoggedIn(false);
    alert("Logged out!");
  };


  const setupMusicKit = async () => {
    try {
      const tokenResp = await fetch(`${baseUrl}/api/apple/token/cme6r5bhm0000h5kop1q2rv27`);
      let { token } = await tokenResp.json();
      setAppleToken(token);
      console.log("token : ", token );
      

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
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
    script.onload = () => {
      console.log("MusicKit loaded");
      setupMusicKit();
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-10">Soniq Login Demo</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6 w-full max-w-md text-center">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Spotify Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mb-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Spotify</h2>
        {spotifyToken ? (
          <>
            <p className="mb-4 text-gray-700 font-medium">
              Logged in to Spotify!
            </p>
            <button
              onClick={revokeSpotify}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Revoke Spotify Access
            </button>
          </>
        ) : (
          <button
            onClick={loginSpotify}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Login with Spotify
          </button>
        )}
      </div>

      {/* Apple Music Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">
          Apple Music
        </h2>
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
      </div>
    </div>
  );
};

export default Login;
