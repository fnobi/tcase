var fs       = require('fs'),
    jade     = require('jade');

var cheerio  = {
	select : require('cheerio-select'),
	parse  : require('cheerio')
};

var ItemList = require(__dirname + '/lib/ItemList');


var TCase = function (source) {
	this.xml = this.compile(source);
};

TCase.prototype.compile = function (source) {
	return jade.compile(source, {})({});
};

TCase.prototype.select = function (selector) {
	var dom = cheerio.parse(this.xml);
	var filteredDom = cheerio.select(selector, dom);

	return new ItemList(filteredDom);
};

module.exports = TCase;