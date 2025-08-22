import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { getBaseUrl } from "../utils/helper";
import { useLocation } from "react-router-dom";

const BASE_URL = getBaseUrl();

export default function ArtistAlbums() {
  const [artists, setArtists] = useState([]);
  const location = useLocation();
  const response = location.state?.response;
  console.log("response : ", response);
  useEffect(() => {
    if (response) {
      setArtists(response);
    }
  }, [response]);

  return (
    <div className="min-h-screen w-full bg-dark-gradient text-white relative">
      <div
        className="
          pb-28   
          px-6 pt-6
          max-w-md mx-auto
          space-y-6
        "
      >
        <h1 className="text-center text-2xl font-bold mb-2">For You</h1>

        {artists.map((artist) => (
          <div key={artist.artistId} className="space-y-4">
            <h2 className="text-xl font-bold">{artist.artistName}</h2>

            {/* Render each album */}
            <div className="grid grid-cols-1 gap-4">
              {artist.albums.map((album) => (
                <a
                  key={album.id}
                  href={album.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/5 hover:bg-white/20 transition">
                    <img
                      src={album.artwork}
                      alt={album.name}
                      className="w-full h-auto rounded-2xl mb-4 block"
                    />
                    <h3 className="text-lg font-semibold tracking-wide uppercase">
                      {album.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {album.albumType} • {album.releaseDate} •{" "}
                      {album.totalTracks} tracks
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
