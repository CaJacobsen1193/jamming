# Jammming — Spotify Playlist Builder (React)

Jammming lets you search Spotify for tracks, build a custom playlist, and export it to your Spotify account.

This README covers:
- What the app does
- How authentication works (PKCE)
- What you need to configure in the Spotify Developer Dashboard
- How to run the app locally
- File structure and key components
- Troubleshooting tips

---

## What the App Does

- Search for tracks via Spotify’s Web API.
- Add/Remove tracks to a staging playlist.
- Rename the playlist by editing the title.
- Export the playlist to your Spotify account with one click.

Core user flow:
1. Enter a song/artist/album in the search bar.
2. Click FIND TRACKS or press Enter.
3. Use the + / – buttons to add or remove tracks.
4. Click the playlist title to rename it.
5. Click SAVE/EXPORT to create the playlist in your Spotify account.

---

## How Authentication Works (PKCE)

The app uses OAuth 2.0 Authorization Code Flow with PKCE (no backend required):

1. When you first interact with the app (e.g., search), it checks for an access token.
2. If none is present, it generates a code verifier and code challenge client-side and redirects you to Spotify’s authorize endpoint with response_type=code, code_challenge, and the requested scope.
3. After you log in and approve, Spotify redirects back to the app with an authorization code.
4. The app exchanges that code directly with Spotify for an access token using the saved code verifier.
5. The token is stored in memory and expires automatically after expires_in.

Notes:
- The code verifier is temporarily stored in sessionStorage.
- The app also contains a legacy fallback for the Implicit Grant flow (harmless if unused).
- Only the playlist-modify-public scope is requested by default. Add more scopes if you need them.

Relevant file: src/util/Spotify.js

- CLIENT_ID is read from either VITE_SPOTIFY_CLIENT_ID (Vite) or REACT_APP_SPOTIFY_CLIENT_ID (Create React App).
- The default redirect URI is http://127.0.0.1:5173/callback

If you change the port or host, update it both in:
- Spotify Developer Dashboard (app settings)
- redirectUri inside src/util/Spotify.js

---

## What You Need to Configure (Spotify Dev Dashboard)

1. Go to https://developer.spotify.com/dashboard and Create an App.
2. Copy the Client ID into your local .env file (see below).
3. In your app settings, add this Redirect URI:  
   http://127.0.0.1:5173/callback  
   (If you use a different host/port, keep both places consistent.)
4. Save your changes.

Required Scope:
- playlist-modify-public  
If you want to create private playlists, add playlist-modify-private.  
You’ll need to add it to the scope string in src/util/Spotify.js and re-authorize to grant the new scope.

---

## Environment Variables

Create a .env file at the project root and set one of the following (depending on your setup):

For Vite (recommended):  
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here

For Create React App:  
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here

Do not commit your .env file.

---

## Install & Run

1. Install dependencies:  
   npm install

2. Start the dev server:  

   Vite:  
   npm run dev  

   Create React App:  
   npm start  

3. Open the app in your browser. The first search/export will trigger Spotify login if you’re not already authenticated.

---

## Project Structure (Key Files)

src/  
├─ App.jsx                          # Top-level app: coordinates search/results/playlist  
├─ util/  
│  └─ Spotify.js                    # PKCE auth + search + save playlist  
└─ components/  
   ├─ SearchBar/SearchBar.jsx        # Search input + Enter key + button  
   ├─ SearchResults/SearchResults.jsx# Holds Tracklist for search results  
   ├─ Playlist/Playlist.jsx          # Editable title + Tracklist + SAVE/EXPORT  
   ├─ Tracklist/Tracklist.jsx        # Renders Track items  
   ├─ Track/Track.jsx                # Single track row with + / – actions  
   └─ ListPanel/ListPanel.jsx        # Reusable panel (header + content + optional action)  

Data flow highlights:  
- App.jsx  
  - search(term) → Spotify.search(term) → sets searchResults  
  - addTrack(track) moves a track from results → playlist (deduped)  
  - removeTrack(track) removes track from playlist  
  - save(name, playlist) → Spotify.savePlaylist(name, uris)  
- Playlist.jsx  
  - Editable title, passes onSave(name, tracks) to App  
- SearchBar.jsx  
  - Calls onSearch(term) and supports Enter to submit  

---

## API Endpoints Used

- Search Tracks: GET https://api.spotify.com/v1/search?type=track&q={term}  
- Current User: GET https://api.spotify.com/v1/me  
- Create Playlist: POST https://api.spotify.com/v1/users/{user_id}/playlists  
  Body: { "name": "Your Playlist Name" }  
- Add Tracks to Playlist: POST https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks  
  Body: { "uris": ["spotify:track:...","spotify:track:..."] }  

All calls include:  
Authorization: Bearer <access_token>

---

## Troubleshooting

- “Redirect URI is not secure” or auth errors:  
  Use the exact URI configured in the Spotify Dashboard. Default is http://127.0.0.1:5173/callback.  
  If you prefer localhost, set both sides to http://localhost:<your_port>/callback.  
  Ensure no trailing slashes or mismatched paths.

- Blank results or “Spotify search failed” in console:  
  Your access token may be missing or expired. Trigger a new auth by initiating a search again.  
  Verify your Client ID is set correctly in .env.  
  Confirm the redirect URI in the Dashboard matches redirectUri in src/util/Spotify.js.

- Playlists not appearing in Spotify:  
  Confirm you granted playlist-modify-public (or playlist-modify-private if you changed it).  
  Check that you’re logged into the expected Spotify account in the browser.

- Different port or toolchain:  
  If your dev server runs on a different port (or CRA), adjust the redirectUri in src/util/Spotify.js and Spotify Dashboard accordingly.

---

## Extending the App

- Add more scopes (e.g., user-read-email, playlist-modify-private) if you expand features.  
- Persist playlist drafts in localStorage or a backend.  
- Add paging, filters, or artist/album views to search results.

---

## License

For educational/demo purposes. Review Spotify’s Developer Terms before deploying publicly.
