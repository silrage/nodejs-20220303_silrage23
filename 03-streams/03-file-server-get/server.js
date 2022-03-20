const fs = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const timer = Date.now();
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  function notFindedHandler(fileName) {
    res.statusCode = 404;
    res.end(`Not finded file ${fileName}`);
  }
  function badPathHandler() {
    res.statusCode = 400;
    res.end('Bad path. Only /filename\n');
  }
  function badRequestHandler() {
    res.statusCode = 500;
    res.end('Bad request');
  };
  function notImplementedHandler() {
    res.statusCode = 501;
    res.end('Not implemented');
  };

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        badPathHandler();
      } else if (fs.existsSync(filepath)) {
        const stream = fs.createReadStream(filepath);
        stream.pipe(res);
        stream.on('error', badRequestHandler);
      } else {
        notFindedHandler(pathname);
      }
      break;

    default:
      notImplementedHandler();
  }

  if (process.env.NODE_ENV !== 'test') {
    console.log(`whole request:${pathname} - ${Date.now() - timer}ms.`);
  }
});

module.exports = server;
