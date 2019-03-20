import { connect } from 'react-redux'
import model from './model'
import smart from './connect'
import { actions } from './actions'
import render from './render'
import hook from './hook'
import defaults from './defaults'
import { store } from './middleware'
import Router from './router'
import { Route, Redirect, Switch, Prompt, withRouter } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { urlFor, router, Routes } from './router/helper'
import queryString from 'query-string'
import pathToRegexp from 'path-to-regexp'

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
  getState,

  urlFor,
  router,
  Routes,

  Router,
  Route,
  Link,
  NavLink,
  Switch,
  Redirect,
  Prompt,
  withRouter,
  queryString,
  pathToRegexp
}

export { model, actions, hook, defaults, connect, smart, render, getState, Router, Route, Link, NavLink, Switch, Redirect, Prompt, withRouter, urlFor, router, Routes, queryString, pathToRegexp }
