function SchemaRepository(_primitiveSchemas, _derivativeSchemas) {

    var primitiveSchemas = {};
    var derivativeSchemas = {};

    _primitiveSchemas.forEach(function(schema) {
        primitiveSchemas[schema.name] = new Schema(schema.shape);
    });

    _derivativeSchemas.forEach(function(schema) {
        derivativeSchemas[schema.name] = new Schema(schema.shape);
    });

    function SchemaMultiple(schema) {
        this.schema = schema;
    }

    function getASchema(key) {
        return primitiveSchemas[key] || derivativeSchemas[key];
    }

    function Schema(definition) {
        var self = this;
        this._nestedSchemaProps = {};
        this._definition = definition.map(function(def, index) {
            var matches = /(.+):schema(\*)?:(.+)/g.exec(def);
            if (matches === null) {
                return def;
            }

            self._nestedSchemaProps[index] = matches[1];
            if (matches[2]) {
                return new SchemaMultiple(getASchema(matches[3]));
            }

            return getASchema(matches[3]);
        });
    }

    Schema.prototype.parseOne = function(arr) {
        var self = this;
        return arr.reduce(function(result, element, index) {
            var def = self._definition[index];
            if (def instanceof SchemaMultiple) {
                result[self._nestedSchemaProps[index]] = def.schema.parseMany(element);
            } else if (def instanceof Schema) {
                result[self._nestedSchemaProps[index]] = def.parseOne(element);
            } else {
                result[self._definition[index]] = element;
            }

            return result;
        }, {});
    };

    Schema.prototype.parseMany = function(arr) {
        return arr.map(this.parseOne.bind(this));
    };

    this.Schema = Schema;

    this.schemas = Object.keys(primitiveSchemas).reduce(function(result, key) {
        result[key] = primitiveSchemas[key];
        return result;
    }, {});

    this.schemas = Object.keys(derivativeSchemas).reduce(function(result, key) {
        result[key] = derivativeSchemas[key];
        return result;
    }, this.schemas);


    this.parseOne = function(name) {
        var schema = getASchema(name);
        return schema.parseOne.bind(schema);
    };

    this.parseMany = function(name) {
        var schema = getASchema(name);
        return schema.parseMany.bind(schema);
    };
}

var repo = new SchemaRepository([{
    name: 's1',
    shape: ['c', 'd', 'e']
}], [{
    name: 'dependentSchema',
    shape: ['f', 'k:schema:s1', 'g']
}, {
    name: 'dependentSchemaWithArray',
    shape: ['f', 'k:schema*:s1', 'g']
}, {
    name: 'nestedDependent',
    shape: ['x', 'y:schema:dependentSchema', 'z']
}]);

console.log(repo.schemas.dependentSchema.parseOne([1, [1, 2, 3], 4]));
console.log(repo.schemas.dependentSchemaWithArray.parseOne([1, [
    [1, 2, 3],
    [1, 2, 3]
], 4]));

console.log(repo.schemas.nestedDependent.parseOne([
    1, [
        1, [
            'foo',
            'bar',
            'baz'
        ],
        2
    ], 3
]));

console.log(repo.parseOne('nestedDependent')([
    1, [
        1, [
            'foo',
            'bar',
            'baz'
        ],
        2
    ], 3
]));
