import React from 'react'
import { BorderBox8, Charts } from '@jiaminghi/data-view-react'
import './MainBottom.less'

function detailOne(data) {
  return {
    title: {
      text: '近7天捐款人数分析',
      style: {
        fill: '#8CE6FE',
        fontSize: 17,
        fontWeight: 'bold',
      },
    },
    xAxis: {
      data: data.project_asynic.time,
      axisTick: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
        },
      },
      axisTick: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
        },
      },
      axisLabel: {
        style: {
          fill: '#fff',
          fontSize: 15,
          rotate: 0,
        },
      },
      nameTextStyle: {
        fill: '#fff',
        fontSize: 10,
      },
    },
    yAxis: {
      name: '金额（元）',
      data: 'value',
      axisTick: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
          fontSize: 15,
        },
      },
      axisTick: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
        },
      },
      axisLabel: {
        style: {
          fill: '#fff',
          fontSize: 12,
          rotate: 0,
        },
      },
      nameTextStyle: {
        fill: '#fff',
        fontSize: 8,
      },
    },
    series: [
      {
        data: data.project_asynic.total,
        type: 'bar',
        stack: 'a',
        gradient: {
          color: ['#ffffff'],
        },
        independentColor: true,
        label: {
          show: true,
          position: 'top',
          style: {
            fontSize: 13,
          },
        },
        barWidth: '40',
      },
    ],
  }
}

function detailTwo(data) {
  return {
    title: {
      text: '类型分布分析',
      style: {
        fill: '#8CE6FE',
        fontSize: 17,
        fontWeight: 'bold',
      },
    },
    xAxis: {
      data: data.project_donate.name,
      axisTick: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
        },
      },
      axisTick: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
        },
      },
      axisLabel: {
        style: {
          fill: '#fff',
          fontSize: 15,
          rotate: 0,
        },
      },
      nameTextStyle: {
        fill: '#fff',
        fontSize: 10,
      },
    },
    yAxis: {
      name: '百分比（%）',
      data: 'value',
      axisTick: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
          fontSize: 15,
        },
      },
      axisTick: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
        },
      },
      axisLabel: {
        style: {
          fill: '#fff',
          fontSize: 12,
          rotate: 0,
        },
      },
      nameTextStyle: {
        fill: '#fff',
        fontSize: 8,
      },
    },
    series: [
      {
        data: data.project_donate.value,
        type: 'bar',
        stack: 'a',
        gradient: {
          color: ['#ffffff'],
        },
        independentColor: true,
        label: {
          show: true,
          position: 'top',
          style: {
            fontSize: 13,
          },
        },
        barWidth: '40',
      },
    ],
  }
}

export default props => {
  const { mainBottomData } = props

  return (
    <div className="main">
      <div className="main_bottom_modal_two">
        <BorderBox8>
          <Charts className="ring-charts" option={detailTwo(mainBottomData)} />
        </BorderBox8>
        <BorderBox8>
          <Charts className="ring-charts" option={detailOne(mainBottomData)} />
        </BorderBox8>
      </div>
    </div>
  )
}
