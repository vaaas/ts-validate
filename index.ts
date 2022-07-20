export function Integer(min: number = -Infinity, max: number =Infinity): (x: any) => boolean {
	return function(x) {
		return Number.isInteger(x)
			&& x >= min
			&& x <= max
	}
}

export function Natural(x: any): boolean {
	return Number.isInteger(x) && x > 0
}

export function Text(min: number = 0, max: number = Infinity): (x: any) => boolean {
	return function(x) {
		return typeof x === 'string'
			&& x.length >= min
			&& x.length <= max
	}
}

export function Structure(o: Record<string, (x: any) => boolean>): (x: any) => boolean {
	return function(x) {
		return x
			&& typeof x === 'object'
			&& Object.entries(o)
				.every(([k, f]) => f(x[k]))
	}
}

export function List(f: (x: any) => boolean, min: number = 0, max: number = Infinity): (x: any) => boolean {
	return function(x) {
		return Array.isArray(x)
			&& x.length >= min
			&& x.length <= max
			&& x.every(f)
	}
}

export function Tuple(...fs: ReadonlyArray<(x: any) => boolean>): (x: any) => boolean {
	return function(x) {
		if (!Array.isArray(x))
			return false
		if (x.length !== fs.length)
			return false
		for (let i = 0, len = fs.length; i < len; i++)
			if (!((fs[i]!)(x[i])))
				return false
		return true
	}
}

export function Maybe(f: (x: any) => boolean): (x: any|undefined) => boolean {
	return function(x) {
		return x === null || x === undefined || f(x)
	}
}

export function Union(...fs: Array<(x: any) => boolean>): (x: any) => boolean {
	return function(x) {
		return fs.some(f => f(x))
	}
}

export function Bool(x: any): boolean {
	return x === true || x === false
}

const decimal_test_regex = new RegExp('^-?[0-9]+\\.?[0-9]*?$')
export function StringDecimal(x: any): boolean {
	return typeof x === 'string' && decimal_test_regex.test(x)
}

const string_natural_test_regex = new RegExp('^[0-9]+$')
export function StringNatural(x: any): boolean {
	return typeof x === 'string' && string_natural_test_regex.test(x)
}

export function StringDate(x: any): boolean {
	return typeof x === 'string'
		&& x.length === 10
		&& !(Number.isNaN(Date.parse(x)))
}

const email_regex = new RegExp('^[a-z-\\.+]+@[a-z0-9-]+\.[a-z\.]+$')
export function Email(x: any): boolean {
	return typeof x === 'string'
		&& email_regex.test(x)
}

export function Anything(x: any): true {
	return true
}

export function Exactly(x: any): (y: any) => boolean {
	return function(y: any) {
		return x === y
	}
}

export function OneOf(...xs: any[]): (x: any) => boolean {
	return function (x: any) {
		return xs.includes(x)
	}
}

export function validate<T>(f: (x: any) => boolean): (x: any) => T|Error {
	return function(x) {
		if (f(x)) return x
		else return new Error('validation error')
	}
}
