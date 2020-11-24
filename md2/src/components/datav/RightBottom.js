import React from 'react'
import { ScrollBoard } from '@jiaminghi/data-view-react'
import './RightBottom.less'

const config = {
  data: [],
  index: true,
  align: ['center'],
  oddRowBGC: '#',
  evenRowBGC: '#',
  waitTime: '1000',
  rowNum: 9,
}

export default props => {
  const { rightBottomData } = props

  config.data = rightBottomData

  return (
    <div className="main">
      <div className="right_bottom_title">机构加入动态</div>
      <div className="right_bottom_line">
        <ScrollBoard config={config} />
      </div>
    </div>
  )
}
