var util = require('util');
var exec = util.promisify(require('child_process').exec);


module.exports = {
  getUpdates : function(){
    return exec('npm update --json', {}).then(function(out){
      return JSON.parse(out.stdout)
    });
  },
  filterModuleUpdates : function(changes, filter){
    return changes.added.filter( (added) => {
      if(this.testChangeFilter(added,filter)){
        var matching = changes.removed.find(function(removed){
          return removed.name == added.name
        });
        return matching != null && added.version !== matching.version
      }
      return false
    }).concat(changes.updated.filter( (updated) => {
      return updated.version !== updated.previousVersion && this.testChangeFilter(updated,filter)
    }))
  },
  testChangeFilter: function(change,filter){
    return filter == null ||
          (typeof filter === "function" && filter(change)) ||
          (typeof filter.test === "function" && filter.test(change.name));
  }
} 