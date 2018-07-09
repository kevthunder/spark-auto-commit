var util = require('util');
var asyncDone = util.promisify(require('async-done'));
var exec = util.promisify(require('child_process').exec);
var git = require('./helpers/git');
var npm = require('./helpers/npm');
var str = require('./helpers/string');



var AutoCommit = function(opt, cb){
  if(cb == null){
    cb = opt;
    opt = {};
  }
  opt = Object.assign({},AutoCommit.defaults,opt);

  return git.checkRepoClean().then(function(clean){
    if(!clean){
      return Promise.reject('Working tree is not clean');
    }
  }).then(function(){
    return asyncDone(cb);
  }).then(function(res){
    return git.checkRepoClean().then(function(clean){
      if(clean){
        return 'No change done. Nothing to do';
      }else{
        return git.addAndCommit(res).then(function(res){
          return 'Changes commited';
        });
      }
    });
  });

};

AutoCommit.defaults = {

}

AutoCommit.afterModuleUpdate = function(opt, cb){
  if(cb == null){
    cb = opt;
    opt = {};
  }
  return AutoCommit(opt, function(){
    return npm.getUpdates().then(function(res){
      var updates = npm.filterModuleUpdates(res.updated, opt.filter);
      if(updates.length > 0){
        return asyncDone(cb).then(function(res){
          return 'Update ' + str.englishEnumeration(updates.map(function(u){
            return u.name;
          }));
        });
      }
    });
  });
}




module.exports = AutoCommit