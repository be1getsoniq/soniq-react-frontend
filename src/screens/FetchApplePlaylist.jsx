import { useEffect, useState } from "react";
import { getBaseUrl } from "../utils/helper";

const BASE_URL = getBaseUrl();

export default function AppleMusicPlaylists() {
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);

  const setupMusicKit = async () => {
    try {
      const tokenResp = await fetch(`${BASE_URL}/api/apple/token/`);
      const { token: developerToken } = await tokenResp.json();

      window.MusicKit.configure({ developerToken, app: { name: "PlaylistFetcher", build: "1.0" } });
      const mkInstance = window.MusicKit.getInstance();
      setLoading(false);

      const musicUserToken = await mkInstance.authorize();

      const resp = await fetch("https://api.music.apple.com/v1/me/library/playlists", {
        headers: { Authorization: `Bearer ${developerToken}`, "Music-User-Token": musicUserToken }
      });
      const data = await resp.json();
      setPlaylists(data.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (window.MusicKit) {
      setupMusicKit();
    } else {
      document.addEventListener("musickitloaded", setupMusicKit);
    }
  }, []);

  return (
    <div className="p-4 bg-gray-50 text-gray-900">
      <h1 className="text-center text-2xl font-bold text-red-500 mb-4">Apple Music Playlists</h1>
      {loading && <div className="text-center font-semibold text-red-500 mb-4">Loading Apple Music Kit...</div>}
      {!loading && (
        <div>
          {playlists.length ? (
            playlists.map((pl) => (
              <div key={pl.id} className="bg-white rounded-lg p-4 mb-4 shadow">
                <div className="flex items-center mb-2">
                  {pl.attributes.artwork?.url && (
                    <img alt={pl.attributes.name} className="w-20 h-20 rounded mr-2" src={pl.attributes.artwork.url.replace("{w}x{h}", "200x200")} />
                  )}
                  <h3 className="text-lg font-semibold">{pl.attributes.name}</h3>
                </div>
                <PlaylistSongs href={pl.href} devToken={window.MusicKit.getInstance().developerToken} />
              </div>
            ))
          ) : (
            <p>No playlists found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function PlaylistSongs({ href, devToken }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const mkInstance = window.MusicKit.getInstance();
      const musicUserToken = mkInstance.musicUserToken;
      const resp = await fetch(`https://api.music.apple.com${href}/tracks`, {
        headers: {
          Authorization: `Bearer ${devToken}`,
          "Music-User-Token": musicUserToken
        }
      });
      const data = await resp.json();
      setSongs(data.data || []);
    };
    fetchSongs();
  }, [href, devToken]);

  if (!songs.length) return <p>No songs found.</p>;

  return (
    <ul className="mt-2 pl-4">
      {songs.map((song) => (
        <li key={song.id} className="mb-2">
          <div className="flex items-center bg-gray-100 p-2 rounded shadow">
            {song.attributes.artwork?.url && (
              <img className="w-14 h-14 object-cover rounded mr-2" src={song.attributes.artwork.url.replace("{w}x{h}", "100x100")} alt={song.attributes.albumName || song.attributes.name} />
            )}
            <div>
              <strong>{song.attributes.name}</strong>
              <div>Artist: {song.attributes.artistName}</div>
              {song.attributes.albumName && <div>Album: {song.attributes.albumName}</div>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
