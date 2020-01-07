const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// var counter = 0; // DONT USE ANYMORE

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback2) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback2(null, 0); // can't find file, so therefore pass back 0
    } else {
      callback2(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback3) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback3(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// calling readCounter(callback) to get a current counter (either 0 or a number)
// increase current counter by 1
// write new counter back to counter.txt
// pass new counter to callback1 as padded string

exports.getNextUniqueId = (callback1) => {
  readCounter ((err, currentCounter) => {
    // currentCounter === 0 ? currentCounter : currentCounter++;
    currentCounter += 1;
    writeCounter(currentCounter, (err, counterString) => {
      callback1(null, counterString); //return zeroPaddedNumber(counter);
    });
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
