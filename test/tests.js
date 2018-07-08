var util = require('util');
var ncp = util.promisify(require('ncp').ncp);
var rimraf = util.promisify(require('rimraf'));
var exec = util.promisify(require('child_process').exec);
var assert = require('chai').assert;


describe('AutoCommit', function() {
  before(function() {
    this.timeout(5000);
    return Promise.resolve().then(function(){
      console.log('   - delete old test folder');
      return rimraf('test/tmp');
    }).then(function(){
      console.log('   - copy repo to temp folder');
      return ncp('test/repos', 'test/tmp');
    }).then(function(){
      console.log('   - init git');
      return exec('git init', {cwd:'test/tmp/project1'});
    }).then(function(){
      console.log('   - npm install');
      return exec('npm install', {cwd:'test/tmp/project1'});
    }).then(function(){
      console.log('   - commit everything');
      return exec('git add -A', {cwd:'test/tmp/project1'}).then(function(){
        return exec('git commit -m "initial commit"', {cwd:'test/tmp/project1'})
      });
    });
  });

  it('commit changed file by a function', function() {
    return exec('node index.js', {cwd:'test/tmp/project1'}).then(function(out){
      return exec('git log -1 --pretty=%B', {cwd:'test/tmp/project1'})
    }).then(function(out){
      assert.equal(out.stdout.trim(),'new file');
    });
  });
});