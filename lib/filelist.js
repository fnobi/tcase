var fs    = require('fs'),
    path  = require('path'),
    async = require('async');

var filelist = {};

// 設定ファイルから、jadeファイルのリストをとってくる
filelist.list = function () {
	var listfile = process.env.HOME + '/.tcase';

	if (!(fs.existsSync || path.existsSync)(listfile)) {
		fs.writeFileSync(listfile, '');
		return '';
	}

	var content = fs.readFileSync(listfile, 'utf8');
	return (content || '').split(/\n+/);
};

// jadeファイルを全て繋げてcallbackする
filelist.concat = function (callback) {
	var sourceTexts = [];

	async.forEach(filelist.list(), function (sourceFile, callback) {
		fs.readFile(sourceFile, 'utf8', function (err, content) {
			sourceTexts.push(content);
			callback(err, true);
		});
	}, function (err, res) {
		callback(err, sourceTexts.join('\n'));
	});
};

// 一覧出力用に、jadeファイルのリストを返す
filelist.ls = function () {
	return filelist.list.join('\n');
};

module.exports = filelist;