var util = require('util');
var ncp = util.promisify(require('ncp').ncp);
var rimraf = util.promisify(require('rimraf'));
var exec = util.promisify(require('child_process').exec);
var assert = require('chai').assert;
var slash = require('slash');
var Promise = require('bluebird');
var pathHelper = require('../helpers/path');
var files = require('../helpers/files');


describe('AutoCommit', function() {
  before(function() {
    projects = ['project2','project1'];
    this.timeout(10000);
    return Promise.resolve().then(function(){
      console.log('   - delete old test folder');
      return rimraf('test/tmp');
    }).then(function(){
      console.log('   - copy repo to temp folder');
      return ncp('test/repos', 'test/tmp');
    }).then(function(){
      return Promise.mapSeries(projects,function(project){
        console.log('   - init '+project);
        return Promise.resolve().then(function(){
          console.log('     - replace path');
          return files.replaceInFile('test/tmp/project1/package.json','{{path}}',pathHelper.uriResolve('test/tmp'))
        }).then(function(){
          console.log('     - init git');
          return exec('git init', {cwd:'test/tmp/'+project});
        }).then(function(){
          console.log('     - create bare repo');
          return exec('git init --bare '+project, {cwd:'test/tmp/bare'}).then(function(){
            return exec('git remote add origin ../bare/'+project, {cwd:'test/tmp/'+project})
          }).then(function(){
            return exec('git config --global url.file://.insteadOf git+file://', {cwd:'test/tmp/'+project})
          });
        }).then(function(){
          console.log('     - npm install');
          return exec('npm install', {cwd:'test/tmp/'+project});
        }).then(function(){
          console.log('     - commit everything');
          return exec('git add -A', {cwd:'test/tmp/'+project}).then(function(){
            return exec('git commit -m "initial commit"', {cwd:'test/tmp/'+project})
          });
        }).then(function(){
          console.log('     - push to bare');
          return exec('git push origin master -u', {cwd:'test/tmp/'+project});
        });
      });
    });
  });

  it('commit changed file by a function', function() {
    return exec('node addfile.js', {cwd:'test/tmp/project1'}).then(function(out){
      return exec('git log -1 --pretty=%B', {cwd:'test/tmp/project1'})
    }).then(function(out){
      assert.equal(out.stdout.trim(),'new file');
    });
  });

  it('commit after module update', function() {
    this.timeout(10000);
    console.log('   - change dependency version');
    return exec('npm version patch', {cwd:'test/tmp/project2'}).then(function(out){
      console.log('   - push dependency');
      return exec('git push', {cwd:'test/tmp/project2'})
    }).then(function(out){
      console.log('   - do update');
      return exec('node update.js', {cwd:'test/tmp/project1'});
    }).then(function(out){
      return exec('git log -1 --pretty=%B', {cwd:'test/tmp/project1'})
    }).then(function(out){
      assert.equal(out.stdout.trim(),'Update spark-auto-commit-test2');
    });
  });
});