import fs from 'fs';
import ytdl from 'ytdl-core';

export default async function download_song(song, api) {
    const song_name = song.name + " - " + song.artists;
    const filename = clearWindowsFileName(song_name + ".mp4");
    const directory = "./playlist/";

    // Create directory if it doesn't exist
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    try {
        const result = await api.search(song_name, "song");
        if (!result.content || result.content.length === 0) {
            console.error(`Video not found for ${song_name}`);
            return;
        }

        const videoUrl = "https://www.youtube.com/watch?v=" + result.content[0].videoId;
        const videoStream = ytdl(videoUrl, { quality: 'highestaudio' });
        const fileStream = fs.createWriteStream(directory + filename);

        videoStream.pipe(fileStream);

        fileStream.on('finish', () => {
            console.log(`Successfully Downloaded ${song_name}.`);
            fileStream.close(); // Close the file stream after finishing writing
        });

        fileStream.on('error', async (err) => {
            if (err.statusCode && err.statusCode === 410) {
                console.error(`Error: Video ${song_name} is no longer available.`);
                // Handle this case gracefully, e.g., skip downloading this song
            } else {
                console.error(`Error downloading video: ${song_name} | ${videoUrl}`, err);
            }
            fileStream.close(); // Close the file stream on error as well
        });
    } catch (err) {
        console.error(`Error searching for video: ${song_name}`, err);
    }
}

function clearWindowsFileName(inputString) {
    var illegalCharactersRegex = /[<>:"\/\\|?*\x00-\x1F]/g;
    return inputString.replace(illegalCharactersRegex, '');
}
