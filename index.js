var fs       = require('fs'),
    jade     = require('jade'),
    jsdom    = require("jsdom"),
    ItemList = require(__dirname + '/lib/ItemList');

var TCase = function (source) {
	this.xml = this.compile(source);
};

TCase.prototype.compile = function (source) {
	return jade.compile(source, {})({});
};

TCase.prototype.select = function (selector, callback) {
	jsdom.env(
		this.xml,
		[__dirname + '/lib/jquery-1.8.2.js'],
		function(errors, window) {
			var $ = window.$;
			callback(null, new ItemList($(selector)));
		}
	);
};

module.exports = TCase;