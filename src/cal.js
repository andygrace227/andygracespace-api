import express, { response } from 'express';
import bodyParser from 'body-parser';
import {Readable} from 'node:stream';

const router = express.Router();

const jsonParser = bodyParser.json();

router.post('/fetchICS', jsonParser, async (req, res) => {
  if (!req.body) {
    res.status(400).send("Your request was malformed or empty.");
    return
  }

  try {
    console.log("Request: " + req);
    const {icsUrl} = req.body;
    const response = await fetch(icsUrl);
    if (!response.ok) {
        res.status(400).send("Failed to download the ICS file");
        return;
    }
    Readable.fromWeb(response.body)
        .pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
