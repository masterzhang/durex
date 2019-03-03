import { connect } from 'react-redux'
import model from './model'
import smart from './connect'
import { actions } from './actions'
import render from './render'
import hook from './hook'
import defaults from './defaults'
import { store } from './middleware'

const getState = function () {
  return store.getState()
}

export default {
  model,
  actions,
  hook,
  defaults,
  connect,
  smart,
  render,
  getState
}

export { model, actions, hook, defaults, connect, smart, render, getState }
