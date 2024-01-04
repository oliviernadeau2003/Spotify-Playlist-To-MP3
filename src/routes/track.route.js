import axios from 'axios';
import express from 'express';
import { accessToken } from '../../tokenAccess.js';

const router = express.Router();

class TrackRoutes {
    constructor() {
        router.get("/:playlistID", this.tracks);    // :playlistID -> req.params.playlistID (Request Parameters)
    }

    async tracks(req, res) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };

            if (!await validatePlaylist(req, res))
                return false;

            // https://open.spotify.com/playlist/3XoVQO3vAOXJOorrfZTV0k?si=98496b09efba483b
            const response = await getAllTrack(`https://api.spotify.com/v1/playlists/${req.params.playlistID}/tracks`, config);
            res.status(200).json(response);

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
            "artist": getAllArtists(track.track.artists)
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


// https://ytmusicapi.readthedocs.io/en/stable/

// https://ytmp3.nu/drb4/


// https://medium.com/@Moorad/how-i-made-my-own-youtube-downloader-using-javascript-and-node-js-160b172f6e10

// https://www.youtube.com/watch?v=bKnXxICFT1I

