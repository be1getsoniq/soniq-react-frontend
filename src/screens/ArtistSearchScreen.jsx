import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "../utils/helper";
import { UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ArtistSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [source, setSource] = useState("apple");
  const [followedIds, setFollowedIds] = useState([]);
  const [followPayload, setFollowPayload] = useState(null);
  const [apiResponse, setApiResponse] = useState([]);
  const navigate = useNavigate();

  const userId = "cmecddj2x0000h5o7dx069be6";
  let BASE_URL = getBaseUrl();

  // const [followed, setFollowed] = useState(false);

  // console.log("base url : ", BASE_URL);

  const handleFollow = async (artistId, artistName) => {
    setFollowedIds((prev) => {
      const exists = prev.find((a) => a.id === artistId);
      let updated;

      if (exists) {
        // Unfollow
        updated = prev.filter((a) => a.id !== artistId);

        // Send request
        sendFollowData(artistId, artistName, "unfollow");
      } else {
        // Follow
        updated = [...prev, { id: artistId, name: artistName }];

        // Send request
        sendFollowData(artistId, artistName, "follow");
      }

      return updated;
    });
  };

  const sendFollowData = async (artistId, artistName, status) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/followartist/${userId}/${artistId}/${artistName}/${status}`
      );

      console.log("Follow response:", res.data);
    } catch (err) {
      console.error("Failed to send follow data:", err);
    }
  };

  useEffect(() => {
    console.log("followedIds updated:", followedIds);
  }, [followedIds]);

  useEffect(() => {
    if (followedIds.length > 0) {
      const payload = {
        userId,
        artists: followedIds.map((a) => ({
          artistId: a.id,
          artistName: a.name,
          status: "follow", // or store status in followedIds if needed
        })),
      };

      // Save payload in state for later POST request
      setFollowPayload(payload);

      console.log("Payload ready for POST:", payload);
    } else {
      setFollowPayload(null); // reset if no followed artists
    }
  }, [followedIds, userId]);

  async function getToken() {
    const resp = await axios.get(`${BASE_URL}/api/auth/token/${userId}`);
    return resp.data.token;
  }

  const handleSearch = async () => {
    if (!query) return;
    console.log(`${BASE_URL}/api/${source}/artists/albums`);
    console.log(`${BASE_URL}/api/auth/token/${userId}`);
    
    
    try {
      const token = await getToken();

      console.log("token received : ", token);

      const resp = await axios.get(
        `${BASE_URL}/api/${source}/search?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("resp : ", resp.data.artists);
      setResults(resp.data.artists);
    } catch (err) {
      console.error(err);
    }
  };

  const handleContinue = async () => {
    try {
      // http://localhost:3000/api/spotify/artists/albums
      console.log("payload sir is here : ", followPayload);

      const res = await axios.post(
        `${BASE_URL}/api/${source}/artists/albums`,
        followPayload
      );

      setApiResponse(res.data);

      console.log("Saved successfully:", res.data);

      navigate("/artistalbums", { state: { response: res.data } });
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 relative">
      <h1 className="text-2xl text-gray-100 font-bold">Artist Search</h1>
      <div>
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded transition ${
              source === "spotify"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSource("spotify")}
          >
            Spotify
          </button>

          <button
            className={`px-4 py-2 rounded transition ${
              source === "apple"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSource("apple")}
          >
            Apple
          </button>
        </div>
          <p className="text-white font-semibold pb-3">{source} Search</p>
        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);

            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
              if (value.trim() !== "") {
                handleSearch(value);
              }
            }, 2600);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim() !== "") {
              clearTimeout(window.searchTimeout);
              handleSearch(query);
            }
          }}
          onBlur={() => {
            if (query.trim() !== "") {
              clearTimeout(window.searchTimeout);
              handleSearch(query);
            }
          }}
          placeholder="Enter artist name"
          className="
              w-full px-4 py-2 rounded-xl
              bg-gray-700
              placeholder-gray-400
              text-gray-100
              focus:outline-none
              focus:ring-2
              focus:ring-gray-500
              shadow-inner
            "
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {results.map((artist) => (
          <div
            key={artist.id}
            className="flex items-center justify-between bg-gray-800
      rounded-xl border border-gray-700 shadow p-4"
          >
            <a key={artist.id} href={artist.url} target="_blank">
              <div className="flex items-center gap-4">
                {artist.artwork && (
                  <img
                    src={artist.artwork}
                    alt={artist.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}

                <div>
                  <p className="text-gray-100 font-semibold">{artist.name}</p>
                  <p className="text-sm text-gray-400">
                    {artist.genreNames[0]}
                  </p>
                </div>
              </div>
            </a>

            <button
              className="px-4 py-1 bg-green-600 cursor-pointer text-white rounded-full text-sm"
              onClick={() => handleFollow(artist.id, artist.name)}
            >
              {followedIds.some((a) => a.id === artist.id) ? (
                <UserCheck size={18} />
              ) : (
                "Follow"
              )}
            </button>
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-4 left-1/2 -translate-x-1/2 px-8 py-3 bg-green-600 
                     text-white rounded-full shadow-lg cursor-pointer"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}
