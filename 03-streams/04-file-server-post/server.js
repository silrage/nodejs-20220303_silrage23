const fs = require('fs');
const http = require('http');
const server = new http.Server();
const path = require('path');
function resolve(link) {
  return path.resolve(__dirname, link);
};
function deleteFile(link) {
  fs.unlink(link, (err) => {});
};

const LimitSizeStream = require('./LimitSizeStream.js');


server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = resolve(`./files/${pathname}`);

  function badPathHandler() {
    res.statusCode = 400;
    res.end('Bad path. Only /filename\n');
  }
  function fileExistHandler() {
    res.statusCode = 409;
    res.end('File exists');
  }
  function fileSizeExcedeedErrorHandler() {
    res.statusCode = 413;
    res.end('File excedeed error');
  }
  function fileSavedHandler() {
    res.statusCode = 201;
    res.end('File saved');
  }
  function fileBrokenHandler() {
    res.statusCode = 500;
  }

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        badPathHandler();
      } else if (fs.existsSync(filepath)) {
        fileExistHandler();
      } else {
        const outStream = fs.createWriteStream(filepath);
        const limitedStream = new LimitSizeStream({limit: 1024000, encoding: 'utf-8'}); // 1MB
        limitedStream.on('error', (err) => {
          if (err && err.code === 'LIMIT_EXCEEDED') {
            fileSizeExcedeedErrorHandler();
          } else {
            fileBrokenHandler();
          }
          deleteFile(filepath);
        });
        outStream.on('close', () => {
          fileSavedHandler();
        });
        req.on('aborted', () => {
          deleteFile(filepath);
        });

        // Write data with limiter
        limitedStream.pipe(outStream);
        req.pipe(limitedStream);
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
