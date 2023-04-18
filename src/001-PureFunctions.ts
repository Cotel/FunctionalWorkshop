import { Plate } from "./types/Plate";

/**
 * Pure functions are the bread and butter of functional programming.
 * 
 * They consist in having no side effects (I/O, Network, Database, etc.)
 * and having Referential Transparency, this is, same result for same arguments 
 */

/**
 * This function breaks Referential Transparency because by looking at the signature
 * you cannot know the possible results it can give back
 */
function impureIsPlateValid(plate: Plate): boolean {
    if (plate.name.length <= 0) throw new Error("Name of the plate is empty")
    if (plate.price < 0.0) throw new Error("Price cannot be 0 or lower")
    return true
}

/**
 * Immutability is also key for functional programming as it helps with
 * Referential Transparency. You cannot trust any function which returns void,
 * so modifications should always be returning new copies.
 */

function mutationSumAbs(list: number[]): number {
    list.forEach((i, index) => {
        const absoluteNumber = Math.abs(i)
        list[index] = absoluteNumber
    })

    let result = 0
    for (const iterator of list) {
        result += iterator
    }

    return result
}

const list = [-1, -2, -3, -5]
const result = mutationSumAbs(list)
const firstItemIsNegative = list[0] < 0

console.log(result)
console.log(firstItemIsNegative)

function sumAbs(list: readonly number[]): number {
    return list.reduce((acc, curr) => acc + Math.abs(curr), 0)
}

const list1 = [-1, -2, -3, -5]
const result1 = sumAbs(list1)
const firstItemIsNegative1 = list1[0] < 0

console.log(result1)
console.log(firstItemIsNegative1)