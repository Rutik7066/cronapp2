import bodyParser from "body-parser";
import express, { Request, Response } from 'express';
import { mainRouteHandler } from "./handler/handler.js";

const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

app.post('/', (req, res) => {

    return res.json(req.body);
});
app.post('/startCampaign', mainRouteHandler);








app.use(bodyParser.json())
app.listen(3333);
console.log(`Server started at  http://localhost:3333`);
