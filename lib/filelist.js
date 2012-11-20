var fs          = require('fs'),
    async       = require('async'),
    sourceFiles = require(__dirname + '/../filelist.json');

var filelist = {};

filelist.concat = function (callback) {
	var sourceTexts = [];

	async.forEach(sourceFiles, function (sourceFile, callback) {
		fs.readFile(sourceFile, 'utf8', function (err, content) {
			sourceTexts.push(content);
			callback(err, true);
		});
	}, function (err, res) {
		callback(err, sourceTexts.join('\n'));
	});
};

filelist.ls = function () {
	return sourceFiles.join('\n');
};

module.exports = filelist;

