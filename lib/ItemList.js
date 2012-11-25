var _    = require('underscore'),
    Item = require(__dirname + '/Item');

var ItemList = function (nodes) {
	this.nodes = nodes;
	this.initItems();
};

ItemList.prototype.initItems = function () {
	var nodes = this.nodes;

	var items = [];
	_.forEach(nodes, function (node) {
 		items.push(new Item(node));
	});

	items = ItemList.removeaDescendant(items);

	this.items = items;
	return items;
};

ItemList.prototype.format = function () {
	var lines = [];

	this.items.forEach(function (item) {
		lines.push(item.format());
	});

	return lines.join('\n\n');
};

// itemsのうち、他のitemの子孫にあたるものを除く
// TODO: 絶対に遠回りしているので、underscoreなどしっかり調べて書き直すこと!
ItemList.removeaDescendant = function (items) {
	// itemsをいったんparamsにコピーしていく
	var params = [];
	items.forEach(function (item) {
		var param = {
			item: item,
			path: item.path()
		};
		params.push(param);
	});

	// それぞれ、自分の先祖(pathが途中まで一致する)がいるかどうかを確かめる
	params.forEach(function (param, index) {
		param.isDescendant = _.any(params, function (another) {
			if (param.path == another.path) {
				return false;
			}

			if (param.path.indexOf(another.path) < 0) {
				return false;
			}

			return true;
		});
		params[index] = param;
	});

	// isDescendantがついたものを除いて、新しくnewItemsをつくる
	var newItems = [];
	_.map(params, function (param) {
		if (!param.isDescendant) {
			return newItems.push(param.item);
		}
	});

	return newItems;
};

module.exports = ItemList;