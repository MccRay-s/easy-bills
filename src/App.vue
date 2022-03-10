<script setup lang="ts">
import { format } from 'date-fns'
import { useEchart } from '~/logic/echart'
import { categoryPie, position } from '~/logic/index'
import { isDark, toggleDark } from '~/composables'
import Modal1 from '~/components/Modal.vue'
import { vDrag } from '~/directives/index'
import { useBill } from '~/logic/bill'

const addButton = ref<HTMLElement>()
const {
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
  openAdding,
  handleSaveBill,
  handleCsvFile,
  autoLoadCsv,
} = useBill(addButton)
const {
  VChart,
  categaryOptions,
  expensesOptions,
  toggleCategoryPie,
} = useEchart()

watch(() => billInfo.category, (newCategory) => {
  if (newCategory) {
    const categoryInfo = categoryList.value.find(o => o.id === newCategory)!
    billInfo.type = categoryInfo.type
    billInfo.categoryName = categoryInfo.name
  }
})
watch(() => billList.value, () => {
  categaryOptions.value.series[0].data = categoryChartData.value
  const monthStr = format(currMounth.value, 'yyyy年MM月')
  categaryOptions.value.title.subtext = monthStr
  expensesOptions.value.title.subtext = monthStr
  expensesOptions.value.xAxis.data = expensesStatistics.value.map(o => o.date)
  expensesOptions.value.series[0].data = expensesStatistics.value.map(o => o.expenses)
})

onMounted(() => {
  autoLoadCsv()
})
</script>
<template>
  <main
    font-sans
    class="box-border"
    text="center gray-700 dark:gray-200"
  >
    <h2
      class="mb-6 sticky text-2xl p-6 rounded-t-md font-semibold text-gray-700 dark:text-gray-200 "
      top="0"
      z="10"
      shadow="lg"
      bg="white dark:gray-800"
    >
      简易记账本
    </h2>

    <div
      class="container mx-auto grid px-4 rounded-md h-full overflow-y-auto"
      bg="gray-100 dark:gray-700"
    >
      <header
        bg="white dark:gray-800"
        class="w-full bg-white my-6 shadow-xs  items-center h-16 rounded-2xl"
      >
        <div class="container flex items-center justify-between h-full px-6 mx-auto ">
          <!-- Search input -->
          <div class="flex justify-center flex-1 lg:mr-32">
            <div class="relative w-full max-w-xl mr-6">
              <div class="absolute inset-y-0 flex items-center pl-2">
                <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                class="block w-full leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-700 text-gray-400 aa-input"
                p="y-1.5 l-8 r-4"
                placeholder="输入账单分类查询"
              >
            </div>
          </div>
          <ul class="flex items-center flex-shrink-0">
            <li v-if="!hasCategory && !hasBillList" class="flex">
              <button
                bg="hover:gray-100 dark:hover:gray-600"
                p="x-2 y-1"
                m="r-2"
                class="flex items-center justify-center w-full transition-colors duration-200 transform border rounded-md focus:outline-none focus:shadow-outline-purple"
                @click="showImport = true"
              >
                <div i-uiw:file-excel />
                <span class="mx-1">
                  导入
                </span>
              </button>
            </li>
            <!-- Theme toggler -->
            <li class="flex">
              <button
                bg="hover:gray-100 dark:hover:gray-600"
                class="p-2 rounded-md transition-colors duration-200 focus:outline-none focus:shadow-outline-purple"
                @click="toggleDark()"
              >
                <template v-if="!isDark">
                  <div i-carbon-sun />
                </template>
                <template v-if="isDark">
                  <div i-carbon-moon />
                </template>
              </button>
            </li>
          </ul>
        </div>
      </header>

      <div
        class="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left h-80"
      >
        <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 日历 -->
          <MonthPicker
            v-model="currMounth"
            class="h-80"
            :max-year="2022"
          />
          <!-- 收支总金额 -->
          <div class="flex flex-col justify-between justify-items-center h-full h-80">
            <div
              class="flex items-center p-4 rounded-lg shadow-xs"
              bg="white dark:gray-800"
            >
              <div
                class="p-3 mr-4 rounded-full "
                text="red-400 dark:red-100"
                bg="red-100 dark:red-500"
              >
                <div i-ri:money-cny-circle-fill />
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  月支出
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                  {{ totalPay }}
                </p>
              </div>
            </div>
            <div
              class="flex items-center p-4 rounded-lg shadow-xs"
              bg="white dark:gray-800"
            >
              <div
                class="p-3 mr-4 text-green-500  rounded-full dark:text-green-100 "
                bg="green-100 dark:green-500"
              >
                <div i-ic:baseline-account-balance-wallet />
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  月收入
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                  {{ totalIncome }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center p-4 rounded-lg shadow-xs"
              bg="white dark:gray-800"
            >
              <div
                class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500"
              >
                <div i-carbon:piggy-bank />
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  月结余
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                  {{ totalIncome - totalPay }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 bg-white rounded-lg dark:bg-gray-800 h-80">
          <div
            v-show="!categoryPie"
            class="overflow-y-scroll h-full"
          >
            <div class="flex justify-between justify-item-center sticky z-10 top-0 shadow bg-white  dark:bg-gray-800">
              <div
                text="lg gray-700 dark:gray-200"
              >
                分类支出金额统计（{{ format(currMounth,'yyyy年MM月') }}）
              </div>
              <div
                i-teenyicons:pie-chart-solid
                @click="toggleCategoryPie()"
              />
            </div>
            <table class="w-full whitespace-no-wrap table-fixed">
              <thead>
                <tr
                  gb="gray-50 dark:gray-800"
                  border="b gray-300 dark:gray-700"
                  text="xs left uppercase gray-500 dark:gray-400"
                  class="font-semibold tracking-wide"
                >
                  <th class="px-4 py-3 w-2/5">
                    分类
                  </th>
                  <th class="px-4 py-3 w-1/5">
                    金额
                  </th>
                </tr>
              </thead>
              <tbody
                bg="white dark:gray-800"
                divide="y gray-200 dark:gray-700"
              >
                <tr
                  v-for="item in categoryChartData"
                  :key="`${item.name}`"
                  class="text-gray-700 dark:text-gray-400"
                >
                  <td class="px-4 py-3 truncate">
                    {{ item.name }}
                  </td>
                  <td class="px-4 py-3 text-sm text-red-400">
                    ¥{{ item.value?.toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <v-chart
            v-if="categoryPie"
            :theme="isDark ? 'dark': 'light'"
            class="h-full"
            :option="categaryOptions"
          />
        </div>
      </div>

      <!-- Data Table -->
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="w-full overflow-y-scroll h-96">
          <table class="w-full whitespace-no-wrap table-fixed">
            <thead>
              <tr
                text="center gray-500 dark:gray-200"
                bg="gray-50 dark:gray-800"
                border="b gray-300 dark:gray-700"
                class="text-xs font-semibold tracking-wide uppercase"
              >
                <th class="px-4 py-3 w-2/5">
                  分类
                </th>
                <th class="px-4 py-3 w-1/5">
                  金额
                </th>
                <th class="px-4 py-3 w-2/5">
                  时间
                </th>
              </tr>
            </thead>
            <tbody
              bg="white dark:gray-800"
              divide="y gray-200 dark:gray-700"
            >
              <tr
                v-for="item in billList"
                :key="`${item.id}`"
                class="text-gray-700 dark:text-gray-400"
              >
                <td class="px-4 py-3 truncate">
                  {{ item.categoryName || item.category }}
                </td>
                <td class="px-4 py-3 text-sm">
                  <span
                    :class="item.type === 1 ? 'text-green-700': 'text-red-400'"
                    class="px-2 py-1 font-semibold leading-tight"
                  >
                    ¥{{ item.amount?.toFixed(2) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs">
                  {{ format(item.time,'yyyy-MM-dd HH:mm:ss') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="w-full min-h-96 my-6 p-4 bg-white rounded-lg shadow-xs"
        bg="white dark:gray-800"
      >
        <v-chart
          :theme="isDark ? 'dark': 'light'"
          class="chart"
          :option="expensesOptions"
        />
      </div>

      <div
        v-show="!showAdd"
        ref="addButton"
        v-drag="'RB'"
        class="absolute p-4 text-blue-600 bg-blue-300 shadow-lg rounded-full dark:text-blue-100 dark:bg-blue-500"
        :style="{right: `${position.x}px`, bottom: `${position.y}px`}"
        cursor="pointer"
        z="100"
        @click="openAdding"
      >
        <div i-mdi:plus />
      </div>

      <Modal1 v-model="showImport" title="导入账单">
        <div class="p-6">
          <p
            class="font-normal"
            text="sm gray-500 dark:gray-400"
          >
            请选择文件导入
          </p>
          <ul class="my-4 space-y-3">
            <li class="relative">
              <input
                v-if="!hasCategory"
                id="categoryFile"
                name="category"
                type="file"
                class="absolute inset-0 invisible"
                @change="handleCsvFile"
              >
              <label
                for="categoryFile"
                bg="gray-50 hover:gray-100 dark:gray-600 dark:hover:gray-500 text-base text-gray-900 dark:text-white"
                class="cursor-pointer flex items-center p-3 font-bold rounded-lg group hover:shadow"
              >
                <span i-uiw:file-excel text="green-400" />
                <span class="flex-1 ml-3 whitespace-nowrap text-left">选择账单分类</span>
                <span v-show="hasCategory" class="inline-flex items-center justify-center p-1.5 ml-3 text-xs font-medium text-green-500 bg-green-100 rounded-full">
                  <i i-ep:success-filled />
                </span>
              </label>
            </li>
            <li class="relative cursor-pointer">
              <input
                v-if="!hasBillList"
                id="billFile"
                name="billInfo"
                type="file"
                class="absolute inset-0 invisible"
                @change="handleCsvFile"
              >
              <label
                for="billFile"
                bg="gray-50 hover:gray-100 dark:gray-600 dark:hover:gray-500 text-base text-gray-900 dark:text-white"
                class="cursor-pointer flex items-center p-3 font-bold rounded-lg group hover:shadow"
              >
                <span i-uiw:file-excel text="green-400" />
                <span class="flex-1 ml-3 whitespace-nowrap text-left">选择账单明细</span>
                <span v-show="hasBillList" class="inline-flex items-center justify-center p-1.5 ml-3 text-xs font-medium text-green-500 bg-green-100 rounded-full">
                  <i i-ep:success-filled />
                </span>
              </label>
            </li>
          </ul>
          <div>
            <a class="inline-flex items-center text-sm font-normal text-gray-500 dark:text-gray-200">
              <i i-ic:outline-tips-and-updates />
              先导入账单分类，再导入账单明细</a>
          </div>
        </div>
      </Modal1>

      <Modal1 v-model="showAdd" title="添加账单">
        <form class="px-6 pb-4 space-y-6 mt-4 lg:px-8 sm:pb-6 xl:pb-8" action="#">
          <!-- <h3 class="text-xl font-medium text-gray-900 dark:text-white">
          Sign in to our platform
        </h3> -->
          <div>
            <label
              for="category"
              class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-gray-300"
            >账单分类</label>
            <select
              id="category"
              v-model="billInfo.category"
              bg="gray-50 dark:gray-600"
              class="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            >
              <option
                v-for="category in categoryList"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }} ({{ ['支出','收入'][category.type] }})
              </option>
            </select>
          </div>
          <div>
            <label
              for="amount"
              class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-gray-300"
            >账单金额</label>
            <input
              id="amount"
              v-model.number="billInfo.amount"
              type="text"
              name="amount"
              placeholder="请输入金额"
              bg="gray-50 dark:gray-600"
              class="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            >
          </div>
          <button
            type="button"
            :disabled="!canSaveBill"
            :class="{'cursor-not-allowed' : !canSaveBill }"
            class="disabled:opacity-50 w-full text-white mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            @click="handleSaveBill"
          >
            确定
          </button>
        </form>
      </Modal1>
    </div>
    <Footer />
  </main>
</template>
