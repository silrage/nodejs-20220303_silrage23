const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.counter = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, cb) {
    this.counter += chunk.length;
    if (this.counter <= this.limit) {
      cb(null, chunk, encoding);
    } else {
      // Show error message when trying write over limit
      cb(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
