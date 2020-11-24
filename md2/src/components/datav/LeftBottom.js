import React from 'react'
import { ScrollBoard } from '@jiaminghi/data-view-react'
import './LeftBottom.less'
import { configs } from 'eslint-plugin-prettier'

function detail(data) {
  return {
    header: ['捐赠方', '项目', '捐款金额（元）', '时间'],
    data: data,
    index: true,
    align: ['center'],
    headerBGC: '#0071FF',
    oddRowBGC: '#113D78',
    evenRowBGC: '#085CC1',
    headerHeight: '40',
    indexHeader: '',
    waitTime: '1000',
    rowNum: 13,
  }
}

export default props => {
  const { leftBottomData } = props
  return (
    <div className="main">
      <div className="leftbottom_title_one">捐款动态分析</div>
      <div className="main_bottom_modal_one">
        <ScrollBoard className="main_bottom_table" config={detail(leftBottomData)} />
      </div>
    </div>
  )
}
