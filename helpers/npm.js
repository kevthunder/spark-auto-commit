var util = require('util');
var exec = util.promisify(require('child_process').exec);


module.exports = {
  getUpdates : function(){
    return exec('npm update --json', {}).then(function(out){
      return JSON.parse(out.stdout)
    });
  },
  filterModuleUpdates : function(updates, filter){
    return updates.filter(function(u){
      return u.version !== u.previousVersion && (
          filter == null ||
          (typeof filter === "function" && filter(u)) ||
          (typeof filter.test === "function" && filter.test(u.name))
        )
    });
  } 
} 