var colors = require('colors'),
    util   = require('util');

var Item = function (node) {
	this.node = node;
};

Item.prototype.format = function() {
	var node = this.node;

	var type = this.type();
	var name = this.name();
	var path = this.parent() ? this.parent().path() : '';

	var lines = [
		name + ' ' + ('[' + type + '] ').blue
	];

	if (path) {
		lines.push((' - ' + path + 'this').grey);
	}

	if (this.subItem().length) {
		lines.push(
			(' - has ' + this.subItem().length + ' sub item.').grey
		);
	}

	return lines.join('\n');
};

Item.prototype.type = function () {
	return this.node.name;
};

Item.prototype.name = function () {
	var node = this.node;
	var attr = node.attribs || {};

	var id = attr.id ? '#' + attr.id :  '';
	var className = attr.class ? '.' + attr.class : '';
	var content = node.name == 't' ? node.children[0].data : '';

	return id || className || content || null;
};

Item.prototype.subItem = function () {
	var node = this.node;
	var subItem = [];

	if (!node.children) {
		return subItem;
	}

	node.children.forEach(function (subNode) {
		if (subNode.type == 'tag') {
			subItem.push(new Item(subNode));
		}
	});

	return subItem;
};

Item.prototype.path = function () {
	var pathExp = this.name();

	if (!pathExp) {
		return '';
	}

	if (!this.parent()) {
		return pathExp;
	}

	return this.parent().path() + pathExp + ' > ';
};

Item.prototype.parent = function () {
	var node = this.node;
	if (!node.parent) {
		return null;
	}
	return new Item(node.parent);
};

module.exports = Item;