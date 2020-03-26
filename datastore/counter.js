const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0); // can't find file, so therefore pass back 0
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, counterString);
    }
  });
};

// Public API //////////////////////////////////////////////

// calling readCounter(callback) to get a current counter (either 0 or a number)
// increase current counter by 1
// write new counter back to counter.txt
// pass new counter to callback as padded string

exports.getNextUniqueId = (callback) => {
  readCounter ((err, currentCounter) => {
    // currentCounter === 0 ? currentCounter : currentCounter++;
    currentCounter += 1;
    writeCounter(currentCounter, (err, counterString) => {
      callback(null, counterString); //return zeroPaddedNumber(counter);
    });
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
