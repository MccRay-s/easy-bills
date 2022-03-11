import { isEqual, isSameDay, isSameMonth } from 'date-fns'
import type { Ref } from 'vue'
import type { BillInfo, Category, CategoryChartItem, CategoryDayItem } from '~/types'
import { getCountDays, guid, loadFile, toFixed } from '~/util'

export const useBill = (addTargetRef: Ref<HTMLElement| undefined>) => {
  const allBill = ref<Array<BillInfo>>([])
  const categoryList = ref<Array<Category>>([])
  const showImport = ref(false)
  const showAdd = ref(false)
  const currMounth = ref<Date>(new Date())
  const searchText = ref<string>('')
  const searchKey = ref<string>('')
  const billInfo = reactive<BillInfo>({
    id: '',
    type: -1,
    time: new Date(),
    category: '',
    amount: 0,
  })
  const billList = computed((): Array<BillInfo> => {
    return allBill.value
      // 过滤当月&分类
      .filter(o => isSameMonth(o.time, currMounth.value)
        && (searchKey.value
          ? o.categoryName?.includes(searchKey.value)
          : true),
      )
      // 排序: 日期 > 金额
      .sort((a, b) => {
        const aTime = a.time.getTime()
        const bTime = b.time.getTime()
        if (!isEqual(aTime, bTime))
          return bTime - aTime
        return b.amount - a.amount
      })
  })
  const hasCategory = computed(() => !!categoryList.value.length)
  const hasBillList = computed(() => !!allBill.value.length)
  const canSaveBill = computed(() => {
    return billInfo.category && billInfo.type !== -1 && billInfo.amount
  })
  // 月收入
  const totalIncome = computed(() => {
    if (hasBillList.value) {
      return billList.value.filter(o => o.type === 1).reduce(
        (accumulator, currentValue) => accumulator + currentValue.amount, 0,
      )
    }
    return 0
  })
  // 月支出
  const totalPay = computed(() => {
    if (hasBillList.value) {
      return billList.value.filter(o => o.type === 0).reduce(
        (accumulator, currentValue) => accumulator + currentValue.amount, 0,
      )
    }
    return 0
  })

  const categoryChartData = computed((): Array<CategoryChartItem> => {
    const list: Array<CategoryChartItem> = []
    const map = new Map<string, { expenses: number }>()
    for (const billItem of billList.value.filter(o => o.type === 0)) {
      const { categoryName, amount } = billItem
      if (categoryName) {
        if (map.has(categoryName)) {
          const categoryItem = map.get(categoryName)!
          categoryItem.expenses += toFixed(Math.abs(Number(amount)), 2)
        }
        else {
          map.set(categoryName, {
            expenses: toFixed(Math.abs(Number(amount)), 2),
          })
        }
      }
    }
    map.forEach((item, key) => {
      list.push({ name: key, value: item.expenses })
    })
    return list.sort((a, b) => b.value - a.value)
  })

  const expensesStatistics = computed((): Array<CategoryDayItem> => {
    const totalDays = getCountDays(currMounth.value)
    const year = currMounth.value.getFullYear()
    const month = currMounth.value.getMonth()
    return Array(totalDays).fill(0).map((item, i) => {
      const itemDate = new Date(year, month, (i + 1))
      const expenses = billList.value
        .filter(o => o.type === 0 && isSameDay(itemDate, o.time))
        .reduce((prevAmt, currentValue) => prevAmt + currentValue.amount, 0) || 0
      return {
        date: itemDate,
        expenses: toFixed(expenses, 2),
      }
    })
  })

  /**
   * 显示添加
   */
  const openAdding = () => {
    const action = addTargetRef.value?.getAttribute('action')
    if (action === 'open') {
      billInfo.id = ''
      billInfo.type = -1
      billInfo.category = ''
      billInfo.amount = 0
      showAdd.value = true
    }
  }

  /**
   * 保存
   */
  const handleSaveBill = async() => {
    billInfo.id = guid()
    billInfo.time = new Date()
    allBill.value.unshift(billInfo)
    await nextTick()
    showAdd.value = false
  }

  /**
   * 账单导入
   * @param e
   */
  const handleCsvFile = async(e: Event) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        const contents = reader.result as string
        const rows = contents.split('\n').slice(1)

        rows.forEach((item, i) => {
          const row = item.split(',')
          if (row.length === 4) {
            const [type, time, category, amount] = row
            const info: BillInfo = {
              id: `${i}`,
              type: Number(type),
              time: new Date(Number(time)),
              category,
              amount: toFixed(Math.abs(Number(amount)), 2),
            }
            if (categoryList.value.length > 0) {
              const name = categoryList.value.find(o => o.id === category)?.name || ''
              if (name)
                info.categoryName = name
            }

            allBill.value.push(info)
          }
          else {
            const [id, type, name] = row
            categoryList.value.push(
              {
                id,
                type: Number(type),
                name,
              },
            )
          }
        })
      }
    }
  }

  /**
   * 处理Excel 数据
   * @param categoryContent 分类
   * @param billContent 账单
   */
  const _parseData = (categoryContent: string, billContent: string) => {
    const categoryRows = categoryContent.split('\n').slice(1)
    const billRows = billContent.split('\n').slice(1)
    categoryRows.forEach((item) => {
      const row = item.split(',')
      const [id, type, name] = row
      categoryList.value.push(
        {
          id,
          type: Number(type),
          name,
        },
      )
    })
    const list: Array<BillInfo> = []
    billRows.forEach((item) => {
      const row = item.split(',')
      const [type, time, category, amount] = row
      const categoryName = categoryList.value.find(o => o.id === category)?.name || ''
      const info: BillInfo = {
        id: guid(),
        type: Number(type),
        time: new Date(Number(time)),
        category,
        categoryName,
        amount: toFixed(Math.abs(Number(amount)), 2),
      }
      list.push(info)
    })
    allBill.value = list
  }

  const handleSearch = () => {
    searchKey.value = searchText.value
  }

  /**
   * 加载数据
   */
  const autoLoadCsv = async() => {
    const [categoryContent, billContent] = await Promise.all([loadFile(`${window.origin}/data/categories.csv`), loadFile(`${window.origin}/data/bill.csv`)])
    _parseData(categoryContent, billContent)
  }

  return {
    allBill,
    categoryList,
    showImport,
    showAdd,
    currMounth,
    billInfo,
    billList,
    hasCategory,
    hasBillList,
    canSaveBill,
    totalIncome,
    totalPay,
    categoryChartData,
    expensesStatistics,
    searchText,
    searchKey,
    openAdding,
    handleCsvFile,
    handleSaveBill,
    autoLoadCsv,
    handleSearch,
  }
}
