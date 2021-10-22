import { TrackOpTypes } from './operations'

export function effect (fn: any, options: any = {}) {
  const effect = createReactiveEffect(fn, options)

  if (!options.lazy) {
    effect()
  }

  return effect
}

let uid = 0
let activeEffect: any // 存储当前的 effect
const effectStack: any[] = []
function createReactiveEffect (fn: any, options: any) {
  const effect = function reactiveEffect () {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect)
        activeEffect = effect

        // 函数执行时会取值，执行 Proxy 的 get 方法，收集依赖
        // => 让取值的属性和 effect 产生关联

        // 用户的函数返回值还有其它作用
        return fn()
      } finally {
        effectStack.pop() // 执行完就出去
        activeEffect = effectStack[effectStack.length - 1] // 修正当前 effect 的正确指向
      }
    }
  }
  effect.id = uid++ // effect 标识，用于区分 effect
  effect._isEffect = true // 用于标识这是个响应式 effect
  effect.raw = fn // 保留 effect 对应的原函数
  effect.options = options // 保留选项属性
  return effect
}

/**
 * 收集依赖
 */
const targetMap = new WeakMap()
export function track (target: object, type: TrackOpTypes, key: unknown) {
  // 获取当前 effect
  // activeEffect

  // 不在 effect 中的不收集依赖
  if (activeEffect === undefined) {
    return
  }

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
  console.log(targetMap)
}

// effect(() => {
//   data.name // effect1
//   effect(() => {
//     data.age // effect2
//   })
//   // 问题：代码执行到这里应该切换到 effect1，但实际上是 effect2
//   // 这是一个函数调用栈
//   data.gender // effect2
// })
