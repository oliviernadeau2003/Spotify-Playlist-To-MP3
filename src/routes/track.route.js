import axios from 'axios';
import express from 'express';
import { accessToken } from '../../server.js';
import YoutubeMusicApi from "youtube-music-api";

import download_song from './download_song.js';

const router = express.Router();

class TrackRoutes {
    constructor() {
        router.get("/:playlistID", this.tracks);    // :playlistID -> req.params.playlistID (Request Parameters)
    }

    async tracks(req, res) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` },
                timeout: 0 // Set timeout to 0 for no timeout
            };

            if (!await validatePlaylist(req, res))
                return false;

            // Fetch all tracks from the playlist
            const track_list = await getAllTrack(`https://api.spotify.com/v1/playlists/${req.params.playlistID}/tracks`, config);

            try {
                const api = new YoutubeMusicApi();
                await api.initalize(); // Retrieves Innertube Config

                // Process each track one by one
                for (const song of track_list.tracks) {
                    await download_song(song, api);
                }
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ error: 'Internal server error.' });
            }

            res.status(200).json({});
            console.log("Download Finished");
        } catch (err) {
            throw err;
        }
    }

}
new TrackRoutes();
export default router;

//* FUNCTIONS 

async function getAllTrack(playlistLink, config) {
    let response = await axios.get(playlistLink, config);
    let tracks = new Array();

    while (hasNext(response.data)) {
        response.data.items.forEach(track => { tracks.push(track) });
        response = await axios.get(response.data.next, config);
    }
    response.data.items.forEach(track => { tracks.push(track) });       // Adding the final remaning tracks from the last call

    tracks = tracks.map((track) => {
        return track = {
            "name": track.track.name,
            // "artist": track.track.artists[0].name
            "artists": getAllArtists(track.track.artists)
        }
    })

    return {
        "length": tracks.length,
        "tracks": tracks
    };
}

async function validatePlaylist(req, res) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` }
        };

        await axios.get(`https://api.spotify.com/v1/playlists/${req.params.playlistID}`, config);

        return true;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            res.status(404).json("Playlist Introuvable Ou Privée");
        } else {
            console.error(err);
            res.status(500).json("Erreur interne du serveur");
        }
        return false;
    }
}

function hasNext(playlist) { return playlist.next ? true : false }

function getAllArtists(artists) { return (artists.map(artist => artist.name)).join(', ') }