<script lang="ts" setup>
import { isDate } from 'date-fns'
const emits = defineEmits(['change', 'update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Date,
    required: true,
  },
  minYear: {
    type: Number,
    default: 1980,
  },
  maxYear: {
    type: Number,
    default: -1,
  },
})
const mounths = ref<Array<String>>([
  '一月', '二月', '三月',
  '四月', '五月', '六月',
  '七月', '八月', '九月',
  '十月', '十一月', '十二月',
])
const year = ref<number>(new Date().getFullYear())
const selectedYear = ref<number>(new Date().getFullYear())
const currMonthIndex = ref<number>(-1)

const nowMonth = computed(() => {
  return new Date().getMonth()
})
const canAddYear = computed(() => {
  return props.maxYear === -1 || year.value < props.maxYear
})
const canReduceYear = computed(() => {
  return props.minYear <= year.value - 1
})
const date = computed(() => {
  const month = currMonthIndex.value
  return new Date(selectedYear.value, month, 1)
})

const selectedMonth = (index: number) => {
  currMonthIndex.value = index
  selectedYear.value = year.value
  emits('change', date.value)
  emits('update:modelValue', date.value)
}

onMounted(() => {
  if (isDate(props.modelValue)) {
    year.value = props.modelValue.getFullYear()
    selectedYear.value = year.value
    currMonthIndex.value = props.modelValue.getMonth()
  }
})
</script>
<template>
  <div class="monthpicker-picker inline-block rounded-lg bg-white dark:bg-gray-800 p-4">
    <div class="monthpicker-header">
      <div
        bg="white dark:gray-800 "
        text="center dark:white "
        class="monthpicker-title p-2 mb-2 font-semibold"
        border="b gray-200 dark:gray-700"
      >
        选择月份
      </div>
      <div class="monthpicker-controls flex justify-between mb-2">
        <button
          type="button"
          bg="white dark:gray-800 hover:gray-100 dark:hover:gray-600"
          text="gray-500 dark:white hover:gray-900 dark:hover:white 2xl"
          class="disabled:opacity-50 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
          :class="canReduceYear ? 'cursor-pointer': 'cursor-not-allowed'"
          :disabled="!canReduceYear"
          @click="year-=1"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
        </button>
        <div
          bg="white dark:gray-800"
          text="gray-500 dark:gray-200 hover:gray-900 dark:hover:white 2xl"
          class="rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {{ year }}
        </div>
        <button
          type="button"
          bg="white dark:gray-800 hover:gray-100 dark:hover:gray-600"
          text="gray-500 dark:white hover:gray-900 dark:hover:white 2xl"
          class="disabled:opacity-50 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 "
          :class="canAddYear ? 'cursor-pointer': 'cursor-not-allowed'"
          :disabled="!canAddYear"
          @click="year+=1"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </button>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(mounth,i) in mounths" :key="`${mounth}`"
          text="sm center gray-900 dark:white"
          cursor="pointer"
          p="2"
          rounded="lg"
          class="block leading-9 font-semibold relative"
          :class="{
            'bg-gray-100 dark:bg-gray-600': year === selectedYear && currMonthIndex === i
          }"
          bg="hover:gray-100 dark:hover:gray-600"
          @click="selectedMonth(i)"
        >
          {{ mounth }}
          <span
            v-if="nowMonth === i"
            right="10px"
            bottom="5px"
            w="3" h="3"
            class="bg-blue rounded-full absolute"
          />
        </div>
      </div>
    </div>
  </div>
</template>
