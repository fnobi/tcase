var fs       = require('fs'),

    ItemList = require(__dirname + '/lib/ItemList'),

    async    = require('async'),
    config   = require('config'),
    jade     = require('jade');

var cheerio  = {
      select : require('cheerio-select'),
      parse  : require('cheerio')
};

var TCase = function (initSource) {
	this.source = '';
	this.addSource(initSource);
};

TCase.prototype.addSource = function (source) {
	source = source || '';
	this.source += '\n' + source;
};

TCase.prototype.xmlSource = function () {
	return jade.compile(this.source, {})({});
};

TCase.prototype.select = function (selector) {
	var dom = cheerio.parse(this.xmlSource());
	var filteredDom = cheerio.select(selector, dom);

	return new ItemList(filteredDom);
};

TCase.sourceDir = config.sourceDir.replace(/^~/, process.env.HOME);

TCase.sourceFiles = function (callback) {
	var sourceFiles = [];

	fs.readdir(TCase.sourceDir, function (err, res) {
		res.forEach(function (sourceFile) {
			if (sourceFile.match(/^[^.].*\.jade/)) {
				sourceFiles.push(TCase.sourceDir + sourceFile);
			}
		});
		callback(err, sourceFiles);
	});
};


module.exports = TCase;