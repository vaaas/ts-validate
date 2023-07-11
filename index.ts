type ReturnTypes<R extends Record<any, G<any>>> = {
    [K in keyof R]: R[K] extends G<infer T> ? T : never;
}

type G<T> = (x: unknown) => x is T

export const isInteger = (x: unknown): x is number => Number.isInteger(x)

export const isObject = (x: unknown): x is Record<string, unknown> =>
    typeof x === 'object' && x !== null;

export const isNumber = (x: unknown): x is number => typeof x === 'number'

export function Integer(min: number = -Infinity, max: number =Infinity) {
	return function(x: unknown): x is number {
		return isInteger(x)
			&& x >= min
			&& x <= max
	}
}

export function Natural(x: unknown): x is number {
	return isInteger(x) && x > 0
}

/** validates whether an argument is a real number
 *
 * - `min` — lower bound, inclusive
 * - `max` — upper bound, inclusive
 */
export function Real(min: number, max: number) {
    return function (x: unknown): x is number {
        return isNumber(x) && x >= min && x <= max
    }
}

export function Text(min: number = 0, max: number = Infinity) {
	return function(x: unknown): x is string {
		return typeof x === 'string'
			&& x.length >= min
			&& x.length <= max
	}
}

export function Structure<R extends Record<string, G<any>>>(o: R) {
	return function(x: unknown): x is ReturnTypes<R> {
        return isObject(x)
			&& Object.entries(o).every(([k, f]) => f(x[k]))
	}
}

export function Partial<R extends Record<string, G<any>>>(o: R) {
	return function(x: unknown): x is Partial<ReturnTypes<R>> {
        return isObject(x)
			&& Object.entries(x).every(([k, v]) => k in o && o[k]!(v))
	}
}

export function List<T>(f: G<T>, min: number = 0, max: number = Infinity) {
	return function(x: unknown): x is Array<T> {
		return Array.isArray(x)
			&& x.length >= min
			&& x.length <= max
			&& x.every(f)
	}
}

export function Tuple<A>(
    a: G<A>,
): G<[A]>;
export function Tuple<A, B>(
    a: G<A>,
    b: G<B>,
): G<[A, B]>;
export function Tuple<A, B, C>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
): G<[A, B, C]>;
export function Tuple<A, B, C, D>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
): G<[A, B, C, D]>;
export function Tuple<A, B, C, D, E>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
    e: G<E>,
): G<[A, B, C, D, E]>;
export function Tuple<A, B, C, D, E, F>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
    e: G<E>,
    f: G<F>,
): G<[A, B, C, D, E, F]>;
export function Tuple<A, B, C, D, E, F, G_>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
    e: G<E>,
    f: G<F>,
    g: G<G_>,
): G<[A, B, C, D, E, F, G_]>;
export function Tuple<A, B, C, D, E, F, G_, H>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
    e: G<E>,
    f: G<F>,
    g: G<G_>,
    h: G<H>,
): G<[A, B, C, D, E, F, G_, H]>;
export function Tuple<A, B, C, D, E, F, G_, H, I>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
    e: G<E>,
    f: G<F>,
    g: G<G_>,
    h: G<H>,
    i: G<I>
): G<[A, B, C, D, E, F, G_, H, I]>;
export function Tuple<F extends G<any>[]>(...fs: F) {
	return function(x: unknown): x is any[] {
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

export function Maybe<T>(f: G<T>) {
	return function(x: unknown): x is T | undefined {
		return x === null || x === undefined || f(x)
	}
}

export function Union<A>(
    a: G<A>,
): G<A>;
export function Union<A, B>(
    a: G<A>,
    b: G<B>,
): G<A | B>;
export function Union<A, B, C>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
): G<A | B | C>;
export function Union<A, B, C, D>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
): G<A | B | C | D>;
export function Union<A, B, C, D, E>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
    e: G<E>,
): G<A | B | C | D | E>;
export function Union(...fs: Array<G<any>>) {
	return function(x: unknown): x is any {
		return fs.some(f => f(x))
	}
}

export function Intersection<A>(
    a: G<A>,
): G<A>;
export function Intersection<A, B>(
    a: G<A>,
    b: G<B>,
): G<A & B>;
export function Intersection<A, B, C>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
): G<A & B & C>;
export function Intersection<A, B, C, D>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
): G<A & B & C & D>;
export function Intersection<A, B, C, D, E>(
    a: G<A>,
    b: G<B>,
    c: G<C>,
    d: G<D>,
    e: G<E>,
): G<A & B & C & D & E>;
export function Intersection(...fs: Array<G<any>>) {
	return function(x: unknown): x is any {
		return fs.every(f => f(x))
	}
}

export function Bool(x: unknown): x is boolean {
	return x === true || x === false
}

const decimal_test_regex = new RegExp('^-?[0-9]+\\.?[0-9]*?$')
export function StringDecimal(x: unknown): x is string {
	return typeof x === 'string' && decimal_test_regex.test(x)
}

const string_natural_test_regex = new RegExp('^[0-9]+$')
export function StringNatural(x: unknown): x is string {
	return typeof x === 'string' && string_natural_test_regex.test(x)
}

export function StringDate(x: unknown): x is string {
	return typeof x === 'string'
		&& x.length >= 10
		&& !(Number.isNaN(Date.parse(x)))
}

const email_regex = new RegExp('^[a-zA-Z0-9-_\\.+]+@[a-zA-Z0-9-\\.]+$')
export function Email(x: unknown): x is string {
	return typeof x === 'string'
		&& email_regex.test(x)
}

export function Anything(x: unknown): x is any {
	return true
}

export function Exactly<T>(x: T) {
	return function(y: unknown): y is T {
		return x === y
	}
}

export function OneOf<T extends any[]>(...xs: T) {
	return function (x: unknown): x is T[number] {
		return xs.includes(x)
	}
}

export function validate<T>(f: G<T>) {
	return function(x: unknown): T | Error {
		if (f(x)) return x
		else return new Error('validation error')
	}
}
