var _ = require('lodash');
var names = require('./names');
var finder = require('./finder');
var startsWith = require('./startsWith');

var f = _.compose(startsWith('Name'), _.identity);
console.log(_.filter(names, f));
console.log(finder(names));
