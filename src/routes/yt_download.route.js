import axios from 'axios';
import express from 'express';

import fs from 'fs';
import ytdl from 'ytdl-core';

const router = express.Router();

class YTDLRoutes {
    constructor() {
        router.get("/", this.download);
    }

    async download(req, res) {
        try {

            await ytdl('https://music.youtube.com/watch?v=BkSSOGNeWTM&list=RDAMVMBkSSOGNeWTM', {
                quality: 'highest',
                format: 'mp4',
                // format: 'mp3',
                // filter: 'audioonly'
            }).pipe(fs.createWriteStream('video.mp4'));

            res.status(200).json("AWESOME");
        } catch (err) {
            throw err;
        }
    }

}
new YTDLRoutes();
export default router;