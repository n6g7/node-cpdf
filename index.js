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

function split(filePath, dest, chunks = null) {
  const chunkFlag = (chunks == null) ? '' : `-chunk ${chunks}`
  return cpdf('Splitting', `-split ${filePath} -o ${dest} ${chunkFlag}`);
}

function write(blankFile, args, output) {
  output = output || getTemporaryFilePath();

  return cpdf('Writing file', `${blankFile} ${args} -o ${output}`)
  .then(() => output);
}

function pageInfo(filePath, range) {
  return cpdf('PageInfo', `-page-info ${filePath}${range ? ` ${range}` : ''}`);
}

/****************************************************************
 * Check in https://www.coherentpdf.com/cpdfmanual.pdf Page #15 *
 * cpdf -mediabox "<x> <y> <w> <h>" in.pdf [<range>] -o out.pdf *
 * args: { newBox: [Number][, range: String] }                  *
 *   - newBox is required                                       *
 *   - range is optional                                        *
 ****************************************************************/
function mediaBox(filePath, args, output) {
  output = output || getTemporaryFilePath();

  const box = args.newBox.join(' ');
  const range = args.range ? ` ${args.range}` : '';

  return cpdf('Modify MediaBox', `-mediabox "${box}" ${filePath}${range} -o ${output}`);
}

/****************************************************************
 * Check in https://www.coherentpdf.com/cpdfmanual.pdf Page #15 *
 * cpdf -crop "<x> <y> <w> <h>" in.pdf [<range>] -o out.pdf     *
 * Note: -cropbox switch won't work with this older version     *
 * args: { newBox: [Number][, range: String] }                  *
 *   - newBox is required                                       *
 *   - range is optional                                        *
 ****************************************************************/
function cropBox(filePath, args, output) {
  output = output || getTemporaryFilePath();

  const box = args.newBox.join(' ');
  const range = args.range ? ` ${args.range}` : '';

  return cpdf('Modify CropBox', `-cropbox "${box}" ${filePath}${range} -o ${output}`);
}

module.exports = {
  countPages,
  merge,
  split,
  write,
  pageInfo,
  mediaBox,
  crop: cropBox,
  cropBox,
  cpdf
};
