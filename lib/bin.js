'use strict';

const childProcess = require('child_process');
const debug = require('debug')('cpdf');
const os = require('os');
const path = require('path');
const Q = require('q');

const cpdfBinPaths = {
  linux: path.join(__dirname, '../bin/cpdf-linux-64'),
  darwin: path.join(__dirname, '../bin/cpdf-mac')
};

const cpdfBinPath = cpdfBinPaths[os.platform()];

function cpdf(action, args) {
  let command = `${cpdfBinPath} ${args}`;
  debug(`${action} with command ${command}`);

  return Q.nfcall(childProcess.exec, command);
}

module.exports = cpdf;
