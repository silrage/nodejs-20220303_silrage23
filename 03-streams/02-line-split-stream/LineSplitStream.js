const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.rowContext = '';
    this.separator = options.separator || os.EOL;
  }

  _transform(chunk, encoding, cb) {
    Array.from(chunk.toString()).forEach((symbol) => {
      if (symbol.includes(this.separator)) {
        // Sepearated rows
        this.push(this.rowContext);
        this.rowContext = '';
      } else {
        // Concatenated symbols in row
        this.rowContext += symbol;
      }
    });
    cb();
  }

  _flush(cb) {
    if (this.rowContext) {
      // For last row
      this.push(this.rowContext);
      this.rowContext = '';
    }
    cb();
  }
}

module.exports = LineSplitStream;
