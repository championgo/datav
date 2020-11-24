import React, { useState, useEffect } from 'react'
import { Decoration5, Decoration8 } from '@jiaminghi/data-view-react'
import './TopHeader.less'
import io from 'socket.io-client'
const ENDPOINT = 'http://datalq.peifude.com/datalq'

export default props => {
  const [TopHeaderData, setTopHeaderData] = useState(new Date().toLocaleString())

  useEffect(() => {
    const socket = io(ENDPOINT)

    let interval

    socket.on('connect', () => {
      socket.emit('init', { msg: 'init' })
      if (interval) {
        clearInterval(interval)
      }
    })
    socket.on('init', data => {
      setTopHeaderData(new Date().toLocaleString())
      socket.emit('init', { msg: 'init' })
    })
  }, [])

  return (
    <div id="top-header">
      <Decoration8 className="header-left-decoration" />
      <Decoration5 className="header-center-decoration" />
      <Decoration8 className="header-right-decoration" reverse={true} />
      <div className="center-title">
        <div>灵山联合劝募实时数据</div>
        <div className="center_title_time">{TopHeaderData}</div>
      </div>
    </div>
  )
}
