import React from 'react'
import { Charts, BorderBox1 } from '@jiaminghi/data-view-react'

import './LeftTop.less'

function getRingarea(data) {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: -Math.PI / 2,
        endAngle: Math.PI * 1.5,
        arcLineWidth: 11,
        radius: '70%',
        data: [{ name: '捐款地区', value: data, gradient: ['#1D82FF', '#24F0E4', '#2fded6'] }],
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        pointer: {
          show: false,
        },
        dataItemStyle: {
          lineCap: 'round',
        },
        details: {
          show: true,
          formatter: '',
          style: {
            fill: '#1ed3e5',
            fontSize: 25,
          },
        },
      },
    ],
  }
}

function getRingproject(data) {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: -Math.PI / 2,
        endAngle: Math.PI * 1.5,
        arcLineWidth: 11,
        radius: '70%',
        data: [{ name: '已加入机构', value: data, gradient: ['#1D82FF', '#24F0E4', '#2fded6'] }],
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        pointer: {
          show: false,
        },
        dataItemStyle: {
          lineCap: 'round',
        },
        details: {
          show: true,
          formatter: '',
          style: {
            fill: '#1ed3e5',
            fontSize: 25,
          },
        },
      },
    ],
  }
}

export default props => {
  const { leftTopData } = props

  return (
    <div className="flexBetween">
      <div className="flexColumn">
        <Charts
          className="ring-charts"
          option={getRingarea(leftTopData ? leftTopData.district_count : 0)}
        />
        <div className="arac_title">捐款省份（个）</div>
      </div>
      <div className="flexColumn">
        <Charts
          className="ring-charts"
          option={getRingproject(leftTopData ? leftTopData.group_count : 0)}
        />
        <div className="arac_title">已加入机构（个）</div>
      </div>
    </div>
  )
}
