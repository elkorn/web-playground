var contacts = [{
    key: 1,
    name: 'Foo Bar',
    email: 'foobar@foobar.com',
    description: 'Foo + Bar'
}, {
    key: 2,
    name: 'Baz Quux',
    email: 'bazquux@foobar.com',
    description: 'Baz + Quux'
}];

var newContact = {
    name: '',
    email: '',
    description: ''
};

var ContactItem = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        description: React.PropTypes.string
    },
    render: function() {
        return (
            React.createElement('li', {
                className: 'Contact'
            }, React.createElement('h2', {
                className: 'Contact-name'
            }, this.props.name), React.createElement('a', {
                href: 'mailto:' + this.props.email
            }, this.props.email)));
    }
});

var ContactForm = React.createClass({
    propTypes: {
        contact: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    render() {
        var self = this;
        var previousContact = this.props.contact;
        var onChange = this.props.onChange;

        function update(prop) {
            return function(event) {
                var patch = {};
                patch[prop] = event.target.value;
                onChange(Object.assign({}, previousContact, patch));
            };
        }

        return (
            React.createElement('form', {},
                                React.createElement('input', {
                                    type: 'text',
                                    value: this.props.contact.name,
                                    htmlFor: 'name',
                                    placeholder: 'Name',
                                    onChange: update('name')
                                }),
                                React.createElement('input', {
                                    type: 'email',
                                    value: this.props.contact.email,
                                    htmlFor: 'email',
                                    placeholder: 'Email',
                                    onChange: update('email')
                                }),
                                React.createElement('textarea', {
                                    type: 'description',
                                    value: this.props.contact.description,
                                    htmlFor: 'description',
                                    placeholder: 'Description',
                                    onChange: update('description')
                                }),
                                React.createElement('button', {
                                    type: 'submit'
                                }, 'Add contact')));
    }
});

var ContactView = React.createClass({
    propTypes: {
        contacts: React.PropTypes.array.isRequired,
        newContact: React.PropTypes.object.isRequired
    },
    render() {
        var contactItems = this.props.contacts.map(function(contact) {
            return React.createElement(ContactItem, contact);
        });
        return (
            React.createElement('div', {},
                                React.createElement('h1', {}, "Contacts"),
                                React.createElement('ul', {}, contactItems),
                                React.createElement(ContactForm, {
                                    contact: this.props.newContact,
                                    onChange: this.props.onChange
                                })
                               ));
    }
});

function onContactChange(contact) {
    Object.assign(newContact, contact);

    ReactDOM.render(React.createElement(ContactView, {
        contacts: contacts,
        newContact: newContact,
        onChange: onContactChange
    }), document.getElementById('react-app'));
}

ReactDOM.render(React.createElement(ContactView, {
    contacts: contacts,
    newContact: newContact,
    onChange: onContactChange
}), document.getElementById('react-app'));
