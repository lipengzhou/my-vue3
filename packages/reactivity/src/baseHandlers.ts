import { extend, isObject, isArray, isIntegerKey, hasOwn, hasChanged } from '@vue/shared'
import { track } from './effect'
import { TrackOpTypes } from './operations'
import { reactive, readonly } from './reactive'

function createGetter (isReadonly = false, shallow = false) {
  return function get (target: any, key: string, receiver: object) {
    // return target[key]
    const res = Reflect.get(target, key, receiver)
    // console.log('get', key, res)

    // 如果不是只读数据，则需要收集依赖稍后更新视图
    if (!isReadonly) {
      // 收集依赖
      console.log('收集依赖', key, res)
      track(target, TrackOpTypes.GET, key) // 收集依赖
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
  return function set (target: any, key: string, value: any, receiver: object) {
    // 设置属性：
    //   可能是新增
    //   可能是修改

    // 处理对象
    const oldValue = target[key]

    // 先判断是否是新增的数据
    const hadKey = isArray(target) && isIntegerKey(key)
      ? Number(key) < target.length
      : hasOwn(target, key)

    // 再执行修改操作
    const result = Reflect.set(target, key, value, receiver)

    if (!hadKey) {
      // 新增处理
      console.log('新增', key)
    } else if (hasChanged(oldValue, value)) {
      // 修改处理
      console.log('修改', key)
    }

    return result
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
