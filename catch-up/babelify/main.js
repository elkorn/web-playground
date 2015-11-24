import _ from 'lodash';
import names from './names';
import finder from './finder';
import startsWith from './startsWith';

const f = _.compose(startsWith('Name'), _.identity);
console.log(_.filter(names, f));
console.log(finder(names));
