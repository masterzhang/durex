import { connect } from 'react-redux'

function smart(mapStateToProps, mapDispatchToProps) {
  return connect(
    typeof mapStateToProps === 'function'
      ? (state, ownProps) => {
        return mapStateToProps(state, ownProps)
      }
      : undefined,
    null,
    (stateProps, dispatchProps, ownProps) => {
      let props = Object.assign({}, stateProps, dispatchProps, ownProps)
      if (typeof mapDispatchToProps === 'function') {
        props = Object.assign(props, mapDispatchToProps(props))
      }
      return props
    }
  )
}

export default smart
