const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// Public API - Fix these CRUD functions ///////////////////////////////////////

var readFileAsync = Promise.promisify(fs.readFile);

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err) {
        throw (err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  var promises = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw (err);
    } else {
      files.forEach(file => {
        promises.push(
          new Promise((resolve, reject) => {
            var id = path.basename(file, '.txt');
            var text = readFileAsync(exports.dataDir + file);
            if (err) {
              reject(err);
            } else {

              resolve({ id, text });
            }
          })
        );
      });
      Promise.all(promises).then((values) => {
        callback(null, values);
      });
    }
  });
};

exports.readOne = (id, callback) => {
  var filenameArray = [];

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw (err);
    } else {
      files.forEach(file => {
        filenameArray.push(path.basename(file, '.txt'));
      });
    }
    if (!filenameArray.includes(id)) {
      callback(true, null);
    } else {
      fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, text) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: id, text: text.toString() });
        }
      });
    }
  });
};

exports.update = (id, text, callback) => {
  var filenameArray = [];

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw (err);
    } else {
      files.forEach(file => {
        filenameArray.push(path.basename(file, '.txt'));
      });
    }
    if (!filenameArray.includes(id)) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          callback(new Error(`Could not write to file ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filenameArray = [];

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw (err);
    } else {
      files.forEach(file => {
        filenameArray.push(path.basename(file, '.txt'));
      });
    }
    if (!filenameArray.includes(id)) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
        if (err) {
          callback(new Error(`Could not delete file: ${id}`));
        } else {
          callback();
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
