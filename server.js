import chalk from "chalk";
import axios from "axios";

import app from "./src/app.js";

const PORT = 5500;

// TODO change into secret or something
const clientId = '308c09770711440eae52380ef42cf18b';
const clientSecret = '587ddfc6bfff4404b278787f5e3d97aa';

export let accessToken;

// Encode your client ID and client secret as base64
const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Make a request to obtain an access token
axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(response => {
    accessToken = response.data.access_token;
    // Now you have the access token to make requests to the Spotify API

    app.listen(PORT, (err) => {
        if (err)
            process.exit(1);
        console.log(chalk.blue(`Server Listening On Port ${PORT}`));
    });

}).catch(error => {
    console.error(chalk.red('Error getting access token:'), error);
});