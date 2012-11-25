var fs    = require('fs'),
    path  = require('path'),
    async = require('async'),
    _     = require('underscore');

var filelist = {
	indexFile: process.env.HOME + '/.tcase'
};

// 設定ファイルから、jadeファイルのリストをとってくる
filelist.list = function () {
	var indexFile = filelist.indexFile;

	if (!(fs.existsSync || path.existsSync)(indexFile)) {
		filelist.touch(indexFile);
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
	filepath = filelist.validate(filepath);

	if (!filepath) {
		return false;
	}

	var content = filelist.list();
	content.push(filepath);

	filelist.updateIndexFile(content);
};

// jadeのリストからファイルを削除
filelist.removeFile = function (filepath) {
	filepath = filelist.validate(filepath);

	if (!filepath) {
		return false;
	}

	var content = filelist.list();
	content = _.without(content, filepath);

	fs.unlinkSync(filepath);

	filelist.updateIndexFile(content);
};

filelist.updateIndexFile = function (content) {
	fs.writeFileSync(filelist.indexFile, content.join('\n'));
};


// 使用できるファイルかどうかを確認
filelist.validate = function (filepath) {
	if (!filepath) {
		return false;
	}

	// filepathを正規化
	filepath = filelist.resolve(filepath);

	if (!(fs.existsSync || path.existsSync)(filepath)) {
		filelist.touch(filepath);
	}

	return filepath;
};

// filepathの ~ や . を展開する
// TODO: testcase書かないとこわいな…
filelist.resolve = function (filepath) {
	if (filepath.match(/^~/)) {
		filepath = filepath.replace(/^~/, process.env.HOME);
	}

	if (!filepath.match(/^\//)) {
		filepath = [process.cwd(), filepath].join('/');
	}

	while (filepath.match(/[^.]+\/\.\./)) {
		filepath = filepath.replace(/[^.]+\/\.\./, '');
	}

	while (filepath.match(/\/\./)) {
		filepath = filepath.replace(/\/\./, '');
	}

	while (filepath.match(/\/\/+/)) {
		filepath = filepath.replace(/\/\/+/, '/');
	}

	return filepath;
};

// 空のファイルを作成
filelist.touch = function (filepath) {
	fs.writeFileSync(filepath, '');
};

module.exports = filelist;