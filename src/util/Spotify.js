const CLIENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SPOTIFY_CLIENT_ID) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SPOTIFY_CLIENT_ID);

const redirectUri = 'http://127.0.0.1:5173/callback';
let accessToken;

function store(k, v) { sessionStorage.setItem(k, v); }
function load(k) { return sessionStorage.getItem(k); }
function remove(k) { sessionStorage.removeItem(k); }

function randomString(len = 64) {
  const a = new Uint8Array(len);
  crypto.getRandomValues(a);
  return Array.from(a, b => ('0' + b.toString(16)).slice(-2)).join('');
}
async function sha256(str) {
  const data = new TextEncoder().encode(str);
  return crypto.subtle.digest('SHA-256', data);
}
function b64url(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


const Spotify = {
  async getAccessToken() {
    console.log('[auth] href=', window.location.href);

    if (accessToken) return accessToken;

    // If Spotify sent us back with an error
    const url = new URL(window.location.href);
    const authError = url.searchParams.get('error');
    if (authError) { console.error('Spotify auth error:', authError); return null; }

    // If Spotify sent us back with a code, exchange it for a token
    const code = url.searchParams.get('code');
    console.log('[auth] code=', code);

    if (code) {
        const verifier = load('spotify_code_verifier');
        if (!verifier) return null;

        const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier
        });

        const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
        });

        if (!res.ok) {
        console.error('Token exchange failed:', res.status, await res.text());
        return null;
        }

        const json = await res.json(); // { access_token, expires_in, ... }
        accessToken = json.access_token;
        const expiresIn = Number(json.expires_in || 3600);
        window.setTimeout(() => (accessToken = ''), expiresIn * 1000);

        // clean URL and verifier
        window.history.replaceState({}, document.title, window.location.pathname);
        remove('spotify_code_verifier');
        return accessToken;
    }

    // (Legacy implicit flow support; harmless if not used)
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
    }

    // Start PKCE: create verifier/challenge and redirect
    const verifier = randomString(64);
    const challenge = b64url(await sha256(verifier));
    store('spotify_code_verifier', verifier);

    const scope = encodeURIComponent('playlist-modify-public');
    const accessUrl =
        `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}` +
        `&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&code_challenge_method=S256&code_challenge=${challenge}`;

    window.location = accessUrl;
    return null;
    },


  search(term) {
    return (async () => {
      const token = await Spotify.getAccessToken();
      if (!token) return [];
      console.log('token in search =>', await Spotify.getAccessToken?.());
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : r.text().then(t => (console.error('Spotify search failed:', r.status, t), {})))
        .then(json => {
          if (!json.tracks) return [];
          return json.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        });
    })();
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;

    return (async () => {
      const token = await Spotify.getAccessToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
      let userId;

      return fetch('https://api.spotify.com/v1/me', { headers })
        .then(r => r.json())
        .then(json => {
          userId = json.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers,
            method: 'POST',
            body: JSON.stringify({ name })
          });
        })
        .then(r => r.json())
        .then(json => {
          const playlistId = json.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris })
          });
        });
    })();
  }
};

export default Spotify;
