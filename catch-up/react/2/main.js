var contacts = [{
    key: Math.random(),
    name: 'Foo Bar',
    email: 'foobar@foobar.com'
}, {
    key: Math.random(),
    name: 'Baz Quux',
    email: 'bazquux@foobar.com'
}];

var listElements = contacts
    .map(function(contact) {
        return React.createElement('li', {
            key: contact.key
        }, React.createElement('h2', {}, contact.name), React.createElement('a', {
            href: 'mailto:' + contact.email
        }, contact.email));
    });

var root = React.createElement('div', {}, React.createElement('h1', {}, "Contacts"), React.createElement('ul', {}, listElements));

ReactDOM.render(root, document.getElementById('react-app'));
