var autoCommit = require('spark-auto-commit');
var util = require('util');
var writeFile = util.promisify(require('fs').writeFile)


autoCommit(function(){
  console.log('do something');
  return writeFile('./test','Hello, world!').then(function(){
    console.log('file created');
    return  'new file';
  });
}).then(function(res){
  console.log(res);
}).catch(function(err){
  console.error(err);
  process.exit(1);
});