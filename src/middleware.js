import { effects } from './effects'
import { hooks } from './hook'

function warning() {
  throw new Error(
    'You are calling "dispatch" or "getState" without applying middleware! ' +
      'Please create your store with middleware first!'
  )
}

export let dispatch = warning

export let getState = warning

export const store = {
  dispatch,
  getState
}

// 只在 store.js 中被使用
export default function createMiddleware() {
  return middlewareAPI => {
    store.dispatch = dispatch = middlewareAPI.dispatch
    store.getState = getState = middlewareAPI.getState

    return next => action => {
      let effectResult
      // 异步的话这里其实只是为了最终能到 reducer，日志中能看到 dispatch，并无实际作用
      const result = next(action)

      // 处理 effects
      if (typeof effects[action.type] === 'function') {
        effectResult = effects[action.type](action.data, getState)
      }

      hooks.forEach(hook => hook(action, getState))

      return effectResult || result
    }
  }
}
