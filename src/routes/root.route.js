import axios, { AxiosHeaders } from 'axios';
import express, { response } from 'express';
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

            // console.log(response.items.length);
            console.log(hasNext(response));
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
    const response = await axios.get(playlistLink, config);

    while (hasNext(response)) {

    }

    //* GET PLAYLIST INFO (EVERITHINGS)
    // const response = await axios.get("https://api.spotify.com/v1/playlists/3XoVQO3vAOXJOorrfZTV0k", config);
    // console.log(response.data.tracks.items[0].track.name + " " + response.data.tracks.items[0].track.artists[0].name);

    //* GET ONLY PLAYLIST TRACKS (ADD ?offset=100&limit=100 FOR MORE (NEXT))

    return response.data;
}

function hasNext(playlist) { return playlist.next ? true : false }