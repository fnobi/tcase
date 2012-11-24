var colors = require('colors'),
    util   = require('util');

var Item = function (node) {
	this.node = node;
};

// itemを見やすい形に整形した文字列を返す
Item.prototype.format = function() {
	var node = this.node;

	var lines = [
		this.toString(true)
	];

	if (this.subItem().length) {
		lines.push(this.tree());
	}

	return lines.join('\n');
};

// 文字列表現にして返す(1行の表現)
Item.prototype.toString = function (ancestor) {
	var path = this.parent() ? this.parent().path() : '';
	return this.name() + (
		' / ' + (ancestor ? path : '') + this.type()
	).blue;
};

Item.prototype.type = function () {
	return this.node.name;
};

Item.prototype.name = function () {
	var node = this.node;
	var attr = node.attribs || {};
	var child = node.children[0];

	var id = attr.id ? '#' + attr.id :  '';
	var className = attr.class ? '.' + attr.class : '';
	var content = child.type == 'text' ? '"' + child.data + '"' : '';

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
			return '└--'.grey;
		} else if (item && !last) {
			return '├--'.grey;
		} else if (!item && last) {
			return '    '.grey;
		} else if (!item && !last) {
			return '|   '.grey;
		}
	};

	var lines = [];
	var subItems = this.subItem();

	subItems.forEach(function (subItem, index) {
		var last = index == subItems.length - 1;

		lines.push(
			indent + li(true, last) + subItem.toString()
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