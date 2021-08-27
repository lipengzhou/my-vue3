import { isObject } from '@vue/shared'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

export const reactiveMap = new WeakMap<object, any>()
export const shallowReactiveMap = new WeakMap<object, any>()
export const readonlyMap = new WeakMap<object, any>()
export const shallowReadonlyMap = new WeakMap<object, any>()

export function reactive (target: object) {
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    reactiveMap
  )
}

export function readonly (target: object) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyMap
  )
}

export function isReactive () {}

export function isReadonly () {}

export function isProxy () {}

export function shallowReactive (target: object) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowReactiveMap
  )
}

export function shallowReadonly (target: object) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyMap
  )
}

export function markRaw () {}

export function toRaw () {}

/**
 * 创建响应式对象
 * @param target 源数据
 * @param isReadonly 是否是只读的
 * @param baseHandlers Proxy 的代理器
 * @returns 代理之后的 Proxy 对象
 */
function createReactiveObject (
  target: any,
  isReadonly: boolean,
  baseHandlers: any,
  proxyMap: WeakMap<object, any>
) {
  if (!isObject(target)) {
    console.warn(`value cannot be made reactive: ${String(target)}`)
    return target
  }

  // 优先从缓存中获取
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(
    target,
    baseHandlers
  )

  // 添加到缓存中
  proxyMap.set(target, proxy)

  return proxy
}
