import { dispatch, getState } from './middleware'
import { options } from './defaults'
import { setIn } from '@gem-mine/immutable'

const SEP = '/'

// 存放所有的 action，此 action 非 redux action 存放结构如下： {namespace: {actionName:
// actionCreator}}
export const actions = {}

export function addActions(modelName, reducers = {}, effects = {}) {
  // 在 actions 中挂载命名空间
  if (Object.keys(reducers).length || Object.keys(effects).length) {
    actions[modelName] = actions[modelName] || {}
  }

  // 把 reducers 挂到 actions 中对应的命名空间里
  each(reducers, actionName => {
    // A single-argument function, whose argument is the payload data of a normal
    // redux action, and also the `data` param of corresponding method defined in
    // model.reducers.
    actions[modelName][actionName] = actionCreator(modelName, actionName)
  })

  // 把 effects 也挂载到 actions 中对应的命名空间里
  const scope = {
    actions: actions[modelName],
    setField: data => {
      return scope.actions.setField(data)
    },
    getState: () => {
      return getState()[modelName]
    }
  }

  each(effects, effectName => {
    if (actions[modelName][effectName]) {
      throw new Error(`Action name "${effectName}" has been used! Please select another name as effect name!`)
    }

    // 放入 全局的 effects 缓存 dispatch(action) 时过中间件，会检查 全局 effects 中是否存在，如果存在，则执行
    options.addEffect(`${modelName}${SEP}${effectName}`, effects[effectName].bind(scope))

    // Effect is like normal action, except it is handled by mirror middleware
    actions[modelName][effectName] = actionCreator(modelName, effectName)
  })
}

/**
 * 把某个 model 的 reducers 汇集成一个 object 输出
 * object 格式为：
 *    key: ${modelName}${SEP}${reducer的key}
 *    value: 对应的 reducer 的 value，是个 function(){}
 * @param {String} modelName
 * @param {Object<String, function>} reducers
 */
export function resolveReducers(modelName, reducers = {}) {
  return Object.keys(reducers).reduce((acc, cur) => {
    acc[`${modelName}${SEP}${cur}`] = function (state, data) {
      return reducers[cur].bind({
        setField: data => {
          return setIn(state, data)
        },
        getState: () => {
          return state
        }
      })(data, getState)
    }

    return acc
  }, {})
}

function each(obj, callback) {
  Object.keys(obj).forEach(callback)
}

/**
 * action 生成器
 * 返回一个 function(data) {}，执行该函数将 dispatch action
 * @param {String} modelName 命名空间，是 model 的 name 字段
 * @param {String} actionName action name，是 model 中 reduces 或者 effects 的 key
 */
function actionCreator(modelName, actionName) {
  return function (data) {
    return dispatch({ type: `${modelName}${SEP}${actionName}`, data })
  }
}
