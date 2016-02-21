'use strict';

const uuid = require('uuid');

function getTemporaryFilePath(ext) {
  return `/tmp/${uuid.v4()}.${ext || 'pdf'}`;
}

module.exports = getTemporaryFilePath;
