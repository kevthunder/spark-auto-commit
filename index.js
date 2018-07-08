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

AutoCommit.afterModuleUpdate = function(opt, cb){
  return AutoCommit(opt, function(){
    return exec('npm update --json', {}).then(function(out){
      res = JSON.parse(out.stdout)
      updates = AutoCommit.filterModuleUpdates(res.updated, opt.filter);
      if(updates.length > 0){
        return asyncDone(cb).then(function(res){
          return 'Update ' + AutoCommit.englishEnumeration(updates.map(function(u){
            return u.name;
          }));
        });
      }
    });
  });
}

AutoCommit.filterModuleUpdates = function(updates, filter){
  return updates.filter(function(u){
    return u.version !== u.previousVersion && (
        typeof filter == null ||
        (typeof filter === "function" && filter(u)) ||
        (typeof ilter.test === "function" && filter.test(u.name))
      )
  });
} 


AutoCommit.englishEnumeration = function(items){
  if(items.length == 1){
    return items[0];
  }else if(items.length > 1){
    var last = items[items.length-1]
    return items.slice(0,items.length-1).join(', ') + ' and ' + last
  }
  return null;
}



module.exports = AutoCommit