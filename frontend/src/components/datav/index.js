import React, { useState, useEffect } from 'react'
import { FullScreenContainer, BorderBox1 } from '@jiaminghi/data-view-react'

import TopHeader from './TopHeader'
import LeftTop from './LeftTop'
import LeftBottom from './LeftBottom'
import MainTop from './MainTop'
import MainMain from './MainMain'
import MainBottom from './MainBottom'
import RightTop from './RightTop'
import RightMain from './RightMain'
import RightBottom from './RightBottom'

import io from 'socket.io-client'

import './index.less'
const ENDPOINT = 'http://datalq.peifude.com/datalq'

export default () => {
  const [leftTopData, setleftTopData] = useState(null)
  const [leftBottomData, setleftBottomData] = useState([])
  const [mainTopData, setmainTopData] = useState(' ')
  const [mainBottomData, setmainBottomData] = useState(null)
  // const [rightTopData, setrightTopData] = useState([])
  const [rightMainData, setrightMainData] = useState('')
  const [rightBottomData, setrightBottomData] = useState([])

  useEffect(() => {
    const socket = io(ENDPOINT)

    let interval

    let dataList

    socket.on('connect', () => {
      socket.emit('init', { msg: 'init' })
      if (interval) {
        clearInterval(interval)
      }
    })
    socket.on('init', data => {
      socket.emit('data3', { msg: {} })  //获取男女占比
      socket.emit('data7', { msg: {} }) //获取捐款列表
    })

    // 捐款总额
    socket.on('data1', data => {
      setmainTopData(data.total)
      socket.emit('data2', { msg: {} })
    })

    //类型分布/近7天
    socket.on('data2', data => {
      setmainBottomData(data)
    })

    //捐款列表
    socket.on('data7', data => {
    
      if(data.project.length == 15){
        dataList = data.project
        setTimeout(() => {
          socket.emit('data7', { msg: dataList[0]})
          setleftBottomData(data.project)
        }, 4000)
        socket.emit('data1', { msg: {} })
      }else{
        setTimeout(() => {
          socket.emit('data7', { msg: dataList[0]})
        }, 4000)
      }
    })

    //男女占比
    socket.on('data3', data => {
      console.log("男女占比")
      setrightMainData(data.sex[0])
      socket.emit('data4', { msg: {} }) 
    })

    // 机构加入动态
    socket.on('data4', data => {
      console.log("机构加入动态")
      setrightBottomData(data.group)
      socket.emit('data6', { msg: {} })
    })


    // 捐款省份/已加入机构
    socket.on('data6', data => {
      console.log("捐款省份/已加入机构")
      setleftTopData(data.group_count)
    })

  }, [])

  return (
    <div id="data-view">
      <FullScreenContainer>
        <div className="main_header">
          <TopHeader />
        </div>
        <div className="main_content">
          <div className="content_left">
            <div id="left-top">
              <BorderBox1>
                <LeftTop leftTopData={leftTopData} />
              </BorderBox1>
            </div>

            <div id="left-bottom">
              <BorderBox1>
                {leftBottomData.length > 0 ? (
                  <LeftBottom leftBottomData={leftBottomData} />
                ) : (
                  <div></div>
                )}
              </BorderBox1>
            </div>
          </div>
          <div className="content_main">
            <div>
              <div id="main-top">
                <MainTop mainTopData={mainTopData} />
              </div>

              <div id="main-main">
                <MainMain />
              </div>
            </div>

            <div id="main-bottom">
              {mainBottomData != null ? (
                <MainBottom mainBottomData={mainBottomData} />
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="content_right">
            <div id="right-top">
              <BorderBox1>
              <RightTop />
                {/* {rightTopData.length > 0 ? <RightTop rightTopData={rightTopData} /> : <div></div>} */}
              </BorderBox1>
            </div>

            <div id="right-main">
              <BorderBox1>
                <RightMain rightMainData={rightMainData} />
              </BorderBox1>
            </div>

            <div id="right-bottom">
              <BorderBox1>
                {rightBottomData.length > 0 ? (
                  <RightBottom rightBottomData={rightBottomData} />
                ) : (
                  <div></div>
                )}
              </BorderBox1>
            </div>
          </div>
        </div>
      </FullScreenContainer>
    </div>
  )
}
