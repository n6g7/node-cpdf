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
  const outPath = path.resolve('./test/out');
  let srStat;

  // check dependencies before start tests
  before((done) => {
    Q.nfcall(fs.stat, testSR)
      .then((stat) => {
        srStat = stat;
        return Q.nfcall(fs.stat, testGR)
      })
      .then(() =>
        Q.nfcall(fs.stat, outPath)
          .then(() => done())
          .catch(() => Q.nfcall(fs.mkdir, outPath))
      )
      .then(() => done())
      .catch(done);
  });
  
  describe('countPages', () => {
    it('should return a correct number of pages', (done) => {
      cpdf.countPages(testSR)
      .then((count) => expect(count).to.equal(31))
      .then(() => done())
      .catch(done);
    });
  });

  describe('merge', () => {
    it('should merge two files', (done) => {
      cpdf.merge([testSR, testGR])
      .then(cpdf.countPages)
      .then((count) => expect(count).to.equal(85))
      .then(() => done())
      .catch(done);
    });
  });

  describe('split', () => {
    it('should split a file in pages', (done) => {
      cpdf.split(testSR, path.join(outPath, 'sr-page-%%.pdf'))
        .then(() => Q.nfcall(fs.readdir, outPath))
        .then((files) => expect(files).to.have.length(31))
        .then(() => done())
        .catch(done);
    });
  });

  describe('write', () => {
    it('should write on a new file', (done) => {
      cpdf.write(testSR, '')
        .then((outPath) => Q.nfcall(fs.stat, outPath))
        .then((stat) => expect(stat.size).to.not.equal(srStat.size))
        .then(() => done())
        .catch(done);
    });
  });

  describe('pageInfo', () => {
    it('should print out first page metadata', (done) => {
      cpdf.pageInfo(testSR, '1')
        .then((print) =>
          expect(print[0])
            .to
            .have
            .string("Page 1:\nLabel: 1\nMediaBox: 0.000000 0.000000 595.000000 842.000000\nCropBox: 0.000000 0.000000 595.000000 842.000000\nBleedBox: \nTrimBox: \nArtBox: \nRotation: 0\n")
        )
        .then(() => done())
        .catch(done);
    });
  });

  describe('mediaBox', () => {
    it('should change the first page mediabox', (done) => {
      const args = {
        newBox: [0, 0, 250, 420],
        range: '1'
      }
      const filepath = path.join(outPath, 'mediabox.pdf')
      cpdf.mediaBox(testSR, args, filepath)
        .then(() => cpdf.pageInfo(filepath, '1'))
        .then((print) =>
          expect(print[0])
            .to
            .have
            .string("Page 1:\nLabel: 1\nMediaBox: 0.000000 0.000000 250.000000 420.000000\nCropBox: 0.000000 0.000000 595.000000 842.000000\nBleedBox: \nTrimBox: \nArtBox: \nRotation: 0\n")
        )
        .then(() => done())
        .catch(done);
    });
  });

  describe('crop', () => {
    it('should change the first page cropbox', (done) => {
      const args = {
        newBox: [0, 0, 250, 420],
        range: '1'
      }
      const filepath = path.join(outPath, 'cropbox.pdf')
      cpdf.crop(testSR, args, filepath)
        .then(() => cpdf.pageInfo(filepath, '1'))
        .then((print) => 
          expect(print[0])
            .to
            .have
            .string("Page 1:\nLabel: 1\nMediaBox: 0.000000 0.000000 595.000000 842.000000\nCropBox: 0.000000 0.000000 250.000000 420.000000\nBleedBox: \nTrimBox: \nArtBox: \nRotation: 0\n")
        )
        .then(() => done())
        .catch(done);
    });
  });

  after((done) => {
    Q.nfcall(fs.readdir, outPath)
      .then((files) => Promise.all(files.map(f => Q.nfcall(fs.unlink, path.join(outPath, f)))))
      .then(() => Q.nfcall(fs.rmdir, outPath))
      .then(() => done())
      .catch(done)
  });
});
