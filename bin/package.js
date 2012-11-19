require('../src/core/_package');

require('util').puts(JSON.stringify({
  'private': true,
  'name': 'triflow',
  'version': triflow.version,
  'description': 'Trifacta JavaScript Data Utilities.',
  'keywords': ['data', 'trifacta'],
  'homepage': 'http://trifacta.com',
  'author': {'name': 'Trifacta Inc.', 'url': 'http://trifacta.com'},
  'repository': {
    'type': 'git', 'url': 'http://github.com/trifacta/triflow.git'
  },
  'main': 'index.js',
  'dependencies': {
    'underscore': '1.3.3'
  },
  'devDependencies': {
    'optimist': '0.3.5',
    'snockets': '1.3.8',
    'uglify-js': '1.3.2',
    'vows': '0.7.0'
  },
  'scripts': {'test': './node_modules/vows/bin/vows'}
}, null, 2));
