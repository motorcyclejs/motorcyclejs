import { Title } from './types'

/**
 * Enforces a business rule. All instances of Title
 * must be at least 1 character and less than or equal to 80
 */
export function tryTitle(title: Title): boolean {
  return title.length > 0 && title.length <= 80
}
