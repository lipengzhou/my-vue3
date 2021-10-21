import { extend, isObject } from '@vue/shared'
import { reactive, readonly } from './reactive'

function createGetter (isReadonly = false, shallow = false) {
  return function get (target: any, key: string, receiver: object) {
    // return target[key]
    const res = Reflect.get(target, key, receiver)
    console.log('get', key, res)

    // 如果不是只读数据，则需要收集依赖稍后更新视图
    if (!isReadonly) {
      // 收集依赖
      console.log('收集依赖', key)
    }

    // shallowReactive
    if (shallow) {
      return res
    }

    // 深层代理
    if (isObject(res)) {
      // 懒递归，当我们取值的时候才去做递归代理，如果不取则默认只代理一层，这也是 Vue 3 性能高效的特点之一
      return isReadonly
        ? readonly(res)
        : reactive(res)
    }

    // 简单数据类型
    return res
  }
}

function createSetter (shallow = false) {
  return function set (target: any, propKey: string, value: any, receiver: object) {
    // console.log(`${propKey} 被修改了`)
    // target[propKey] = value // 如果设置失败，没有结果也不会报错，无法得知是否设置成功
    const res = Reflect.set(target, propKey, value, receiver) // 如果设置失败会返回 false
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
