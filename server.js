const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bunyan = require('bunyan');

const app = express();
const PORT = process.env.PORT || 3001;

const log = bunyan.createLogger({
  name: 'dog-api-proxy',
  level: 'info',
  serializers: {
    err: bunyan.stdSerializers.err
  }
});

app.use(cors());

app.get('/api/dogs', async (req, res) => {
  const page = req.query.page || 1;
  
  try {
    const response = await fetch(`https://interview-api-olive.vercel.app/api/dogs?page=${page}`);
    const data = await response.json();
    
    if (data.error) {
      log.error({ page, error: data.error }, 'API returned error');
      res.status(500).json({ error: 'Failed to fetch dogs' });
      return;
    }

    res.json(data);
  } catch (error) {
    log.error({ page, error }, 'Failed to fetch dogs');
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

app.listen(PORT, () => {
  log.info({ port: PORT }, 'Server started');
}); 