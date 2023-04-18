/**
 * Now we want to implement a collapse function that given a list of
 * values returns the result of reducing all those elements in an associative way.
 * 
 * This function has the same challenges like the previous one, but we know we can make it work
 * with adapters. So let's get moving.
 * 
 * We need an interface with 2 members:
 * - combine: How to combine two elements
 * - empty: A default value to return in case the list is empty
 * 
 * This interface is called Monoid in maths.
 */

// eslint-disable-next-line functional/prefer-type-literal, functional/no-mixed-type
interface MonoidAdapter<A> {
    readonly empty: A
    
    // eslint-disable-next-line functional/no-method-signature
    combine(other: A): A
}

function adapterCollapse<A>(list: readonly A[], wrap: (a: A) => MonoidAdapter<A>): A {
    const emptyValue: any = new Error("What are we supposed to put here?")
    return list.reduce((acc, curr) => wrap(acc).combine(curr), emptyValue)
}

/**
 * We have a problem. We can't provide an initial value for the reduce because 
 * we don't have any value to "adapt". In order to call the `empty` member we need a
 * value `A` beforehand, so we can call the `wrap` function.
 * 
 * `empty` should be static, but there is one for every instance of `A`.
 * This is a serious limitation, adapters are coupled to values, so we can't define
 * static members.
 * 
 * But what if, `Monoid` was an independent module not coupled to values?
 */

// eslint-disable-next-line functional/no-mixed-type
export type Monoid<A> = {
    readonly empty: A

    readonly combine: (lhs: A, rhs: A) => A
} 

const collapse = <A>(monoid: Monoid<A>) => (list: readonly A[]): A => 
    list.reduce(monoid.combine, monoid.empty)

/**
 * We've just discovered Typeclasses! They are just interfaces but they aren't
 * meant to be inherited. Instead they live by their own.
 * 
 * They serve for ad-hoc inheritance by not being coupled to values but to types.
 * 
 * Same as adapters, we have to provide `witnesses` of how a type implements a
 * Typeclass
 */

const numberSumMonoid: Monoid<number> = {
    empty: 0,
    combine: (lhs, rhs) => lhs + rhs
}

const numberMulMonoid: Monoid<number> = {
    empty: 1,
    combine: (lhs, rhs) => lhs * rhs
}

const stringMonoid: Monoid<string> = {
    empty: "",
    combine: (lhs, rhs) => lhs + rhs
}

console.log(collapse(numberSumMonoid)([1, 2, 3, 4]))
console.log(collapse(numberMulMonoid)([1, 2, 3, 4]))
console.log(collapse(stringMonoid)(["Hello",", ", "world", "!"]))

/**
 * In other languages more focused in pure typed functional programming
 * typeclasses have more syntactic improvements like implicit resolution, context bounds 
 * and derived instances so we're not forced to provide witnesses in every call to the function
 * or even make a witness in the first place as most of the types we can think
 * can have their own Monoid witness implemented by the compiler.
 */