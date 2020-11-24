import React from 'react'
import { CapsuleChart } from '@jiaminghi/data-view-react'

import './RightTop.less'

function detail(data) {
  return {
    data: [
      {value: 5000, name: '江苏'},
      {value: 4500, name: '广东'},
      {value: 4300, name: '北京'},
      {value: 4000, name: '黑龙江'},
      {value: 3580, name: '湖北'},
      {value: 3080, name: '浙江'}
    ],
    colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
    unit: '单位',
  }
}

export default props => {
  const { rightTopData } = props

  return (
    <div className="main">
      <div className="right_top_title">捐款省份前六排行</div>
      <div className="right_top_content">
        <CapsuleChart config={detail(rightTopData)} />
      </div>
    </div>
  )
}
