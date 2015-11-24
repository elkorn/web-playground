import _ from 'lodash';
import startsWith from './startsWith';

export default function (domain) {
    return _.filter(domain, startsWith('Name'));
}
