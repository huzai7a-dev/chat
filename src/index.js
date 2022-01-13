import express from 'express';
import { withSocket } from './server/socket';
import http from 'http';
let app = require('./server').default;
const server = http.createServer(express().use((req, res) => app.handle(req, res)));
withSocket(server);

if (module.hot) {
  module.hot.accept('./server', function() {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT || 3000;

export default server.listen(port, function(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`> Started on port ${port}`);
  });
