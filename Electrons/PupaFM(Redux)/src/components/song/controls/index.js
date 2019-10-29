'use strict'

import React, { Component, PropTypes } from 'react'

import './index.scss'

class Controls extends Component {

  render () {
    const { onNext, onStar, onTrash, like } = this.props
    return (
      <div className="playing-controls">
        <div className="controls">
          <span className={ 'iconfont icon-heart ' + (like ? 'like' : '') }
            onClick={ (event) => onStar(event) }
          ></span>
          <span className="iconfont icon-trash" onClick={ (event) => onTrash(event) }></span>
          <span className="iconfont icon-skip"
            onClick={ (event) => onNext(event) }>
          </span>
        </div>
      </div>
    )
  }
}

Controls.propTypes = {
  onNext: PropTypes.func.isRequired,
  onStar: PropTypes.func.isRequired,
  onTrash: PropTypes.func.isRequired,
  like: PropTypes.oneOfType([PropTypes.bool.isRequired, PropTypes.number.isRequired])
}

export default Controls
