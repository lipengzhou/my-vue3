export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const extend = Object.assign

export const isArray = Array.isArray

export const isString = (val: unknown) => typeof val === 'string'

export const isIntegerKey = (key: any) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)
