const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

//var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {
    //console.log('current id is: ', id);
    //console.log('Currently creating a new file:', path.join(exports.dataDir, id + '.txt'));
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err) {
        throw (err);
      } else {
        //console.log('current id:', id, ', and current text:', text);
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // create an array of objects with key and value equal to file id
  // pass the array to the callback function
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw (err);
    } else {
      files.forEach(file => {
        var id = path.basename(file, '.txt');
        data.push({ id: id, text: id });
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  // create an array of objects with key and text equal to file id
  // iterate through the list of text files
  // if no elements match throw and error
  // else if the id matches the id of an element
  // pass that object into the callback function

  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
