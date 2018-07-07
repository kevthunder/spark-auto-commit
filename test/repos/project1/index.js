var autoCommit = require('spark-auto-commit');

console.log(autoCommit(function(done){
  console.log('do something');
  done()
}))