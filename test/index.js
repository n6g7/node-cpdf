'use strict';

const chai = require('chai');
const cpdf = require('../index');
const fs = require('fs');
const mocha = require('mocha');
const path = require('path');
const Q = require('q');

const expect = chai.expect;

const testSR = path.resolve('./test/einstein-sr.pdf');
const testGR = path.resolve('./test/einstein-gr.pdf');

describe('CPDF', () => {
  describe('countPages', () => {
    it('should return a correct number of pages', (done) => {
      cpdf.countPages(testSR)
      .then((count) => {
        expect(count).to.equal(31);
      })
      .then(done)
      .catch(done);
    });
  });

  describe('merge', () => {
    it('should merge two files', (done) => {
      cpdf.merge([testSR, testGR])
      .then(cpdf.countPages)
      .then((count) => {
        expect(count).to.equal(85);
      })
      .then(done)
      .catch(done);
    });
  });

  describe('split', () => {
    it('should split a file in pages', (done) => {
      let outPath = path.resolve('./test/out');

      Q.nfcall(fs.unlink, outPath)
      .then(() => Q.nfcall(fs.mkdir, outPath))
      .catch((err) => {})
      .then(() => cpdf.split(testSR, path.join(outPath, 'sr-page-%%.pdf')))
      .then(() => Q.nfcall(fs.readdir, outPath))
      .then((files) => {
        expect(files).to.have.length(31);
      })
      .then(done)
      .catch(done);
    });
  });

  describe('write', () => {
    let srStat;

    before((done) => {
      Q.nfcall(fs.stat, testSR)
      .then((stat) => {
        srStat = stat;
      })
      .then(done);
    });

    it('should write on a new file', (done) => {
      cpdf.write(testSR, '')
      .then((outPath) => Q.nfcall(fs.stat, outPath))
      .then((stat) => {
        expect(stat.size).to.not.equal(srStat.size);
      })
      .then(done)
      .catch(done);
    });
  });
});
