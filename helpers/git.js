var util = require('util');
var exec = util.promisify(require('child_process').exec);
var shellescape = require('any-shell-escape');

module.exports = {
  checkRepoClean: function(fn){
    return exec('git status --porcelain', {}).then(function(out){
      return out.stdout === "";
    });
  },

  addAndCommit: function(msg){
    msg = msg || "compile"
    return exec('git add -A', {}).then(function(out){
      return exec(shellescape(['git','commit','-m',msg]), {})
    });
  }
}
