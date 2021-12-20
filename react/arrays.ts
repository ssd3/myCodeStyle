import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'

/**
 * Arrays util class
 */
export class Arrays {
    /**
     * Convert array of strings to string -> 'string 1', 'string 2', 'string 3'
     * @param array
     * @param separator
     */
    public static arrayToStr = (array: string[], separator = ',') => {
        return Array.from(new Set(array.map((id) => {
            return `'${id}'`
        }))).join(separator)
    }

    public static groupBy<T>(array: T[], key: string): any {
        return groupBy(array, (n: any) => {
            return n[key]
        })
    }

    public static orderBy<T>(array: T[], key: string, direction: any = 'asc'): T[] {
        return orderBy(array, [key], [direction])
    }

    /**
     * Compare two Set on equality
     * @param a
     * @param b
     */
    public static areSetsEqual<T>(a: Set<T>, b: Set<T>): boolean {
        return a.size === b.size && [...a].every(value => b.has(value))
    }

    /**
     * Get last value from Set
     * @param a
     */
    public static getLastValue<T>(a: Set<T>): T | undefined {
        const array = Array.from(a)
        if (array.length > 0) {
            return array[array.length - 1]
        }
        return undefined
    }
}
