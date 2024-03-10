import express from 'express';
import fs from 'fs';
import ytdl from 'ytdl-core';
import YoutubeMusicApi from "youtube-music-api";

const router = express.Router();

class YTDLRoutes {
    constructor() {
        router.get("/", this.download.bind(this));
    }

    async download(req, res) {
        try {
            const api = new YoutubeMusicApi();
            api.initalize() // Retrieves Innertube Config
                .then(_ => {
                    console.log(req.query.params);
                    const filename = "Glamorous - Fergie,Ludacris.mp4";
                    api.search("Glamorous - Fergie,Ludacris", "song").then(result => {
                        const videoUrl = "https://www.youtube.com/watch?v=" + result.content[0].videoId;
                        const videoStream = ytdl(videoUrl, { quality: 'highestaudio' });
                        const fileStream = fs.createWriteStream(filename);

                        videoStream.pipe(fileStream);

                        fileStream.on('finish', () => {
                            console.log('Video downloaded successfully.');
                            res.status(200).json({ "Status": "Video downloaded successfully." })
                            fileStream.close();
                        });

                        fileStream.on('error', (err) => {
                            console.error('Error downloading video:', err);
                            res.status(1, "Error downloading video.")
                            fileStream.close();
                        });
                    });
                })
                .catch(error => {
                    console.error('Error initializing YouTube Music API:', error);
                });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
        res.status(200, "Video downloaded successfully.")
    }
}

new YTDLRoutes();
export default router;
