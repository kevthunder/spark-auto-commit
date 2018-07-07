
var asyncDone = require('async-done');

var AutoCommit = function(opt, call){
  if(call == null){
    call = opt;
    opt = {};
  }
  opt = Object.assign({},AutoCommit.defaults,opt);

  asyncDone(call, function(err){

  });

};

AutoCommit.defaults = {

}


module.export = AutoCommit