'use strict'

import React, { Component, PropTypes } from 'react'

import './index.scss'

class Progress extends Component {

  render () {
    const { percent } = this.props
    return (
      <div className='progress'>
        <div className='progress-bar loading' style={{width: '100%'}}></div>
        <div className='progress-bar playing' style={{width: percent}}></div>
      </div>
    )
  }
}

Progress.propTypes = {
  percent: PropTypes.string.isRequired
}

export default Progress
