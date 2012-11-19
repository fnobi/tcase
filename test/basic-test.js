var buster = require('buster'),
    TCase  = require(__dirname + '/..');

var samplejade = [
	'c.home',
	'  t 部屋の片付け',
	'  i ゴミ箱を片づける',
	'c.school',
	'  t 宿題'
].join('\n');

buster.testCase('basic', {
	'select all': function () {
		var tcase = new TCase(samplejade);

		assert(
			tcase.select('t,i').format()
			== [
				't\t部屋の片付け\t(/home)',
				'i\tゴミ箱を片づける\t(/home)',
				't\t宿題\t(/school)'
			].join('\n')
		);
	},
	'select task': function () {
		var tcase = new TCase();
		tcase.addSource(samplejade);

		assert(
			tcase.select('t').format()
			== [
				't\t部屋の片付け\t(/home)',
				't\t宿題\t(/school)'
			].join('\n')
		);
	}
});