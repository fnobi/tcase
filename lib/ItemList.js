var ItemList = function (dom) {
	this.dom = dom;
};
ItemList.prototype.format = function () {
	var lines = [];

	this.dom.forEach(function (node) {
		lines.push([
			node.name,
			node.children[0].data,
			'(/' + node.parent.name + ')'
		].join('\t'));
	});

	return lines.join('\n');
};

module.exports = ItemList;