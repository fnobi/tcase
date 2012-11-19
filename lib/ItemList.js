var util = require('util');

var ItemList = function (dom) {
	this.dom = dom;
};

ItemList.prototype.format = function () {
	var lines = [];
	var count = 0;

	this.dom.forEach(function (node) {
		var idnum = padding(count++, 3);
		var name = node.children[0].data;
		var path = node.parent ? itemPath(node.parent) : '';

		lines.push(util.format(
			[
				'[%s] %s',
				' - %s'
			].join('\n'),
			idnum, name, path
		));
	});

	return lines.join('\n');
};

var padding = function (str, l) {
	return ((new Array(l).join('0')) + str + '').slice(-l);
};

var itemPath = function (node) {
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

	return itemPath(node.parent) + '/' + pathExp;
};


module.exports = ItemList;