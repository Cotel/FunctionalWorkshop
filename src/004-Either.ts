/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import { EitherOf } from "./005-Functor";
import { Plate } from "./types/Plate"
import { identity } from "./utils";

/**
 * Okay, we can forget Typeclasses for now. They will help us later.
 * 
 * For now, let's go back to the Referential Transparency principle.
 * We saw that throwing exceptions is no good as the function won't inform us about it,
 * so one thing we can do is:
 */
function notEnoughIsPlateValid(plate: Plate): boolean {
    if (plate.name.length <= 0) return false
    if (plate.price < 0.0) return false
    return true
}

/**
 * This is pure but we can do better thanks to a very known functional data structure.
 * Enter Either:
 */

type Left<L> = { readonly kind: "left"; readonly leftValue: L };
type Right<R> = { readonly kind: "right"; readonly rightValue: R };

type EitherValue<L, R> = Left<L> | Right<R>

export class Either<L, R> implements EitherOf<L, R> {
    static left<L, R>(value: L) {
        return new Either<L, R>({ kind: "left", leftValue: value })
    }

    static right<L, R>(value: R) {
        return new Either<L, R>({ kind: "right", rightValue: value })
    }

    static fix<L, R>(value: EitherOf<L, R>) {
        return value as Either<L, R>
    }

    private constructor(private readonly value: EitherValue<L, R>) {}

    isLeft(): boolean {
        return this.value.kind === "left"
    }

    isRight(): boolean {
        return this.value.kind === "right"
    }

    fold<T>(ifLeft: (left: L) => T, ifRight: (right: R) => T): T {
        switch (this.value.kind) {
            case "left": return ifLeft(this.value.leftValue)
            case "right": return ifRight(this.value.rightValue)
        }
    }

    getOrThrow(errorMessage?: string): R {
        const thrownFn = () => {
            // eslint-disable-next-line functional/no-throw-statement
            throw Error(errorMessage ? errorMessage : "An error has ocurred: " + this.value)
        }

        return this.fold(() => thrownFn(), identity)
    }

    getOrElse(defaultValue: R): R {
        return this.fold(() => defaultValue, identity)
    }
}

/**
 * And how is this useful? Well, it allows us to keep referential transparency while
 * also allowing to handle potential impure scenarios lifting them into a type.
 * 
 * Functions won't success or fail, they will always return the same result for the same
 * input, which is an Either.
 */
export function validatePlate(plate: Plate): Either<Error, Plate> {
    if (plate.name.length <= 0) return Either.left(new Error("The name of the plate cannot be empty"))
    if (plate.price < 0.0) return Either.left(new Error("The price of the plate cannot be negative"))
    return Either.right(plate)
}

/**
 * We now can operate with this Either until we reach a point in our execution
 * where unsafe operations are permitted and we can then fold the result of the
 * Either.
 */