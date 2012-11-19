var Item = require(__dirname + '/Item');

var ItemList = function (nodes) {
	this.nodes = nodes;
	this.initItems();
};

ItemList.prototype.initItems = function () {
	var items = [];
	this.nodes.forEach(function (node) {
		items.push(new Item(node));
	});
	this.items = items;
	return items;
};

ItemList.prototype.format = function () {
	var lines = [];

	this.items.forEach(function (item) {
		lines.push(item.format());
	});

	return lines.join('\n');
};

module.exports = ItemList;