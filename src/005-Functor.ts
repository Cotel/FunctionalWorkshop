/* eslint-disable functional/no-class */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable functional/prefer-type-literal */
/**
 * But wait! How can we operate with this wrapper type? By lifting
 * the Plate into a container it is now uncomfortable to work with it
 * since we always have to be checking if the Either is Right to access
 * the value.
 * 
 * Well, mathematics has us covered again since there is an abstraction
 * for container types that if they contain a type A and you pass them
 * a function that goes from A to B then they return a container of B.
 * This abstraction is called Functor
 */

import { Either, validatePlate } from "./004-Either"
import { Kind } from "./types/HKT"
import { Plate } from "./types/Plate"

type IncompleteFunctor<A> = {
    readonly map: <B>(fn: (a: A) => B) => IncompleteFunctor<B>
}

/**
 * The problem with the Functor typeclass is that the type it accepts can only
 * be a container type (these are called Higher Kinded Types but we can't forget that).
 * So we would like to have something like the following
 */

/**
 * type Functor<F<_>> = {
 *  readonly map: <A, B>(self: F<A>, fn: (a: A) => B) => F<B>
 * }
 */

/** 
 * But with some hacks we can have:
 * type Kind<F, A> = F<A>
 */

interface ForEither {}
interface EitherPartialOf<Left> extends Kind<ForEither, Left> {}
export type EitherOf<Left, Right> = Kind<EitherPartialOf<Left>, Right>

export interface Functor<F> {
    map<A, B>(self: Kind<F, A>, fn: (a: A) => B): Kind<F, B>
}

class EitherFunctor<L> implements Functor<EitherPartialOf<L>> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
    
    map<R, A>(self: EitherOf<L, R>, fn: (a: R) => A): EitherOf<L, A> {
        return Either.fix(self).fold(
            (value) => Either.left(value),
            (value) => Either.right(fn(value))
        )
    }
}

const myStuffWithPlates = () => {
    const functor = new EitherFunctor<Error>()

    const plate: Plate = { name: "", price: 12.0 }
    const validation = validatePlate(plate)
    
    // This is only function composition with container types
    const upperCasedPlateName = Either.fix(functor.map(validation, (plate: Plate) => plate.name.toUpperCase()))
    const firstLetterPlateName = Either.fix(functor.map(upperCasedPlateName, (name: string) => name[0]))

    // Then at some point we can run unsafe operations and unwrap our Either
    console.log(firstLetterPlateName.getOrThrow())
}

/**
 * But for dev UX sake, we can include map as a member method in our Either type
 * since we have access to it :)
 * 
 * In any case, this kind of typeclasses that work on container types allow us
 * to abstract from concrete types our code and give powers to our F type which
 * we can switch in runtime.
 * 
 * For example, we can stop coupling our code to external libraries:
 */
interface ObservablePeopleRepository {
    getAllPeople(): Observable<Person[]>
    updatePerson(person: Person): Observable<boolean>
}

class PeopleRepository<F> {
    // Async is a typeclass that adds async capabilities to container type F
    constructor(async: Async<F>) {
        this.async = async
    }

    getAllPeople(): Kind<F, Person[]> //F<Person[]> {
        // do safe operations here
    }

    updatePerson(): Kind<F, boolean> {
        // do safe operations here
    }
}

const observableRepository = new PeopleRepository(observableAsyncWitness)
observableRepository.getAllPeople().fix().subscribe()

const ioPeopleRepository = new PeopleRepository(ioAsyncWitness)
observableRepository.getAllPeople().fix().run()

