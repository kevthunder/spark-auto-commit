var util = require('util');
var fs = require('fs')
var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);


module.exports = {
  replaceInFile : function(filePath,find,replace){
    return readFile(filePath, 'utf8').then(function (content) {
      return content.replace(find, replace);
    }).then(function (content) {
      return writeFile(filePath, content, 'utf8');
    });
  }
}