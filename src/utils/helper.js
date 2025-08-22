export function getBaseUrl() {
    let base_url = import.meta.env.VITE_dev_base_url;
    if (import.meta.env.VITE_enviornment === "prod") {
      base_url = import.meta.env.VITE_prod_base_url;
    }
    return base_url;
}

export function getApplePlaylistUrl(){
  return "https://api.music.apple.com/v1/me/library/playlists";
}

export function getAppleBaseUrl(){
  return "https://api.music.apple.com";
}

export function getSpotifyClientId() {
  return import.meta.env.VITE_spotify_client_id;
}

export function getCallBackUri() { 
  let callback_url = import.meta.env.VITE_dev_callback_base_uri;

    if (import.meta.env.VITE_enviornment === "prod") {
      callback_url = import.meta.env.VITE_prod_callback_base_uri;
    }
    return callback_url;
}