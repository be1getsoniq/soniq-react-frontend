import React, { useState } from "react";
import axios from "axios";

export default function ArtistSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [source, setSource] = useState("apple");
  let mappedData;
  const handleSearch = async () => {
    if (!query) return;

    // const resp = await axios.get(`/search?artistName=${query}`);
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWVjZGRqMngwMDAwaDVvN2R4MDY5YmU2IiwiZW1haWwiOiJhZG1pbkBnZXRzb25pcS5hcHAiLCJpYXQiOjE3NTUyNzAyOTUsImV4cCI6MTc1NTg3NTA5NX0.Jb_JEnBWGV4gZKkxOEQaCUHled7uZ0wPNsUmm8X82rQ";

      const resp = await axios.get(
        `http://localhost:3000/api/${source}/search?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("query : ", query);

      console.log("resp : ", resp.data.artists[0]);

      if (source == "apple") {
        console.log("hellow");
        console.log("raw artist object:", resp.data.artists[0]);

        mappedData = resp.data.artists.map((artist, idx) => {
          console.log("artist name →", artist.name);

          return {
            id: idx,
            artistName: artist.attributes.name ?? null,
            url: artist.attributes.url ?? null,
            image_url: getAppleArtworkUrl(artist.attributes.artwork?.url, 400) ?? null,
            genre: artist.attributes.genreNames?.[0] ?? null,
          };
        });
      } else {
        mappedData = resp.data.artists.map((artist,idx) => ({
          id: idx,
          artistName: artist.name,
          url: artist.external_urls.spotify,
          image_url: artist.images[1].url,
          genre: artist.genres?.[0] ?? null,
        }));
      }
      console.log(mappedData);
      console.log(resp.data.artists);

      // setResults(resp.data.artists);
      setResults(mappedData);
    } catch (err) {
      console.error(err);
    }
  };

  const getAppleArtworkUrl = (rawUrl, size = 400) => {
    return rawUrl.replace("{w}", size).replace("{h}", size);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl text-gray-100 font-bold">Artist Search</h1>

      <div>
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              source === "spotify" ? "bg-gray-300" : "bg-gray-100"
            }`}
            onClick={() => setSource("spotify")}
          >
            Spotify
          </button>
          <button
            className={`px-4 py-2 rounded ${
              source === "apple" ? "bg-gray-300" : "bg-gray-100"
            }`}
            onClick={() => setSource("apple")}
          >
            Apple
          </button>
        </div>

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
            }, 3000);
          }}
          placeholder="Enter artist name"
          className="
            w-full px-4 py-2 rounded-xl
            bg-gray-700
            placeholder-gray-400
            text-gray-100
            focus:outline-none focus:ring-2 focus:ring-gray-500
            shadow-inner
          "
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {results.map((artist) => (
          <a key={artist.id} href={artist.url} target="_blank">
            <div
              key={artist.id}
              className="
                    bg-gray-800
                    rounded-xl
                    p-4
                    border border-gray-700
                    shadow
                "
            >
              <p className="text-lg font-semibold text-gray-100">
                {artist.artistName}
              </p>
              <p className="text-sm text-gray-400">{artist.genre}</p>

              {artist.image_url && (
                <img
                  src={artist.image_url}
                  alt={artist.artistName}
                  className="mt-2 rounded-md mx-auto"
                />
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
