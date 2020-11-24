import React, { Component } from 'react'
import echarts from 'echarts'
import 'echarts/map/js/china'
// import geoJson from 'echarts/map/json/china.json'
// import geoJson from './json/geo.js'

import './MainMain.less'

class MainMain extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.initalECharts()
  }

  initalECharts() {
    this.setState({ myChart1: echarts.init(document.getElementById('mainMap')) }, () => {
      this.state.myChart1.setOption({
        tooltip: {
          trigger: 'item',
        },

        visualMap: {
          min: 0,
          left: '15%',
          max: 10000,
          text: ['高', '低'], // 文本，默认为数值文本
          splitNumber: 0,
          color: ['#0054bb', '#85ADDE'],
          textStyle: {
            color: '#c3dbff',
          },
        },

        series: [
          {
            name: '全国捐款人数分布',
            type: 'map',
            mapType: 'china',
            mapLocation: {
              x: 'left',
            },

            itemStyle: {
              normal: { label: { show: true, color: '#fff' }, borderWidth: 0 },
            },

            data: [
              { name: '西藏', value: 100 },
              { name: '青海', value: 200 },
              { name: '宁夏', value: 300 },
              { name: '海南', value: 400 },
              { name: '甘肃', value: 500 },
              { name: '贵州', value: 600 },
              { name: '新疆', value: 700 },
              { name: '云南', value: 800 },
              { name: '重庆', value: 900 },
              { name: '吉林', value: 1000 },
              { name: '山西', value: 1500 },
              { name: '天津', value: 2000 },
              { name: '江西', value: 2500 },
              { name: '广西', value: 3000 },
              { name: '陕西', value: 3500 },
              { name: '黑龙江', value: 5500 },
              { name: '内蒙古', value: 500 },
              { name: '安徽', value: 1000 },
              { name: '北京', value: 6000 },
              { name: '福建', value: 2000 },
              { name: '上海', value: 3000 },
              { name: '湖北', value: 4500 },
              { name: '湖南', value: 3000 },
              { name: '四川', value: 3000 },
              { name: '辽宁', value: 2000 },
              { name: '河北', value: 3500 },
              { name: '河南', value: 3200 },
              { name: '浙江', value: 2450 },
              { name: '山东', value: 5000 },
              { name: '江苏', value: 8000 },
              { name: '广东', value: 7000 },
              { name: '台湾', value: 1300 },
              { name: '南海诸岛', value: 1210 },
            ],
          },
        ],
      })
    })
  }

  render() {

    return (
      <div className="main_body">
        <div className="col-lg-6 fill-h" style={{ width: '50%' }}>
          <div className="xpanel-wrapper xpanel-wrapper-5">
            <div className="xpanel" style={{ position: 'relative' }}>
              <div className="map_bg"></div>
              <div className="circle_allow"></div>
              <div className="circle_bg"></div>
              <div className="fill-h" id="mainMap"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MainMain
