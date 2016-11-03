var exec = require('child_process').exec;
var fs = require('fs');

exec('git rev-parse HEAD', (error, stdout, stderr) => {
    var commit = stdout.substring(0, 8).replace(/\r?\n|\r/, "");

    fs.writeFile("src/commit.js", 'module.exports = { "git_version": ' + '"1.0-' + commit + '" }', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("update version!");
    });
});
