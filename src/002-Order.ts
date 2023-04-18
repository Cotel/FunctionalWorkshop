/**
 * Another thing very relevant in functional programming is that
 * functions are first-class citizens. This means a function accepts and can
 * return other functions
 */

import { Person } from "./types/Person";
import { identity } from "./utils";

/**
 * Let's see it in practice. We want to implement a function `greatest` that given a
 * list of numbers it will return the greatest among them.
 */
function greatestNumber(list: readonly number[]): number {
  return list.reduce((acc, curr) => (curr > acc ? curr : acc), 0);
}

/**
 * Good enough for numbers. But what if we want to make the function generic?
 * We need a comparing function.
 */
function explicitGreatest<A>(list: readonly A[], compare: (lhs: A, rhs: A) => number): A {
    return list.reduce((acc, curr) => {
        const comparison = compare(acc, curr)
        return (comparison >= 0) ? acc : curr 
    })
}

/**
 * This is nice. One thing we can do to improve the function and avoiding to repeat the
 * same compare function for the same type every time is to embed that behavior into the
 * generic via inheritance.
 */

// eslint-disable-next-line functional/prefer-type-literal
export interface Orderable<A> {
    // eslint-disable-next-line functional/no-method-signature
    compare(other: A): number
};

function orderableGreatest<A extends Orderable<A>>(list: readonly A[]): A {
    return list.reduce((acc, curr) => {
        const comparison = acc.compare(curr)
        return (comparison >= 0) ? acc : curr
    })
}

/**
 * This is how we usually do things in the Object-Oriented world. Now let's go deeper.
 * We want to be able to use this same function with a type we don't have access to, so
 * we can't make it implement our Orderable interface.
 * 
 * Well, we can make use of the Adapter pattern:
 */

function adapterGreatest<A>(list: readonly A[], wrap: (a: A) => Orderable<A>): A {
    return list.reduce((acc, curr) => {
        const comparison = wrap(acc).compare(curr)
        return (comparison >= 0) ? acc : curr
    })
}

const personest = adapterGreatest([
    new Person("Juan", 23),
    new Person("Pablo", 28)
], identity)

const numberest = adapterGreatest([1, 2, 3], (x) => ({
    compare: (other) => x - other
}))

/**
 * This has an efficiency issue of creating intermediate objects but it works!
 */