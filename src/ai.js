import express from 'express';
import bodyParser from 'body-parser';
import HuggingFace from './clients/HuggingFace.js';

const aiRouter = express.Router();

const hfClient = new HuggingFace();

const jsonParser = bodyParser.json();

aiRouter.post('/text/completionStream', jsonParser, async (req, res) => {
  if (!req.body) {
    res.status(400).send("Your request was malformed or empty.");
    return
  }

  try {
    const request = req.body;
    const stream = await hfClient.generateCompletionStream(request);
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


aiRouter.post('/agent/stream', jsonParser, async (req, res) => {
  if (!req.body) {
    res.status(400).send("Your request was malformed or empty.");
    return
  }

  try {
    const request = req.body;
    const stream = await hfClient.generateToolStream(request);
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default aiRouter;
