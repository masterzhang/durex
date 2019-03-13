import React from 'react'
import { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history'
import { ConnectedRouter, routerActions, CALL_HISTORY_METHOD, connectRouter } from 'connected-react-router'
import { dispatch } from './middleware'
import { actions } from './actions'

let history = createHistory({ type: 'hash' })

export function createHistory({ type = 'hash', ...opts }) {
  const historyModes = {
    browser: createBrowserHistory,
    hash: createHashHistory,
    memory: createMemoryHistory
  }
  history = historyModes[type](opts)
  return history
}

export function createRouterReducer() {
  return connectRouter(history)
}

export function routerMiddleware() {
  return () => next => action => {
    if (action.type !== CALL_HISTORY_METHOD) {
      return next(action)
    }

    const {
      payload: { method, args }
    } = action
    history[method](...args)
  }
}

export default function Router({ children }) {
  // Add `push`, `replace`, `go`, `goForward` and `goBack` methods to actions.routing,
  // when called, will dispatch the crresponding action provided by react-router-redux.
  actions.routing = Object.keys(routerActions).reduce((memo, action) => {
    memo[action] = (...args) => {
      dispatch(routerActions[action](...args))
    }
    return memo
  }, {})

  // ConnectedRouter will use the store from Provider automatically
  return <ConnectedRouter history={history}>{children}</ConnectedRouter>
}
