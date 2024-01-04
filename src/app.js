import express from "express";

import trackRoutes from "./routes/track.route.js";
import youtubeRoutes from "./routes/yt_download.route.js";

const app = express();

app.use(express.json());

//* Route Definitions ---

app.use('/track', trackRoutes);
app.use('/youtube', youtubeRoutes);

export default app;