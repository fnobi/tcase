var colors = require('colors'),
    util   = require('util'),
    _      = require('underscore');

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
	var type = this.node.tagName.toLowerCase();
	var path = this.parent() ? this.parent().path() : '';
	return this.name() + (
		' / ' + (ancestor ? path : '') + type
	).blue;
};

Item.prototype.type = function () {
	return this.node.tagName;
};

// nameを表示 (id, className, contentのどれか。)
// TODO: 命名見直しの余地あり
Item.prototype.name = function () {
	var id = this.id();
	var className = this.className();
	var content = this.content();

	return id || className || content || null;
};

// idプロパティを返す (#を付ける)
Item.prototype.id = function () {
	var node = this.node;
	return node.id ? '#' + node.id :  '';
};

// classNameを返す (.を付ける)
Item.prototype.className = function () {
	var node = this.node;
	return node.className ? '.' + node.className : '';
};

// nodeの最初のテキストノードを表示 (""で囲む)
Item.prototype.content = function () {
	var node = this.node;
	var textContent = node.textContent;

	// textContentがないなら、しょうがない
	if (!textContent) {
		return 'no content';
	}

	// 子ノードがないなら、そのままtextContentを使えばよい
	if (!node.children.length) {
		return '"' + textContent + '"';
	}

	// 子がいるなら、子のコンテンツは除きたい
	//  -> 最初の子のtextContentをとり、それにマッチした場所より先は削る
	var firstChild = node.children[0];
	var childContent = firstChild.textContent;
	var index = textContent.indexOf(childContent);

	return '"' + textContent.slice(0, index) + '"';
};

Item.prototype.subItem = function () {
	var node = this.node;
	var subItem = [];

	if (!node.children) {
		return subItem;
	}

	_.forEach(node.children, function (subNode) {
		subItem.push(new Item(subNode));
	});

	return subItem;
};

Item.prototype.path = function () {
	var pathExp = this.name();

	if (!pathExp) {
		return '';
	}

	pathExp += ' > ';

	if (!this.parent() || this.parent().type() == 'BODY') {
		return pathExp;
	}

	// pathの一番上がidなら、それ以上親を辿らなくてよい (uniqなはず)
	if (pathExp.match(/^#/)) {
		return pathExp;
	}

	return this.parent().path() + pathExp;
};

Item.prototype.parent = function () {
	var node = this.node;
	if (!node.parentNode) {
		return null;
	}
	return new Item(node.parentNode);
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
		return null;
	};

	var lines = [];
	var subItems = this.subItem();

	_.forEach(subItems, function (subItem, index) {
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