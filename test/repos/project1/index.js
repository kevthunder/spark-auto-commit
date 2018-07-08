var autoCommit = require('spark-auto-commit');
var util = require('util');
var writeFile = util.promisify(require('fs').writeFile)


autoCommit(function(){
  console.log('do something');
  return writeFile('./test','Hello, world!').then(function(){
    console.log('file created');
    return  'new file';
  });
})