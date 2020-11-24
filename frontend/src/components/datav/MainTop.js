import React from 'react'

import './MainTop.less'

//本年筹款总额
function yearMoneyLeft(data) {
 
  if (data == undefined) {
    data = 0
  }
  let money = {
    moneyLeft: [],
    moneyRight: [],
  }

  let spData = data.toString().split('.')

  for (let i in data.toString().split('.')[0]) {
    money.moneyLeft.push(spData[0][i])
  }

  for (let i in data.toString().split('.')[1]) {
    money.moneyRight.push(spData[1][i])
  }

  return money
}



export default props => {
  const { mainTopData } = props
  return (
    <div className="main">
      <div className="flex main_top_one">
        <div className="flexcolumnleft main_top_one_left">
          <div className="main_top_one_left_name">本年筹款总额（元）</div>
          <div className="flex">
            {yearMoneyLeft(mainTopData.total).moneyLeft.map((item: any, i: any) => {
              return (
                <div className="main_top_line flexColumn" key={i}>
                  {item}
                </div>
              )
            })}

            {yearMoneyLeft(mainTopData.total).moneyRight.length > 0 ? (
              <div className="flex">
                <div className="main_top_dian flexColumn">.</div>
                {yearMoneyLeft(mainTopData.total).moneyRight.map((item: any, i: any) => {
                  return (
                    <div className="main_top_line flexColumn" key={i}>
                      {item}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="flexcolumnleft main_top_one_right">
          <div className="main_top_one_left_name">捐款人次</div>
          <div className="flex">
            {yearMoneyLeft(mainTopData.total_count).moneyLeft.map((item: any, i: any) => {
              return (
                <div className="main_top_line flexColumn" key={i}>
                  {item}
                </div>
              )
            })}
          </div>
        </div>
     
      </div>
      <div className="flex main_top_one">
        <div className="flexcolumnleft main_top_one_left">
          <div className="main_top_one_left_name">今日筹款总额（元）</div>
          <div className="flex">
            {yearMoneyLeft(mainTopData.now).moneyLeft.map((item: any, i: any) => {
              return (
                <div className="main_top_line flexColumn" key={i}>
                  {item}
                </div>
              )
            })}

            {yearMoneyLeft(mainTopData.now).moneyRight.length > 0 ? (
              <div className="flex">
                <div className="main_top_dian flexColumn">.</div>
                {yearMoneyLeft(mainTopData.now).moneyRight.map((item: any, i: any) => {
                  return (
                    <div className="main_top_line flexColumn" key={i}>
                      {item}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="flexcolumnleft main_top_one_right">
          <div className="main_top_one_left_name">今日捐款人次</div>
          <div className="flex">
            {yearMoneyLeft(mainTopData.count).moneyLeft.map((item: any, i: any) => {
              return (
                <div className="main_top_line flexColumn" key={i}>
                  {item}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
