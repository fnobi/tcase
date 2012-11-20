var colors = require('colors'),
    util   = require('util');

var Item = function (node) {
	this.node = node;
};

Item.prototype.format = function() {
	var node = this.node;

	var name = this.name();
	var path = this.parent() ? this.parent().path() : '';

	var lines = [name];

	if (path) {
		lines[0] += (' - ' + path + this.type()).grey;
	}

	if (this.subItem().length) {
		lines.push(this.tree());
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
	var content = node.name.match(/^[ti]$/) ? '"' + node.children[0].data + '"' : '';

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

	pathExp += ' > ';

	if (!this.parent()) {
		return pathExp;
	}

	// pathの一番上がidなら、それ以上親を辿らなくてよい (uniqueなはず)
	if (pathExp.match(/^#/)) {
		return pathExp;
	}

	return this.parent().path() + pathExp;
};

Item.prototype.parent = function () {
	var node = this.node;
	if (!node.parent) {
		return null;
	}
	return new Item(node.parent);
};

Item.prototype.tree = function (indent) {
	indent = indent || ' ';

	var li = function (item, last) {
		if (item && last) {
			return '└--';
		} else if (item && !last) {
			return '├--';
		} else if (!item && last) {
			return '    ';
		} else if (!item && !last) {
			return '|   ';
		}
	};

	var lines = [];
	var subItems = this.subItem();

	subItems.forEach(function (subItem, index) {
		var last = index == subItems.length - 1;

		lines.push(
			indent + li(true, last) + subItem.name() + (' - ' + subItem.type()).grey
		);

		if (subItem.subItem().length) {
			lines.push(subItem.tree(
				indent + li(false, last)
			));
		}
	});

	return lines.join('\n');
};

module.exports = Item;