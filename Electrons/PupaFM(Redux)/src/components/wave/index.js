'use strict'

import React, { Component } from 'react'

import './index.scss'

class Wave extends Component {
  render () {
    return (
      <svg size="12" version="1.1" color="#5CBC7D" className="icon" viewBox="0,0,12,12" height="12" width="12" >
        <g id="wave" stroke="none" strokeWidth="1" fill="none">
          <line className="icon-playing-bar1" strokeWidth="1" stroke="#5CBC7D" strokeLinecap="round" id="line-1" x1="2" y1="12" x2="2" y2="1"></line>
          <line className="icon-playing-bar2" strokeWidth="1" stroke="#5CBC7D" strokeLinecap="round" x1="5" y1="12" x2="5" y2="1"></line>
          <line className="icon-playing-bar3" strokeWidth="1" stroke="#5CBC7D" strokeLinecap="round" x1="8" y1="12" x2="8" y2="1"></line>
          <line className="icon-playing-bar4" strokeWidth="1" stroke="#5CBC7D" strokeLinecap="round" x1="11" y1="12" x2="11" y2="1"></line>
        </g>
      </svg>
    )
  }
}

export default Wave
