import 'dotenv/config';
import express from 'express';

import aiRouter from './ai.js';
import calRouter from './cal.js'

const app = express();
const port = process.env.PORT || 1443;

app.use(express.json());
app.use('/ai', aiRouter);
app.use('/cal', calRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '127.0.0.1', () => {
  console.log(`App listening on port ${port}`);
});
