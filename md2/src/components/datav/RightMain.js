import React from 'react'
import { Charts } from '@jiaminghi/data-view-react'
import './RightMain.less'

function getRingarea(data) {
  let perNumber = 0

  if (data != 0) {
    var allNumber = Number(data.man) + Number(data.woman)
    perNumber = parseInt((Number(data.man) / allNumber) * 100)
  }

  return {
    series: [
      {
        type: 'gauge',
        startAngle: -Math.PI / 2,
        endAngle: Math.PI * 1.5,
        arcLineWidth: 11,
        radius: '75%',
        data: [{ name: '男', value: perNumber, gradient: ['#1D82FF', '#24F0E4', '#2fded6'] }],
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
          formatter: '{value}%男',
          style: {
            fill: '#1ed3e5',
            fontSize: 20,
          },
        },
      },
    ],
  }
}

function getRingproject(data) {
  let perNumber = 0

  if (data != 0) {
    var allNumber = Number(data.man) + Number(data.woman)
    perNumber = parseInt((Number(data.woman) / allNumber) * 100)
  }

  return {
    series: [
      {
        type: 'gauge',
        startAngle: -Math.PI / 2,
        endAngle: Math.PI * 1.5,
        arcLineWidth: 11,
        radius: '75%',
        data: [{ name: '女', value: perNumber, gradient: ['#1D82FF', '#24F0E4', '#2fded6'] }],
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
          formatter: '{value}%女',
          style: {
            fill: '#1ed3e5',
            fontSize: 20,
          },
        },
      },
    ],
  }
}

export default props => {
  const { rightMainData } = props

  return (
    <div className="main">
      <div className="right_main_title">男女占比</div>
      <div className="flexBetween">
        <div className="flexColumn">
          {rightMainData ? (
            <Charts className="ring-charts" option={getRingarea(rightMainData)} />
          ) : (
            <Charts className="ring-charts" option={getRingarea(0)} />
          )}
        </div>
        <div className="flexColumn">
          {rightMainData ? (
            <Charts className="ring-charts" option={getRingproject(rightMainData)} />
          ) : (
            <Charts className="ring-charts" option={getRingproject(0)} />
          )}
        </div>
      </div>
    </div>
  )
}
