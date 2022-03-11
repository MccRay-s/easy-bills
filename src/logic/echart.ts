import { format } from 'date-fns'
import { registerTheme, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { CategoryChartItem } from '~/types'
import echartDark from '~/styles/echartThemes/Dark.json'
import echartLight from '~/styles/echartThemes/Light.json'
import { categoryPie } from '~/logic'
const xAxisDatas: Array<Date> = []
const seriesDatas: Array<number> = []
const categoryDatas: Array<CategoryChartItem> = []

export const useEchart = () => {
  const toggleCategoryPie = useToggle(categoryPie)
  registerTheme('dark', echartDark)
  registerTheme('light', echartLight)
  use([
    CanvasRenderer,
    PieChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
  ])
  // 分类统计
  const categaryOptions = ref({
    title: {
      text: '分类支出金额统计',
      subtext: '2022年1月',
      left: 'left',
    },
    toolbox: {
      iconStyle: {
        borderWidth: 1,
        borderType: 'solid',
      },
      right: 20,
      show: true,
      feature: {
        myTool1: {
          show: true,
          title: '显示列表',
          icon: 'M3 14h4v-4H3v4zm0 5h4v-4H3v4zM3 9h4V5H3v4zm5 5h13v-4H8v4zm0 5h13v-4H8v4zM8 5v4h13V5H8z',
          onclick: toggleCategoryPie,
        },
        saveAsImage: {
          title: '下载图片',
        },
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} ¥{c}',
    },
    legend: {
      orient: 'horizontal',
      bottom: 5,
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        minAngle: 6,
        data: categoryDatas,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })

  // 支出图表
  const expensesOptions = ref({
    title: {
      text: '支出统计',
      subtext: '2022年1月',
      left: 'center',
    },
    xAxis: {
      name: '日期',
      // type: 'time',
      data: xAxisDatas,
      axisLabel: {
        interval: 0,
        formatter(value: string) {
          return new Date(value).getDate()
        },
      },
      boundaryGap: ['20%', '20%'],
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const dateItem = format(new Date(params[0].name), 'yyyy-MM-dd')
        return `<p style="text-align:left;">${dateItem}<br/>
      <span style="color:#F87171;">¥${params[0].value?.toFixed(2)}</span></p>`
      },
    },
    yAxis: {
      name: '金额',
      type: 'value',
    },
    series: [
      {
        data: seriesDatas,
        type: 'bar',
      },
    ],
  })

  return {
    VChart,
    categaryOptions,
    expensesOptions,
    toggleCategoryPie,
  }
}
