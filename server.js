import chalk from "chalk";
import axios from "axios";
import express from "express";
import http from "http";
import { Server } from "socket.io";

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

    // Start Express server
    const expressApp = app;
    const server = http.createServer(expressApp);

    // Create Socket.IO server
    const io = new Server(server);

    // Socket.IO connection handler
    io.on('connection', (socket) => {
        console.log('Socket connected');

        // Periodic ping to check connection
        const pingInterval = setInterval(() => {
            if (socket.connected) {
                socket.emit('ping'); // Send ping to client
            } else {
                clearInterval(pingInterval); // Stop pinging if connection is closed
            }
        }, 30000); // Send ping every 30 seconds

        // Socket.IO message handler
        socket.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });
    });

    server.listen(PORT, (err) => {
        if (err) {
            console.error(chalk.red('Error starting server:'), err);
            process.exit(1);
        }
        console.log(chalk.blue(`Server Listening On Port ${PORT}`));
    });

}).catch(error => {
    console.error(chalk.red('Error getting access token:'), error);
});
