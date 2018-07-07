var fs = require('fs');
var util = require('util');
var ncp = util.promisify(require('ncp').ncp);



describe('AutoCommit', function() {
  it('copy repo to temp folder', function() {

    if (!fs.existsSync('test/tmp')){
        fs.mkdirSync('test/tmp');
    }
    return ncp('test/repos/project1', 'test/tmp/project1');
  });
});