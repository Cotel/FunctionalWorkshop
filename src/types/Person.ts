/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import { Orderable } from "../002-Order";

export class Person implements Orderable<Person> {
    readonly name: string
    readonly age: number

    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }

    compare(other: Person): number {
        return this.age - other.age
    }
}