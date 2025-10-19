import express from 'express';

import HuggingFace from './clients/HuggingFace.js';

const router = express.Router();

const hfClient = new HuggingFace();

router.post('/text/completionStream', async (req, res) => {
  const request = req.body;
  try {
    const stream = await hfClient.generateCompletionStream(request);
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
