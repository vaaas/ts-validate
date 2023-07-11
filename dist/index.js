"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.OneOf = exports.Exactly = exports.Anything = exports.Email = exports.StringDate = exports.StringNatural = exports.StringDecimal = exports.Bool = exports.Intersection = exports.Union = exports.Maybe = exports.Tuple = exports.List = exports.Partial = exports.Structure = exports.Text = exports.Real = exports.Natural = exports.Integer = exports.isNumber = exports.isObject = exports.isInteger = void 0;
const isInteger = (x) => Number.isInteger(x);
exports.isInteger = isInteger;
const isObject = (x) => typeof x === 'object' && x !== null;
exports.isObject = isObject;
const isNumber = (x) => typeof x === 'number';
exports.isNumber = isNumber;
function Integer(min = -Infinity, max = Infinity) {
    return function (x) {
        return (0, exports.isInteger)(x)
            && x >= min
            && x <= max;
    };
}
exports.Integer = Integer;
function Natural(x) {
    return (0, exports.isInteger)(x) && x > 0;
}
exports.Natural = Natural;
/** validates whether an argument is a real number
 *
 * - `min` — lower bound, inclusive
 * - `max` — upper bound, inclusive
 */
function Real(min, max) {
    return function (x) {
        return (0, exports.isNumber)(x) && x >= min && x <= max;
    };
}
exports.Real = Real;
function Text(min = 0, max = Infinity) {
    return function (x) {
        return typeof x === 'string'
            && x.length >= min
            && x.length <= max;
    };
}
exports.Text = Text;
function Structure(o) {
    return function (x) {
        return (0, exports.isObject)(x)
            && Object.entries(o).every(([k, f]) => f(x[k]));
    };
}
exports.Structure = Structure;
function Partial(o) {
    return function (x) {
        return (0, exports.isObject)(x)
            && Object.entries(x).every(([k, v]) => k in o && o[k](v));
    };
}
exports.Partial = Partial;
function List(f, min = 0, max = Infinity) {
    return function (x) {
        return Array.isArray(x)
            && x.length >= min
            && x.length <= max
            && x.every(f);
    };
}
exports.List = List;
function Tuple(...fs) {
    return function (x) {
        if (!Array.isArray(x))
            return false;
        if (x.length !== fs.length)
            return false;
        for (let i = 0, len = fs.length; i < len; i++)
            if (!((fs[i])(x[i])))
                return false;
        return true;
    };
}
exports.Tuple = Tuple;
function Maybe(f) {
    return function (x) {
        return x === null || x === undefined || f(x);
    };
}
exports.Maybe = Maybe;
function Union(...fs) {
    return function (x) {
        return fs.some(f => f(x));
    };
}
exports.Union = Union;
function Intersection(...fs) {
    return function (x) {
        return fs.every(f => f(x));
    };
}
exports.Intersection = Intersection;
function Bool(x) {
    return x === true || x === false;
}
exports.Bool = Bool;
const decimal_test_regex = new RegExp('^-?[0-9]+\\.?[0-9]*?$');
function StringDecimal(x) {
    return typeof x === 'string' && decimal_test_regex.test(x);
}
exports.StringDecimal = StringDecimal;
const string_natural_test_regex = new RegExp('^[0-9]+$');
function StringNatural(x) {
    return typeof x === 'string' && string_natural_test_regex.test(x);
}
exports.StringNatural = StringNatural;
function StringDate(x) {
    return typeof x === 'string'
        && x.length >= 10
        && !(Number.isNaN(Date.parse(x)));
}
exports.StringDate = StringDate;
const email_regex = new RegExp('^[a-zA-Z0-9-_\\.+]+@[a-zA-Z0-9-\\.]+$');
function Email(x) {
    return typeof x === 'string'
        && email_regex.test(x);
}
exports.Email = Email;
function Anything(x) {
    return true;
}
exports.Anything = Anything;
function Exactly(x) {
    return function (y) {
        return x === y;
    };
}
exports.Exactly = Exactly;
function OneOf(...xs) {
    return function (x) {
        return xs.includes(x);
    };
}
exports.OneOf = OneOf;
function validate(f) {
    return function (x) {
        if (f(x))
            return x;
        else
            return new Error('validation error');
    };
}
exports.validate = validate;
