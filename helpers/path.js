var slash = require('slash');
var path = require('path');

module.exports = {
  uriResolve : function(p){
    return slash(path.resolve(p)).replace(/^([\w]):/,'/$1')
  }
}