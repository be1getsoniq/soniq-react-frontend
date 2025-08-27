import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PreferencesScreen from "./screens/PreferencesScreen.jsx";
import ForYouScreen from "./screens/ForYouScreen.jsx";
import ArtistSearch from "./screens/ArtistSearchScreen.jsx";
import FetchApplePlaylist from "./screens/FetchApplePlaylist.jsx";
import AppleMusic from "./screens/AppleLogin.jsx";


import "./App.css";
import ArtistAlbums from "./screens/ArtistAlbums.jsx";
import Login from "./screens/Login.jsx";

export default function App() {
  return (
    <div className="bg-dark-gradient">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/preferences" />} />
          <Route path="/preferences" element={<PreferencesScreen />} />
          <Route path="/foryou" element={<ForYouScreen />} />
          <Route path="/artistsearch" element={<ArtistSearch/>} />
          <Route path="/applefetchplaylist" element={<FetchApplePlaylist/> } />
          <Route path="/artistAlbums" element={<ArtistAlbums/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/applemusic" element={<AppleMusic/>} />
        </Routes>
      </Router>
    </div>
  );
}
