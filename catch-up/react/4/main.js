var state = {};

function contactTemplate() {
    return {
        name: '',
        email: '',
        description: ''
    };
}


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

function updateOnChange(prop, stateProp) {
    return function(event) {
        var previousState = this.props[stateProp];
        var onChange = this.props.onChange;

        var patch = {};
        patch[prop] = event.target.value;
        onChange(Object.assign({}, previousState, patch));
    };
}

var ContactForm = React.createClass({
    propTypes: {
        contact: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        submitNewContact: React.PropTypes.func.isRequired
    },
    updateName: updateOnChange('name', 'contact'),
    updateEmail: updateOnChange('email', 'contact'),
    updateDescription: updateOnChange('description', 'contact'),
    submitNewContact: function(e) {
        e.preventDefault();
        this.props.submitNewContact(this.props.contact);
    },
    render() {
        return (
            React.createElement('form', {
                onSubmit: this.submitNewContact
            },
                                React.createElement('input', {
                                    type: 'text',
                                    value: this.props.contact.name,
                                    htmlFor: 'name',
                                    placeholder: 'Name',
                                    onChange: this.updateName
                                }),
                                React.createElement('input', {
                                    type: 'email',
                                    value: this.props.contact.email,
                                    htmlFor: 'email',
                                    placeholder: 'Email',
                                    onChange: this.updateEmail
                                }),
                                React.createElement('textarea', {
                                    type: 'description',
                                    value: this.props.contact.description,
                                    htmlFor: 'description',
                                    placeholder: 'Description',
                                    onChange: this.updateDescription
                                }),
                                React.createElement('button', {
                                    type: 'submit'
                                }, 'Add contact')));
    }
});

var ContactView = React.createClass({
    propTypes: {
        contacts: React.PropTypes.array.isRequired,
        newContact: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        submitNewContact: React.PropTypes.func.isRequired
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
                                    onChange: this.props.onChange,
                                    submitNewContact: this.props.submitNewContact
                                })
                               ));
    }
});

function submitNewContact(contactToAdd) {
    var existingContacts = state.contacts;
    var newContact = Object.assign({
        key: state.contacts.length
    }, contactToAdd);

    setState({
        contacts: state.contacts.concat([newContact]),
        newContact: contactTemplate()
    });
}

function renderApplication(state) {
    ReactDOM.render(React.createElement(ContactView, {
        contacts: state.contacts,
        newContact: state.newContact,
        onChange: onContactChange,
        submitNewContact
    }), document.getElementById('react-app'));
}

function onContactChange(contact) {
    setState({
        newContact: contact
    });
}

function setState(changes) {
    renderApplication(Object.assign(state, changes));
}

setState({
    contacts: [{
        key: 0,
        name: 'Foo Bar',
        email: 'foobar@foobar.com',
        description: 'Foo + Bar'
    }, {
        key: 1,
        name: 'Baz Quux',
        email: 'bazquux@foobar.com',
        description: 'Baz + Quux'
    }],
    newContact: {
        name: '',
        email: '',
        description: ''
    }
});
