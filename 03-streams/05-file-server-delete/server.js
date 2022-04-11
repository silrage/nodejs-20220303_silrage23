const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');
function deleteFile(link) {
  fs.unlink(link, (err) => {});
};

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad path. Only /filename\n');
      } else if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('File not finded');
      } else {
        deleteFile(filepath);
        res.end('File deleted');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
