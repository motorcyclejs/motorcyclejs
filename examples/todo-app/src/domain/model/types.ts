/**
 * This file is a collection of types that define your business
 * model as concrete types that make sense to your business. It is
 * very important not to be confuse the types here with types that work
 * best with third-party libraries you may or may not end up using. Dealing
 * with these third-party libraries are done elsewhere. These are always what
 * you would like to develop first.
 *
 * Business rules should be marked clearly by the types that they correspond
 * to since TypeScript is not capable of these declaration in types alone it is
 * important to create functions that validate your business rules.
 *
 * Types should use `readonly` modifier to ensure immutability of all
 * objects.
 */

export interface Todo {
  readonly id: Uid
  readonly completed: boolean
  readonly title: Title
}

/**
 * Business rule:
 *  Must be unique
 */
export type Uid = string

/**
 * Business rule:
 *  Must be greater than 0 characters long
 *  Must be less than or equal to 80 characters long
 */
export type Title = string
