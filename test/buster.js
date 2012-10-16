var config = module.exports;

config['tcase test'] = {
    rootPath: '../',
    environment: 'node', // 'browser' or 'node'
    // sources: [
    //     'lib/model'
    // ],
    tests: [
        'test/*-test.js'
    ]
}