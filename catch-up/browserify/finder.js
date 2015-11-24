var _ = require('lodash');
var startsWith = require('./startsWith');

module.exports = function (domain) {
    return _.filter(domain, startsWith('Name'));
};
