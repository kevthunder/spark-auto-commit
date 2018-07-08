var util = require('util');
var asyncDone = util.promisify(require('async-done'));
var exec = util.promisify(require('child_process').exec);
var shellescape = require('any-shell-escape');


var AutoCommit = function(opt, cb){
  if(cb == null){
    cb = opt;
    opt = {};
  }
  opt = Object.assign({},AutoCommit.defaults,opt);

  return AutoCommit.checkRepoClean().then(function(clean){
    if(!clean){
      return Promise.reject('Working tree is not clean');
    }
  }).then(function(){
    return asyncDone(cb);
  }).then(function(res){
    return AutoCommit.checkRepoClean().then(function(clean){
      if(clean){
        return 'No change done. Nothing to do';
      }else{
        return AutoCommit.addAndCommit(res).then(function(res){
          return 'Changes commited';
        });
      }
    });
  });

};

AutoCommit.defaults = {

}


AutoCommit.checkRepoClean = function(fn){
  return exec('git status --porcelain', {}).then(function(out){
    return out.stdout === "";
  });
}


AutoCommit.addAndCommit = function(msg){
  msg = msg || "compile"
  return exec('git add -A', {}).then(function(out){
    return exec(shellescape(['git','commit','-m',msg]), {})
  });
}



module.exports = AutoCommit