import express from "express";

import rootRoutes from "./routes/root.route.js";

const app = express();

app.use(express.json());

//* Route Definitions ---

app.use('/', rootRoutes);

export default app;