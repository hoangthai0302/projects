'use strict'

import { ipcRenderer } from 'electron'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loginPop, logout } from '../../actions'
import { isEmpty } from '../../utils'

import './index.scss'

class User extends Component {

  componentDidMount () {
    ipcRenderer.on('logout', () => {
      this.props.logout()
    })
  }

  renderInfo () {
    const { userInfo, loginPop, logout } = this.props
    if (isEmpty(userInfo)) {
      return (
        <a href="javascript:;" className="login" onClick={ loginPop }>登录</a>
      )
    } else {
      const sty = {
        backgroundImage: `url(http://img3.douban.com/icon/ul${userInfo.id}-10.jpg)`,
        height: '22px',
        width: '22px',
        display: 'inline-block',
        borderRadius: '50%',
        backgroundSize: 'cover'
      }
      return (
        <a href="javascript:;" className="avatar" style={ sty } onClick={ logout }></a>
      )
    }
  }

  render () {
    return (
      <div className="user-block">
        { this.renderInfo() }
      </div>
    )
  }
}

User.propTypes = {
  userInfo: PropTypes.object.isRequired,
  loginPop: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = { loginPop, logout }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)

