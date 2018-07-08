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

  return AutoCommit.whenRepoClean(function(){
    return asyncDone(cb).then(function(res){
      return AutoCommit.whenRepoDirty(function(){
        return AutoCommit.addAndCommit(res).then(function(res){
          return 'Changes commited';
        });
      });
    });
  }).then(function(res){
    return 'Done :' + res;
  }).catch(function(err){
    console.log('Error :',err);
  });

};

AutoCommit.defaults = {

}


AutoCommit.checkRepoClean = function(fn){
  return exec('git status --porcelain', {}).then(function(out){
    return out.stdout === "";
  });
}

AutoCommit.whenRepoClean = function(fn){
  return exec('git status --porcelain', {}).then(function(out){
    if(out.stdout === ""){
      return fn();
    }else{
      return Promise.reject('Working tree is not clean');
    }
  })
}


AutoCommit.whenRepoDirty = function(fn){
  return exec('git status --porcelain', {}).then(function(out){
    if(out.stdout !== ""){
      return fn();
    }else{
      return 'Working tree is clean';
    }
  })  
}


AutoCommit.addAndCommit = function(msg){
  msg = msg || "compile"
  return exec('git add -A', {}).then(function(out){
    return exec(shellescape(['git','commit','-m',msg]), {})
  });
}



module.exports = AutoCommit