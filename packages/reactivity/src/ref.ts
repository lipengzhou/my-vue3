/* eslint-disable camelcase */
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { isArray, isObject, hasChanged } from '@vue/shared'
import { reactive, isProxy, toRaw, isReactive } from './reactive'
import { track, trigger } from './effect'

const convert = (val) =>
  isObject(val) ? reactive(val) : val

export function isRef (r) {
  return Boolean(r && r.__v_isRef === true)
}

export function ref (value?: unknown) {
  return createRef(value, false)
}

export function shallowRef (value?: unknown) {
  return createRef(value, true)
}

class RefImpl {
  private _value // 响应式数据
  private _rawValue // 原始数据
  public readonly __v_isRef = true // 标记它是一个 ref 数据

  constructor (value, public readonly _shallow: boolean) {
    // this._rawValue = _shallow ? value : toRaw(value)
    this._rawValue = value

    // 如果是浅的则直接返回，否则根据是否对象做 reactive 响应式处理
    this._value = _shallow ? value : convert(value)
  }

  // 访问 value 调用 get
  get value () {
    // trackRefValue(this)
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }

  // 修改 value 调用 set
  set value (newVal) {
    // newVal = this._shallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : convert(newVal)
      // triggerRefValue(this, newVal)
      trigger(this, 'set', 'value', newVal)
    }
  }
}

function createRef (rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue
  }
  // 借助类的属性访问器
  return new RefImpl(rawValue, shallow)
}

// export function toRefs (object) {
//   const ret: any = isArray(object) ? new Array(object.length) : {}
//   for (const key in object) {
//     ret[key] = toRef(object, key)
//   }
//   return ret
// }

// export function toRef (
//   object,
//   key
// ) {
//   const val = object[key]
//   return isRef(val) ? val : (new ObjectRefImpl(object, key) as any)
// }
