import 'dotenv/config';
import express from 'express';

import apiRouter from './ai.js';

const app = express();
const port = process.env.PORT || 1443;

app.use(express.json());
app.use('/ai', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
