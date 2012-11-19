var util = require('util');

var Item = function (node) {
	this.node = node;
};

Item.prototype.format = function() {
	var node = this.node;

	var type = node.name;
	var name = node.children[0].data;
	var path = node.parent ? this.path(node.parent) : '';

	return util.format(
		[
			'[%s] %s',
			' - %s'
		].join('\n'),
		type, name, path
	);
};

Item.prototype.path = function (node) {
	node = node || this.node;

	var id = node.attribs ? node.attribs['id'] : '';
	var className = node.attribs ? node.attribs['class'] : '';
	var line = node.name == 't' ? node.children[0].data : '';

	var pathExp = id || className || line || null;

	if (!pathExp) {
		return '';
	}

	if (!node.parent) {
		return '/' + pathExp;
	}

	return this.path(node.parent) + '/' + pathExp;
};

module.exports = Item;