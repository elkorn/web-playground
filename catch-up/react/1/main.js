var el = React.createElement.bind(React);
var root = el(
    'div', {},
    el('h1', {}, 'Contacts'),
    el('ul', {},
       el('li', {},
          el('h2', {}, 'Foo Bar'),
          el('a', {href: 'mailto: foobar@foobar.com'}, 'foobar@foobar.com')
         ),
       el('li', {},
          el('h2', {}, 'Baz Quux'),
          el('a', {href: 'mailto: bazquux@foobar.com'}, 'bazquux@foobar.com')
         )
      )
);

ReactDOM.render(root, document.getElementById('react-app'));
