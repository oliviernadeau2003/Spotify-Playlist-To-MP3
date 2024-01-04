import axios from 'axios';
import express from 'express';
import { accessToken } from '../../tokenAccess.js';

import AxiosUtils from '../utils/axios.js';

const router = express.Router();

class RootRoutes {
    constructor() {
        router.get("/", this.root);
    }

    async root(req, res) {
        try {

            // let date = new Date;
            // fs.appendFile("./logs.json", `${date.toISOString()} ${req.ip}\n`, (err) => { throw err });   //TODO CHANGE TO A MIDDLEWARE
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };

            const response = await getAllTrack("https://api.spotify.com/v1/playlists/3XoVQO3vAOXJOorrfZTV0k/tracks", config);
            // const response = await getAllTrack("https://api.spotify.com/v1/playlists/3XoVQO3vAOXJOorrfZTV0k/tracks?offset=400&limit=100", config);

            // console.log(response.items.length);
            // console.log(hasNext(response));
            res.status(200).json(response);
            // res.status(200).json(response.data.tracks.items[0]);

            // ! ---
            // GET SONG NAME : response.data.items[0].track.name
            // GET SONG ARTIST : response.data.items[0].track.artists[0].name
            // ! ---

        } catch (err) {
            throw err;
        }
    }

}
new RootRoutes();
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

function hasNext(playlist) { return playlist.next ? true : false }

function getAllArtists(artists) { return (artists.map(artist => artist.name)).join(', ') }


// https://ytmusicapi.readthedocs.io/en/stable/

// https://ytmp3.nu/drb4/

// https://medium.com/@Moorad/how-i-made-my-own-youtube-downloader-using-javascript-and-node-js-160b172f6e10

// https://www.youtube.com/watch?v=bKnXxICFT1I

