'use strict';

const cpdf = require('./lib/bin');
const getTemporaryFilePath = require('./lib/tmp-file');

function countPages(filePath) {
  return cpdf('Counting pages', `-pages ${filePath}`)
  .then(out => parseInt(out));
}

function merge(filePaths, output) {
  output = output || getTemporaryFilePath();

  return cpdf('Merging', `${filePaths.join(' ')} -o ${output}`)
  .then(() => output);
}

function split(filePath, dest) {
  return cpdf('Splitting', `-split ${filePath} -o ${dest}`);
}

function write(blankFile, args, output) {
  output = output || getTemporaryFilePath();

  return cpdf('Writing file', `${blankFile} ${args} -o ${output}`)
  .then(() => output);
}

module.exports = {
  countPages,
  merge,
  split,
  write
};
