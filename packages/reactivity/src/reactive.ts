import { isObject } from '@vue/shared'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

export function reactive (target: object) {
  return createReactiveObject(
    target,
    false,
    mutableHandlers
  )
}

export function readonly (target: object) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers
  )
}

export function isReactive () {}

export function isReadonly () {}

export function isProxy () {}

export function shallowReactive (target: object) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers
  )
}

export function shallowReadonly (target: object) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers
  )
}

export function markRaw () {}

export function toRaw () {}

function createReactiveObject (
  target: any,
  isReadonly: boolean,
  baseHandlers: any
) {
  if (!isObject(target)) {
    console.warn(`value cannot be made reactive: ${String(target)}`)
    return target
  }
  const proxy = new Proxy(
    target,
    baseHandlers
  )
  return proxy
}
