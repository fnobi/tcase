var fs       = require('fs'),
    jade     = require('jade');

var cheerio  = {
	select : require('cheerio-select'),
	parse  : require('cheerio')
};
var jsdom = require("jsdom");
var ItemList = require(__dirname + '/lib/ItemList');


var TCase = function (source) {
	this.xml = this.compile(source);
};

TCase.prototype.compile = function (source) {
	return jade.compile(source, {})({});
};

TCase.prototype.select = function (selector, callback) {
	jsdom.env(
		this.xml,
		["http://code.jquery.com/jquery.js"],
		function(errors, window) {
			var $ = window.$;
			callback(null, new ItemList($(selector)));
		}
	);

	// with cheerio-select ver.
	// var dom = cheerio.parse(this.xml);
	// var filteredDom = cheerio.select(selector, dom);

	// return new ItemList(filteredDom);
};

module.exports = TCase;