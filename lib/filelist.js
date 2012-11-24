var fs    = require('fs'),
    path  = require('path'),
    async = require('async');

var filelist = {
	indexFile: process.env.HOME + '/.tcase'
};

// 設定ファイルから、jadeファイルのリストをとってくる
filelist.list = function () {
	var indexFile = filelist.indexFile;

	if (!(fs.existsSync || path.existsSync)(indexFile)) {
		fs.writeFileSync(indexFile, '');
		return [];
	}

	var content = fs.readFileSync(indexFile, 'utf8');
	return (content || '').trim().split(/\n+/);
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
	return filelist.list().join('\n');
};

// jadeのリストにファイルを追加
filelist.addFile = function (filepath) {
	if (!filelist.isValidFile(filepath)) {
		return false;
	}

	var content = filelist.list();
	content.push(filepath);
	fs.writeFileSync(filelist.indexFile, content.join('\n'));
};

// 使用できるファイルかどうかを確認
filelist.isValidFile = function (filepath) {
	if (!(fs.existsSync || path.existsSync)(filepath)) {
		return false;
	}

	return true;
};

module.exports = filelist;