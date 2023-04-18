/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable functional/prefer-type-literal */
export interface Kind<F, A> {}

export type Kind2<F, A, B> = Kind<Kind<F, A>, B>
