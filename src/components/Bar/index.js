import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'
function Bar ({ title, xData, yData, style }) {
  const domRef = useRef()
  const chartInit = () => {
    // Initializing echarts instances
    const myChart = echarts.init(domRef.current)
    // Charting
    myChart.setOption({
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        data: xData
      },
      yAxis: {},
      series: [
        {
          name: 'Percentage',
          type: 'bar',
          data: yData
        }
      ]
    })
  }
  useEffect(()=>{
    chartInit()
  }, [])
  return (
    <div>
      <div ref={domRef} style={style}></div>
    </div>
  )
}

export default Bar