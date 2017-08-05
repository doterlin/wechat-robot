var execFile = require("child_process").execFile;
execFile("node", ["./src/lib/open.js"], null, function (err, stdout, stderr) {
    console.log("execFileSTDOUT:", stdout);
    phantom.exit();
});