export function omit<T>(o: T, ...names: string[]): Partial<T> {
  return Object.getOwnPropertyNames(o).reduce((target: any, key) => {
    if (names.indexOf(key) === -1) {
      target[key] = (<any>o)[key]
    }
    return target
  }, <T>{})
}
