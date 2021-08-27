import { extend } from '@vue/shared'

function createGetter (isReadonly = false, shallow = false) {
  return function get (target: any, key: string, receiver: object) {
    console.log('get', key)
    // return target[key]
    const res = Reflect.get(target, key, receiver)
    return res
  }
}

function createSetter (shallow = false) {
  return function set (target: any, propKey: string, value: any, receiver: object) {
    // console.log(`${propKey} 被修改了`)
    // target[propKey] = value
    const res = Reflect.set(target, propKey, value, receiver)
    return res
  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set (target: object, key: string) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
    return true
  }
}

export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet
}

export const shallowReadonlyHandlers = extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
)
