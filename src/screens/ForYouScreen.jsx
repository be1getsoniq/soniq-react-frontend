import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import darkCity from "../assets/foryou.png";

export default function ForYouScreen() {
  const [artists, setArtists] = useState([]);

  // useEffect(() => {
  //   setArtists([
  //     {
  //       id: 1,
  //       title: "DARK CITY",
  //       subtitle: "Night Sky",
  //       img: darkCity,
  //     },
  //     {
  //       id: 2,
  //       title: "Midnight Echo",
  //       subtitle: "Synthwave Sessions",
  //       img: darkCity,
  //     },
  //     {
  //       id: 3,
  //       title: "Lo-Fi Dreams",
  //       subtitle: "Study Beats",
  //       img: darkCity,
  //     },
  //     {
  //       id: 4,
  //       title: "Indie Sunrise",
  //       subtitle: "Acoustic Chill",
  //       img: darkCity,
  //     },
  //   ]);
  // }, []);

  //   {
  //     "userId": "cmd7wcyj00000h5r0k0tlwula",
  //     "artists": [
  //         {
  //             "artistName": "Kx5",
  //             "image": "https://i.scdn.co/image/ab67616d0000b273ddd33bce31c72519c861d9db",
  //             "trackUrl": "https://open.spotify.com/track/3VpxEo6vMpi4rQ6t2WVVkK"
  //         },
  //         {
  //             "artistName": "will.i.am",
  //             "image": "https://i.scdn.co/image/ab67616d0000b273e6082141bd7c86ae9f11ea26",
  //             "trackUrl": "https://open.spotify.com/track/2iJuuzV8P9Yz0VSurttIV5"
  //         },
  //         {
  //             "artistName": "Ratatat",
  //             "image": "https://i.scdn.co/image/ab67616d0000b27347c1d9294700c9b75fbaed6b",
  //             "trackUrl": "https://open.spotify.com/track/3qkFIjYRInFasy2jeDZPgm"
  //         },
  //         {
  //             "artistName": "Avicii",
  //             "image": "https://i.scdn.co/image/ab67616d0000b273e14f11f796cef9f9a82691a7",
  //             "trackUrl": "https://open.spotify.com/track/0nrRP2bk19rLc0orkWPQk2"
  //         },
  //         {
  //             "artistName": "Black Eyed Peas",
  //             "image": "https://i.scdn.co/image/ab67616d0000b273382514f0114ba8f4a16d5db4",
  //             "trackUrl": "https://open.spotify.com/track/7K8XoQXZBffc4xG2xIQHMO"
  //         }
  //     ]
  // }

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/spotify/fetchspotify/cmd8w76dr0000h5tn3n34dogr"
        );
        const data = await response.json();
        console.log(data);

        const artists = setArtists(data.artists);

      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSpotifyData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-dark-gradient text-white relative">
      {/* Scrollable content */}
      <div
        className="
          pb-28   
          px-6 pt-6
          max-w-md mx-auto
          space-y-6
        "
      >
        <h1 className="text-center text-2xl font-bold mb-2">For You</h1>

        {artists.map((artist, index) => (
          <a
            key={index}
            href={artist.trackUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/5 hover:bg-white/20 transition">
              <img
                src={artist.image}
                alt={artist.artistName}
                className="w-full h-auto rounded-2xl mb-4 block"
              />
              <h2 className="text-lg font-semibold tracking-wide uppercase">
                 {/* "Song Title" */}
                {artist.trackName}
              </h2>
              <p className="text-sm text-gray-300">
                {artist.artistName}
                </p>
            </div>
          </a>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
