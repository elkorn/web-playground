var routes = {
    '#/': function() {
        return React.createElement('section', {}, 'Main page');
    }
};

var notFound = function() {
    return React.createElement('section', {}, 'Not found');
};

function navigated() {
    ReactDOM.render((routes[window.location.hash] || notFound)(), document.getElementById('react-app'));
}

navigated();

window.addEventListener('hashchange', navigated, false);
